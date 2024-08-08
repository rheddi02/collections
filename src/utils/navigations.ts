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
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
    image: 'https://picsum.photos/id/64/500/700'
  },
  {
    title: "cloth",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
    image: 'https://picsum.photos/id/535/500/700'
  },
  {
    title: "energy",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
    image: 'https://picsum.photos/id/222/500/700'
  },
  {
    title: "equipment",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
    image: 'https://picsum.photos/id/491/500/700'
  },
  {
    title: "food",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
    image: 'https://picsum.photos/id/292/500/700'
  },
  {
    title: "health",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
    image: 'https://picsum.photos/id/326/500/700'
  },
  {
    title: "home",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
    image: 'https://picsum.photos/id/428/500/700'
  },
  {
    title: "leisure",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
    image: 'https://picsum.photos/id/175/500/700'
  },
  {
    title: "machinery",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
    image: 'https://picsum.photos/id/617/500/700'
  },
  {
    title: "plant",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
    image: 'https://picsum.photos/id/248/500/700'
  },
  {
    title: "pet",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
    image: 'https://picsum.photos/id/237/500/700'
  },
  {
    title: "ride",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
    image: 'https://picsum.photos/id/146/500/700'
  },
  {
    title: "coin",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
    image: 'https://picsum.photos/id/149/500/700'
  },
  {
    title: "category",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
    image: 'https://picsum.photos/id/147/500/700'
  },
];
