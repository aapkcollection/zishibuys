export const categories = [
  { name: "Kitchen & Dining", icon: "🍳" },
  { name: "Home Organization", icon: "🗄️" },
  { name: "Cleaning & Laundry", icon: "🧹" },
  { name: "Home Improvement", icon: "🔧" },
  { name: "Lighting", icon: "💡" },
  { name: "Bedroom & Bathroom", icon: "🛏️" },
  { name: "Smart Home & Gadgets", icon: "📱" },
  { name: "Garden & Outdoor", icon: "🌿" },
  { name: "Home Decor", icon: "🏠" },
];

export type Product = {
  id: number;
  name: string;
  category: string;
  rating: string;
  reviews: string;
  price: string;
  badge: string;

  /*
   * Unlimited product images.
   * Backend se jitni images ayengi, frontend automatically handle karega.
   */
  images: string[];

  /*
   * Unlimited product videos.
   * Backend se jitni videos ayengi, frontend automatically handle karega.
   */
  videos: string[];

  amazonUrl: string;
  description: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Multi-Function Kitchen Storage Organizer",
    category: "Kitchen & Dining",
    rating: "4.8",
    reviews: "1.2k",
    price: "$24.99",
    badge: "Trending",

    images: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80",
    ],

    videos: [],

    amazonUrl: "https://www.amazon.com/",
    description:
      "A practical kitchen storage organizer designed to keep everyday items neat and easy to access.",
  },

  {
    id: 2,
    name: "Premium Home Storage Basket Set",
    category: "Home Organization",
    rating: "4.6",
    reviews: "623",
    price: "$31.50",
    badge: "Best Seller",

    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
    ],

    videos: [],

    amazonUrl: "https://www.amazon.com/",
    description:
      "Stylish storage baskets for organizing bedrooms, living spaces, shelves and everyday household items.",
  },

  {
    id: 3,
    name: "Smart Home Cleaning Gadget",
    category: "Cleaning & Laundry",
    rating: "4.5",
    reviews: "517",
    price: "$28.99",
    badge: "New",

    images: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=900&q=80",
    ],

    videos: [],

    amazonUrl: "https://www.amazon.com/",
    description:
      "A useful household cleaning gadget designed to make everyday cleaning tasks easier.",
  },

  {
    id: 4,
    name: "Professional Home Improvement Tool Kit",
    category: "Home Improvement",
    rating: "4.7",
    reviews: "486",
    price: "$27.99",
    badge: "Best Seller",

    images: [
      "https://images.unsplash.com/photo-1581147036324-c17ac41d4f08?auto=format&fit=crop&w=900&q=80",
    ],

    videos: [],

    amazonUrl: "https://www.amazon.com/",
    description:
      "A versatile home improvement tool kit for everyday repairs, maintenance and DIY projects.",
  },

  {
    id: 5,
    name: "Modern Rechargeable LED Motion Light",
    category: "Lighting",
    rating: "4.7",
    reviews: "842",
    price: "$19.99",
    badge: "Popular",

    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    ],

    videos: [],

    amazonUrl: "https://www.amazon.com/",
    description:
      "Modern LED lighting designed for convenient illumination around the home.",
  },

  {
    id: 6,
    name: "Minimalist Bedroom Organizer",
    category: "Bedroom & Bathroom",
    rating: "4.8",
    reviews: "941",
    price: "$22.49",
    badge: "Trending",

    images: [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
    ],

    videos: [],

    amazonUrl: "https://www.amazon.com/",
    description:
      "A minimalist organizer for keeping bedroom and bathroom essentials neatly arranged.",
  },

  {
    id: 7,
    name: "Compact Smart Home Device",
    category: "Smart Home & Gadgets",
    rating: "4.6",
    reviews: "733",
    price: "$34.99",
    badge: "Hot",

    images: [
      "https://images.unsplash.com/photo-1558089687-f282ffcbc0d4?auto=format&fit=crop&w=900&q=80",
    ],

    videos: [],

    amazonUrl: "https://www.amazon.com/",
    description:
      "A compact smart-home gadget designed to add convenience to everyday routines.",
  },

  {
    id: 8,
    name: "Garden & Outdoor Multi Tool Set",
    category: "Garden & Outdoor",
    rating: "4.6",
    reviews: "391",
    price: "$23.99",
    badge: "Hot",

    images: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80",
    ],

    videos: [],

    amazonUrl: "https://www.amazon.com/",
    description:
      "A practical multi-purpose tool set for garden and outdoor tasks.",
  },

  {
    id: 9,
    name: "Modern Home Decor Accent Set",
    category: "Home Decor",
    rating: "4.8",
    reviews: "712",
    price: "$29.99",
    badge: "Trending",

    images: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
    ],

    videos: [],

    amazonUrl: "https://www.amazon.com/",
    description:
      "Modern decorative accents designed to add a clean and stylish look to your home.",
  },
];
