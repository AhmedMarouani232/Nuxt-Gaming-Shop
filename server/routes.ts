import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertUserSchema, insertCartItemSchema, insertOrderSchema } from "@shared/schema";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not found. Payment functionality will be disabled.');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-07-30.basil" })
  : null;

const MemStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "dev-secret-key",
      resave: false,
      saveUninitialized: false,
      store: new MemStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Passport configuration
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            return done(null, false, { message: "Invalid email or password" });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || false);
    } catch (error) {
      done(error);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());

  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, username, password, firstName, lastName } = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const user = await storage.createUser({
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed" });
        }
        res.json({ user: userWithoutPassword });
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    const { password: _, ...userWithoutPassword } = req.user as any;
    res.json({ user: userWithoutPassword });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      const { password: _, ...userWithoutPassword } = req.user as any;
      res.json({ user: userWithoutPassword });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, brand, search, preOrder, deals } = req.query;
      
      let products = await storage.getAllProducts();
      
      if (category) {
        products = products.filter(p => p.category === category);
      }
      
      if (brand) {
        products = products.filter(p => p.brand === brand);
      }
      
      if (search) {
        const searchResults = await storage.searchProducts(search as string);
        products = searchResults;
      }
      
      if (preOrder === 'true') {
        products = products.filter(p => p.isPreOrder);
      }
      
      if (deals === 'true') {
        products = products.filter(p => 
          p.originalPrice && parseFloat(p.originalPrice) > parseFloat(p.price)
        );
      }
      
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const cartItems = await storage.getCartItems((req.user as any).id);
      res.json(cartItems);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        userId: (req.user as any).id,
      });
      
      const cartItem = await storage.addToCart(cartItemData);
      res.json(cartItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItemQuantity(req.params.id, quantity);
      res.json(cartItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      await storage.removeFromCart(req.params.id);
      res.json({ message: "Item removed from cart" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ 
        message: "Payment processing is not configured. Please set STRIPE_SECRET_KEY environment variable." 
      });
    }

    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          userId: (req.user as any).id,
        },
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId: (req.user as any).id,
      });
      
      const order = await storage.createOrder(orderData);
      
      // Clear cart after successful order
      await storage.clearCart((req.user as any).id);
      
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const orders = await storage.getUserOrders((req.user as any).id);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order || order.userId !== (req.user as any).id) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
