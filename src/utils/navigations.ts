import type { NavigationType } from "./types";

export const NavigationLists: NavigationType[] = [
  {
    title: "dashboard",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
    image: ''
  },
  {
    title: "beauty",
    get route() {
      return "/admin/tips/beauty";
    },
    subRoute: [],
    image: 'https://picsum.photos/id/64/500/700',
    description: "Beauty tips and tricks for a radiant look.",
  },
  {
    title: "cloth",
    get route() {
      return "/admin/tips/cloth";
    },
    subRoute: [],
    image: 'https://picsum.photos/id/535/500/700',
    description: "Fashion tips and trends for a stylish wardrobe.",
  },
  {
    title: "energy",
    get route() {
      return "/admin/tips/energy";
    },
    subRoute: [],
    image: 'https://picsum.photos/id/222/500/700',
    description: "Energy-saving tips for a sustainable lifestyle.",
  },
  {
    title: "equipment",
    get route() {
      return "/admin/tips/equipment";
    },
    subRoute: [],
    image: 'https://picsum.photos/id/491/500/700',
    description: "Equipment tips for better performance and maintenance.",
  },
  {
    title: "food",
    get route() {
      return "/admin/tips/food";
    },
    subRoute: [],
    image: 'https://picsum.photos/id/292/500/700',
    description: "Food tips for healthy eating and cooking.",
  },
  {
    title: "health",
    get route() {
      return "/admin/tips/health";
    },
    subRoute: [],
    image: 'https://picsum.photos/id/326/500/700',
    description: "Health tips for a balanced lifestyle.",
  },
  {
    title: "home",
    get route() {
      return "/admin/tips/home";
    },
    subRoute: [],
    image: 'https://picsum.photos/id/428/500/700',
    description: "Home tips for a cozy and functional living space.",
  },
  {
    title: "leisure",
    get route() {
      return "/admin/tips/leisure";
    },
    subRoute: [],
    image: 'https://picsum.photos/id/175/500/700',
    description: "Leisure tips for relaxation and enjoyment.",
  },
  {
    title: "machinery",
    get route() {
      return "/admin/tips/machinery";
    },
    subRoute: [],
    image: 'https://picsum.photos/id/617/500/700',
    description: "Machinery tips for better performance and maintenance.",
  },
  {
    title: "plant",
    get route() {
      return "/admin/tips/plant";
    },
    subRoute: [],
    image: 'https://picsum.photos/id/248/500/700',
    description: "Plant care tips for a thriving indoor garden.",
  },
  {
    title: "pet",
    get route() {
      return "/admin/tips/pet";
    },
    subRoute: [],
    image: 'https://picsum.photos/id/237/500/700',
    description: "Pet care tips for a happy and healthy pet.",
  },
  {
    title: "ride",
    get route() {
      return "/admin/tips/ride";
    },
    subRoute: [],
    image: 'https://picsum.photos/id/146/500/700',
    description: "Ride tips for a smooth and enjoyable journey.",
  },
  {
    title: "coin",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
    image: 'https://picsum.photos/id/149/500/700',
    description: "Coin tips for managing your digital currency.",
  },
  {
    title: "category",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
    image: 'https://picsum.photos/id/147/500/700',
    description: "Category management for organizing your content.",
  },
];
