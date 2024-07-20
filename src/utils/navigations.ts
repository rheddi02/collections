import type { NavigationType } from "./types";

export const NavigationLists: NavigationType[] = [
  {
    title: "dashboard",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
  },
  {
    title: "beauty",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
  },
  {
    title: "cloth",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
  },
  {
    title: "energy",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
  },
  {
    title: "equipment",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
  },
  {
    title: "food",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
  },
  {
    title: "health",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
  },
  {
    title: "home",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
  },
  {
    title: "leisure",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
  },
  {
    title: "machinery",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
  },
  {
    title: "plant",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
  },
  {
    title: "pet",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
  },
  {
    title: "ride",
    get route() {
      return "/admin/" + this.title.replaceAll(" ", "-");
    },
    subRoute: [],
  },
];
