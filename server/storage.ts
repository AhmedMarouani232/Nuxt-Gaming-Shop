import { type User, type InsertUser, type Product, type InsertProduct, type CartItem, type InsertCartItem, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User>;

  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductsByBrand(brand: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  getPreOrderProducts(): Promise<Product[]>;
  getDealsProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart methods
  getCartItems(userId: string): Promise<Array<CartItem & { product: Product }>>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: string, quantity: number): Promise<CartItem>;
  removeFromCart(id: string): Promise<void>;
  clearCart(userId: string): Promise<void>;

  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private cartItems: Map<string, CartItem>;
  private orders: Map<string, Order>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: Array<Omit<Product, 'id' | 'createdAt'>> = [
      {
        name: "Razer DeathAdder V3 Pro",
        description: "Wireless gaming mouse with Focus Pro 30K sensor and 90-hour battery life. Featuring Razer HyperSpeed wireless technology and ergonomic design.",
        price: "129.99",
        originalPrice: "159.99",
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "Gaming Mice",
        brand: "Razer",
        inStock: true,
        stockQuantity: 50,
        isPreOrder: false,
        specifications: {
          "Sensor": "Focus Pro 30K",
          "DPI": "30,000",
          "Battery Life": "90 hours",
          "Connection": "Wireless"
        },
        rating: "4.8",
        reviewCount: 1234,
        compatibility: ["PC", "Mac"],
        features: ["RGB", "Wireless", "Ergonomic"],
        tags: ["gaming", "wireless", "high-performance"]
      },
      {
        name: "Corsair K95 RGB Platinum",
        description: "Mechanical gaming keyboard with Cherry MX switches and per-key RGB lighting. Aircraft-grade aluminum frame with 6 dedicated macro keys.",
        price: "189.99",
        originalPrice: null,
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "Keyboards",
        brand: "Corsair",
        inStock: true,
        stockQuantity: 35,
        isPreOrder: false,
        specifications: {
          "Switch Type": "Cherry MX Speed",
          "Backlighting": "Per-key RGB",
          "Frame": "Aluminum",
          "Macro Keys": "6"
        },
        rating: "4.6",
        reviewCount: 892,
        compatibility: ["PC", "Mac"],
        features: ["RGB", "Mechanical", "Macro Keys"],
        tags: ["gaming", "mechanical", "rgb"]
      },
      {
        name: "SteelSeries Arctis Pro",
        description: "Premium gaming headset with Hi-Res audio certification and DTS:X v2.0. Features ClearCast bidirectional microphone and premium speaker drivers.",
        price: "249.99",
        originalPrice: null,
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "Headsets",
        brand: "SteelSeries",
        inStock: true,
        stockQuantity: 25,
        isPreOrder: false,
        specifications: {
          "Frequency Response": "10-40,000 Hz",
          "Microphone": "ClearCast",
          "Drivers": "40mm neodymium",
          "Connectivity": "Wired/Wireless"
        },
        rating: "4.9",
        reviewCount: 2156,
        compatibility: ["PC", "PS5", "Xbox", "Switch"],
        features: ["Hi-Res Audio", "Retractable Mic", "Premium Drivers"],
        tags: ["gaming", "hi-res", "premium"]
      },
      {
        name: "ASUS ROG Ultrawide 34\"",
        description: "Curved gaming monitor with 144Hz refresh rate and 1ms response time. Features NVIDIA G-SYNC compatibility and HDR10 support.",
        price: "599.99",
        originalPrice: null,
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "Monitors",
        brand: "ASUS",
        inStock: true,
        stockQuantity: 15,
        isPreOrder: false,
        specifications: {
          "Screen Size": "34 inches",
          "Resolution": "3440x1440",
          "Refresh Rate": "144Hz",
          "Response Time": "1ms"
        },
        rating: "4.7",
        reviewCount: 743,
        compatibility: ["PC", "Console"],
        features: ["G-SYNC", "HDR10", "Curved"],
        tags: ["gaming", "ultrawide", "high-refresh"]
      },
      {
        name: "NexTech Pro Gaming Rig",
        description: "Custom gaming PC with RTX 4080, Intel i7-13700K, and 32GB DDR5 RAM. Pre-built and tested for maximum performance.",
        price: "2899.99",
        originalPrice: null,
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1587831990711-23ca6441447b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "Pre-built PCs",
        brand: "NexTech",
        inStock: true,
        stockQuantity: 8,
        isPreOrder: false,
        specifications: {
          "CPU": "Intel i7-13700K",
          "GPU": "RTX 4080",
          "RAM": "32GB DDR5",
          "Storage": "1TB NVMe SSD"
        },
        rating: "4.9",
        reviewCount: 156,
        compatibility: ["PC"],
        features: ["RGB", "Liquid Cooled", "Custom"],
        tags: ["gaming", "high-end", "custom"]
      },
      {
        name: "SecretLab Titan Evo 2024",
        description: "Premium gaming chair with 4-way lumbar support and magnetic cushions. Engineered for 12+ hour gaming sessions.",
        price: "549.99",
        originalPrice: null,
        imageUrls: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "Chairs",
        brand: "SecretLab",
        inStock: false,
        stockQuantity: 0,
        isPreOrder: true,
        releaseDate: new Date('2024-03-15'),
        specifications: {
          "Material": "NEO Hybrid Leatherette",
          "Weight Capacity": "290 lbs",
          "Height Range": "5'3\" - 6'3\"",
          "Warranty": "5 years"
        },
        rating: "4.8",
        reviewCount: 4892,
        compatibility: ["Universal"],
        features: ["4-Way Lumbar", "Magnetic Cushions", "Cold-Cure Foam"],
        tags: ["gaming", "ergonomic", "premium"]
      },
      {
        name: "PlayStation 5 Console",
        description: "Next-generation gaming console with custom SSD and ray tracing support. Includes DualSense wireless controller.",
        price: "499.99",
        originalPrice: null,
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "Consoles",
        brand: "Sony",
        inStock: true,
        stockQuantity: 12,
        isPreOrder: false,
        specifications: {
          "CPU": "Custom 8-core AMD Zen 2",
          "GPU": "Custom RDNA 2",
          "RAM": "16GB GDDR6",
          "Storage": "825GB SSD"
        },
        rating: "4.8",
        reviewCount: 15432,
        compatibility: ["PS5"],
        features: ["Ray Tracing", "3D Audio", "Haptic Feedback"],
        tags: ["console", "next-gen", "exclusive"]
      },
      {
        name: "Spider-Man 2 - PS5",
        description: "Swing through Marvel's New York as both Peter Parker and Miles Morales in this epic superhero adventure. PS5 exclusive.",
        price: "69.99",
        originalPrice: null,
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "PS5 Games",
        brand: "Sony",
        inStock: true,
        stockQuantity: 100,
        isPreOrder: false,
        specifications: {
          "Platform": "PS5 Exclusive",
          "Genre": "Action-Adventure",
          "Players": "Single Player",
          "ESRB": "T for Teen"
        },
        rating: "4.9",
        reviewCount: 8765,
        compatibility: ["PS5"],
        features: ["Dual Character", "Open World", "Ray Tracing"],
        tags: ["ps5", "exclusive", "superhero"]
      },
      {
        name: "God of War Ragnarök - PS5",
        description: "Join Kratos and Atreus on their mythic journey through the Nine Realms. The epic conclusion to the Norse saga.",
        price: "59.99",
        originalPrice: "69.99",
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "PS5 Games",
        brand: "Sony",
        inStock: true,
        stockQuantity: 75,
        isPreOrder: false,
        specifications: {
          "Platform": "PS5",
          "Genre": "Action-Adventure",
          "Players": "Single Player",
          "ESRB": "M for Mature"
        },
        rating: "4.9",
        reviewCount: 12543,
        compatibility: ["PS5"],
        features: ["Norse Mythology", "Epic Story", "Enhanced Graphics"],
        tags: ["ps5", "mythology", "action"]
      },
      {
        name: "Horizon Forbidden West - PS5",
        description: "Explore a majestic but dangerous frontier in this action RPG. Enhanced for PS5 with stunning visuals and fast loading.",
        price: "49.99",
        originalPrice: "69.99",
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "PS5 Games",
        brand: "Sony",
        inStock: true,
        stockQuantity: 60,
        isPreOrder: false,
        specifications: {
          "Platform": "PS5",
          "Genre": "Action RPG",
          "Players": "Single Player",
          "ESRB": "T for Teen"
        },
        rating: "4.8",
        reviewCount: 9876,
        compatibility: ["PS5"],
        features: ["Open World", "Robot Dinosaurs", "Bow Combat"],
        tags: ["ps5", "rpg", "open-world"]
      },
      {
        name: "Call of Duty: Modern Warfare III - PS4",
        description: "The most ambitious Call of Duty campaign ever. Experience the ultimate special forces action across iconic locations.",
        price: "59.99",
        originalPrice: null,
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "PS4 Games",
        brand: "Activision",
        inStock: true,
        stockQuantity: 120,
        isPreOrder: false,
        specifications: {
          "Platform": "PS4",
          "Genre": "First-Person Shooter",
          "Players": "Single/Multiplayer",
          "ESRB": "M for Mature"
        },
        rating: "4.5",
        reviewCount: 15678,
        compatibility: ["PS4", "PS5"],
        features: ["Campaign", "Multiplayer", "Zombies"],
        tags: ["ps4", "fps", "multiplayer"]
      },
      {
        name: "Gran Turismo 7 - PS4",
        description: "The ultimate racing simulation returns with over 400 cars and legendary tracks from around the world.",
        price: "39.99",
        originalPrice: "59.99",
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "PS4 Games",
        brand: "Sony",
        inStock: true,
        stockQuantity: 85,
        isPreOrder: false,
        specifications: {
          "Platform": "PS4",
          "Genre": "Racing Simulation",
          "Players": "Single/Multiplayer",
          "ESRB": "E for Everyone"
        },
        rating: "4.7",
        reviewCount: 7234,
        compatibility: ["PS4", "PS5"],
        features: ["400+ Cars", "Legendary Tracks", "Photo Mode"],
        tags: ["ps4", "racing", "simulation"]
      },
      {
        name: "NVIDIA GeForce RTX 4080",
        description: "Ultimate GeForce gaming with Ada Lovelace architecture. Experience ray tracing and DLSS 3 with Frame Generation.",
        price: "1199.99",
        originalPrice: null,
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "Components",
        brand: "NVIDIA",
        inStock: true,
        stockQuantity: 20,
        isPreOrder: false,
        specifications: {
          "CUDA Cores": "9728",
          "Base Clock": "2205 MHz",
          "Memory": "16GB GDDR6X",
          "Memory Interface": "256-bit"
        },
        rating: "4.8",
        reviewCount: 543,
        compatibility: ["PC"],
        features: ["Ray Tracing", "DLSS 3", "AV1 Encoding"],
        tags: ["gpu", "ray-tracing", "high-end"]
      },
      {
        name: "AMD Ryzen 9 7900X",
        description: "12-core, 24-thread desktop processor built on advanced 5nm process technology. Perfect for gaming and content creation.",
        price: "549.99",
        originalPrice: null,
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "Components",
        brand: "AMD",
        inStock: true,
        stockQuantity: 30,
        isPreOrder: false,
        specifications: {
          "Cores": "12",
          "Threads": "24",
          "Base Clock": "4.7 GHz",
          "Max Boost": "5.6 GHz"
        },
        rating: "4.7",
        reviewCount: 876,
        compatibility: ["PC"],
        features: ["Zen 4 Architecture", "5nm Process", "PCIe 5.0"],
        tags: ["cpu", "high-performance", "content-creation"]
      },
      {
        name: "Xbox Wireless Controller",
        description: "Experience the modernized design of the Xbox Wireless Controller with textured grips and hybrid D-pad.",
        price: "59.99",
        originalPrice: null,
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1621259182978-fbf93132d53d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "Controllers",
        brand: "Microsoft",
        inStock: true,
        stockQuantity: 75,
        isPreOrder: false,
        specifications: {
          "Connectivity": "Wireless/Wired",
          "Compatibility": "Xbox Series X|S, Xbox One, PC",
          "Battery Life": "40 hours",
          "Features": "Textured grips, hybrid D-pad"
        },
        rating: "4.6",
        reviewCount: 3456,
        compatibility: ["Xbox", "PC"],
        features: ["Wireless", "Textured Grips", "Hybrid D-pad"],
        tags: ["controller", "xbox", "wireless"]
      },
      {
        name: "Adobe Creative Suite License",
        description: "Complete creative toolkit including Photoshop, Illustrator, Premiere Pro, and more. Annual license for content creators.",
        price: "599.99",
        originalPrice: null,
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "Software",
        brand: "Adobe",
        inStock: true,
        stockQuantity: 1000,
        isPreOrder: false,
        specifications: {
          "License Type": "Annual Subscription",
          "Platforms": "Windows, macOS",
          "Cloud Storage": "100GB",
          "Updates": "Included"
        },
        rating: "4.5",
        reviewCount: 12345,
        compatibility: ["PC", "Mac"],
        features: ["All Adobe Apps", "Cloud Storage", "Regular Updates"],
        tags: ["software", "creative", "professional"]
      },
      // Additional PS5 Games
      {
        name: "The Last of Us Part I - PS5",
        description: "Experience the groundbreaking post-apocalyptic tale completely rebuilt from the ground up for PS5 with enhanced visuals.",
        price: "59.99",
        originalPrice: "69.99",
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "PS5 Games",
        brand: "Sony",
        inStock: true,
        stockQuantity: 60,
        isPreOrder: false,
        specifications: {
          "Platform": "PS5",
          "Genre": "Action-Adventure",
          "Players": "Single Player",
          "ESRB": "M for Mature"
        },
        rating: "4.8",
        reviewCount: 9876,
        compatibility: ["PS5"],
        features: ["Enhanced Graphics", "Haptic Feedback", "3D Audio"],
        tags: ["ps5", "survival", "story-driven"]
      },
      {
        name: "Ratchet & Clank: Rift Apart - PS5",
        description: "Blast your way through an interdimensional adventure with mind-blowing visuals and near-instant loading.",
        price: "39.99",
        originalPrice: "69.99",
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "PS5 Games",
        brand: "Sony",
        inStock: true,
        stockQuantity: 85,
        isPreOrder: false,
        specifications: {
          "Platform": "PS5",
          "Genre": "Action-Platformer",
          "Players": "Single Player",
          "ESRB": "E10+ for Everyone 10+"
        },
        rating: "4.7",
        reviewCount: 7543,
        compatibility: ["PS5"],
        features: ["Dimensional Rifts", "Ray Tracing", "DualSense Features"],
        tags: ["ps5", "platformer", "family-friendly"]
      },
      {
        name: "Ghost of Tsushima Director's Cut - PS5",
        description: "Forge a new path and wage an unconventional war for the freedom of Tsushima. Enhanced with Iki Island expansion.",
        price: "49.99",
        originalPrice: "69.99",
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "PS5 Games",
        brand: "Sony",
        inStock: true,
        stockQuantity: 45,
        isPreOrder: false,
        specifications: {
          "Platform": "PS5",
          "Genre": "Action-Adventure",
          "Players": "Single Player",
          "ESRB": "M for Mature"
        },
        rating: "4.9",
        reviewCount: 11234,
        compatibility: ["PS5"],
        features: ["Samurai Combat", "Open World", "Photo Mode"],
        tags: ["ps5", "samurai", "open-world"]
      },
      {
        name: "Demon's Souls - PS5",
        description: "Experience the original brutally challenging action RPG, completely remade from the ground up for PS5.",
        price: "39.99",
        originalPrice: "69.99",
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "PS5 Games",
        brand: "Sony",
        inStock: true,
        stockQuantity: 30,
        isPreOrder: false,
        specifications: {
          "Platform": "PS5",
          "Genre": "Action RPG",
          "Players": "Single Player + Online",
          "ESRB": "M for Mature"
        },
        rating: "4.6",
        reviewCount: 6789,
        compatibility: ["PS5"],
        features: ["Challenging Combat", "Online Messages", "Stunning Visuals"],
        tags: ["ps5", "souls-like", "challenging"]
      },
      {
        name: "Gran Turismo 7 - PS5",
        description: "Experience the complete universe of Gran Turismo with the most beautiful and authentic racing experience ever.",
        price: "49.99",
        originalPrice: "69.99",
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "PS5 Games",
        brand: "Sony",
        inStock: true,
        stockQuantity: 70,
        isPreOrder: false,
        specifications: {
          "Platform": "PS5",
          "Genre": "Racing Simulation",
          "Players": "Single + Multiplayer",
          "ESRB": "E for Everyone"
        },
        rating: "4.4",
        reviewCount: 5432,
        compatibility: ["PS5"],
        features: ["Realistic Physics", "Ray Tracing", "VR Compatible"],
        tags: ["ps5", "racing", "simulation"]
      },
      // Additional PS4 Games
      {
        name: "The Last of Us Part II - PS4",
        description: "Five years after their dangerous journey across the post-pandemic United States, Ellie and Joel settle down in Wyoming.",
        price: "19.99",
        originalPrice: "59.99",
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "PS4 Games",
        brand: "Sony",
        inStock: true,
        stockQuantity: 120,
        isPreOrder: false,
        specifications: {
          "Platform": "PS4",
          "Genre": "Action-Adventure",
          "Players": "Single Player",
          "ESRB": "M for Mature"
        },
        rating: "4.7",
        reviewCount: 15876,
        compatibility: ["PS4", "PS5"],
        features: ["Mature Story", "Stealth Gameplay", "Stunning Graphics"],
        tags: ["ps4", "survival", "acclaimed"]
      },
      {
        name: "God of War (2018) - PS4",
        description: "Kratos and his son Atreus embark on a deeply personal journey through the Norse wilderness. Game of the Year edition.",
        price: "14.99",
        originalPrice: "39.99",
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "PS4 Games",
        brand: "Sony",
        inStock: true,
        stockQuantity: 90,
        isPreOrder: false,
        specifications: {
          "Platform": "PS4",
          "Genre": "Action-Adventure",
          "Players": "Single Player",
          "ESRB": "M for Mature"
        },
        rating: "4.9",
        reviewCount: 18765,
        compatibility: ["PS4", "PS5"],
        features: ["Norse Mythology", "Father-Son Story", "Cinematic Combat"],
        tags: ["ps4", "mythology", "award-winning"]
      },
      {
        name: "Marvel's Spider-Man - PS4",
        description: "Be Spider-Man in this action-packed adventure featuring acrobatic abilities, improvisation, and web-slinging.",
        price: "19.99",
        originalPrice: "39.99",
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "PS4 Games",
        brand: "Sony",
        inStock: true,
        stockQuantity: 110,
        isPreOrder: false,
        specifications: {
          "Platform": "PS4",
          "Genre": "Action-Adventure",
          "Players": "Single Player",
          "ESRB": "T for Teen"
        },
        rating: "4.8",
        reviewCount: 14332,
        compatibility: ["PS4", "PS5"],
        features: ["Web-Slinging", "Open World NYC", "Superhero Action"],
        tags: ["ps4", "superhero", "marvel"]
      },
      {
        name: "Bloodborne - PS4",
        description: "Hunt your nightmares in this challenging action RPG set in the gothic city of Yharnam. Game of the Year edition.",
        price: "9.99",
        originalPrice: "19.99",
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "PS4 Games",
        brand: "Sony",
        inStock: true,
        stockQuantity: 75,
        isPreOrder: false,
        specifications: {
          "Platform": "PS4",
          "Genre": "Action RPG",
          "Players": "Single Player + Online",
          "ESRB": "M for Mature"
        },
        rating: "4.6",
        reviewCount: 12098,
        compatibility: ["PS4", "PS5"],
        features: ["Lovecraftian Horror", "Fast Combat", "Challenging Boss Fights"],
        tags: ["ps4", "souls-like", "horror"]
      },
      {
        name: "Horizon Zero Dawn Complete Edition - PS4",
        description: "Experience Aloy's entire legendary quest to unravel the mysteries of a world ruled by deadly machines.",
        price: "12.99",
        originalPrice: "29.99",
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "PS4 Games",
        brand: "Sony",
        inStock: true,
        stockQuantity: 95,
        isPreOrder: false,
        specifications: {
          "Platform": "PS4",
          "Genre": "Action RPG",
          "Players": "Single Player",
          "ESRB": "T for Teen"
        },
        rating: "4.7",
        reviewCount: 16543,
        compatibility: ["PS4", "PS5"],
        features: ["Machine Hunting", "Bow Combat", "Post-Apocalyptic World"],
        tags: ["ps4", "rpg", "post-apocalyptic"]
      },
      {
        name: "Uncharted 4: A Thief's End - PS4",
        description: "Several years after his last adventure, retired fortune hunter Nathan Drake is forced back into the world of thieves.",
        price: "9.99",
        originalPrice: "19.99",
        releaseDate: null,
        imageUrls: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        category: "PS4 Games",
        brand: "Sony",
        inStock: true,
        stockQuantity: 80,
        isPreOrder: false,
        specifications: {
          "Platform": "PS4",
          "Genre": "Action-Adventure",
          "Players": "Single + Multiplayer",
          "ESRB": "T for Teen"
        },
        rating: "4.8",
        reviewCount: 13456,
        compatibility: ["PS4", "PS5"],
        features: ["Treasure Hunting", "Cinematic Action", "Multiplayer"],
        tags: ["ps4", "adventure", "treasure"]
      }
    ];

    sampleProducts.forEach(product => {
      const id = randomUUID();
      this.products.set(id, {
        ...product,
        id,
        createdAt: new Date(),
      });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      id,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { 
      ...user, 
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId 
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category === category
    );
  }

  async getProductsByBrand(brand: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.brand === brand
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      product => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
    );
  }

  async getPreOrderProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.isPreOrder
    );
  }

  async getDealsProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price)
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct,
      originalPrice: insertProduct.originalPrice || null,
      imageUrls: insertProduct.imageUrls as string[],
      tags: insertProduct.tags as string[],
      features: insertProduct.features as string[],
      compatibility: insertProduct.compatibility as string[],
      specifications: insertProduct.specifications as Record<string, string>,
      id,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async getCartItems(userId: string): Promise<Array<CartItem & { product: Product }>> {
    const userCartItems = Array.from(this.cartItems.values()).filter(
      item => item.userId === userId
    );
    
    return userCartItems.map(item => {
      const product = this.products.get(item.productId);
      if (!product) throw new Error('Product not found');
      return { ...item, product };
    });
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      cartItem => cartItem.userId === item.userId && cartItem.productId === item.productId
    );

    if (existingItem) {
      // Update quantity
      const updatedItem = { ...existingItem, quantity: existingItem.quantity + (item.quantity || 1) };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    }

    const id = randomUUID();
    const cartItem: CartItem = { 
      ...item,
      quantity: item.quantity || 1,
      id,
      createdAt: new Date(),
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: string, quantity: number): Promise<CartItem> {
    const item = this.cartItems.get(id);
    if (!item) throw new Error('Cart item not found');
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: string): Promise<void> {
    this.cartItems.delete(id);
  }

  async clearCart(userId: string): Promise<void> {
    const userCartItems = Array.from(this.cartItems.entries()).filter(
      ([_, item]) => item.userId === userId
    );
    
    userCartItems.forEach(([id]) => {
      this.cartItems.delete(id);
    });
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder,
      status: insertOrder.status || "pending",
      items: insertOrder.items as Array<{
        productId: string;
        productName: string;
        price: string;
        quantity: number;
      }>,
      stripePaymentIntentId: insertOrder.stripePaymentIntentId || null,
      id,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      order => order.userId === userId
    );
  }
}

export const storage = new MemStorage();
