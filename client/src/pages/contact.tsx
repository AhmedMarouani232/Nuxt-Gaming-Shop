import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, MessageSquare, HelpCircle } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const faqs = [
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for most items. Products must be in original condition with all packaging and accessories. Gaming software and digital downloads are not eligible for return."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping takes 3-5 business days. Express shipping (1-2 business days) is available for an additional fee. Free shipping is available on orders over $50."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Currently, we only ship within the United States. We're working on expanding our shipping options to serve international customers in the future."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and digital wallets like Apple Pay and Google Pay."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history."
  },
  {
    question: "Do you offer warranty on gaming products?",
    answer: "Yes! Most gaming peripherals come with manufacturer warranty (typically 1-2 years). Custom PCs come with our 1-year comprehensive warranty covering parts and labor."
  },
  {
    question: "Can I cancel or modify my order?",
    answer: "Orders can be cancelled or modified within 2 hours of placement. After that, please contact our support team and we'll do our best to help before the order ships."
  },
  {
    question: "Do you price match?",
    answer: "We offer price matching on identical products from authorized retailers. Contact us with the competitor's price and we'll review your request within 24 hours."
  }
];

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Contact form submitted:", data);
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
    
    setIsSubmitted(true);
    reset();
    
    // Reset submitted state after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Contact Us
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Have questions about our products or need support? We're here to help!
            Reach out to our gaming experts for personalized assistance.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="h-6 w-6 mr-2 text-blue-400" />
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Email Support</p>
                    <p className="text-gray-400 text-sm">support@nextech.com</p>
                    <p className="text-gray-400 text-sm">Response within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Phone Support</p>
                    <p className="text-gray-400 text-sm">1-800-NEXTECH</p>
                    <p className="text-gray-400 text-sm">Mon-Fri 9AM-6PM EST</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Headquarters</p>
                    <p className="text-gray-400 text-sm">123 Gaming Blvd</p>
                    <p className="text-gray-400 text-sm">Tech City, TC 12345</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Business Hours</p>
                    <p className="text-gray-400 text-sm">Monday - Friday: 9AM - 6PM EST</p>
                    <p className="text-gray-400 text-sm">Saturday: 10AM - 4PM EST</p>
                    <p className="text-gray-400 text-sm">Sunday: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" data-testid="track-order-link">
                  Track Your Order
                </Button>
                <Button variant="outline" className="w-full justify-start" data-testid="returns-link">
                  Returns & Exchanges
                </Button>
                <Button variant="outline" className="w-full justify-start" data-testid="warranty-link">
                  Warranty Information
                </Button>
                <Button variant="outline" className="w-full justify-start" data-testid="tech-support-link">
                  Technical Support
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8" data-testid="form-success">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-600/20 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-400">Thank you for contacting us. We'll respond within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          placeholder="Your full name"
                          className="bg-slate-700 border-slate-600 text-white focus:ring-blue-500"
                          {...register("name")}
                          data-testid="contact-name"
                        />
                        {errors.name && (
                          <p className="text-sm text-red-400">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          className="bg-slate-700 border-slate-600 text-white focus:ring-blue-500"
                          {...register("email")}
                          data-testid="contact-email"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-400">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-gray-300">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        placeholder="What can we help you with?"
                        className="bg-slate-700 border-slate-600 text-white focus:ring-blue-500"
                        {...register("subject")}
                        data-testid="contact-subject"
                      />
                      {errors.subject && (
                        <p className="text-sm text-red-400">{errors.subject.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-300">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Please describe your question or issue in detail..."
                        rows={6}
                        className="bg-slate-700 border-slate-600 text-white focus:ring-blue-500 resize-none"
                        {...register("message")}
                        data-testid="contact-message"
                      />
                      {errors.message && (
                        <p className="text-sm text-red-400">{errors.message.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                      data-testid="contact-submit"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
              <HelpCircle className="h-8 w-8 mr-3 text-blue-400" />
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Find quick answers to common questions about our products, shipping, and services.
            </p>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`} 
                    className="border-slate-700"
                  >
                    <AccordionTrigger 
                      className="text-white hover:text-blue-400 text-left"
                      data-testid={`faq-question-${index}`}
                    >
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent 
                      className="text-gray-300"
                      data-testid={`faq-answer-${index}`}
                    >
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
