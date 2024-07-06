import type { NavigationType } from "./types";

export function NavigationLists(): NavigationType[] {
  return [
    {
      title: "dashboard",
      get route() {
        return '/'+(this.title.replaceAll(' ', '-'));
      },
      subRoute: [],
    },
    {
      title: "home tips",
      get route() {
        return '/'+(this.title.replaceAll(' ', '-'));
      },
      subRoute: [],
    },
    {
      title: "health tips",
      get route() {
        return '/'+(this.title.replaceAll(' ', '-'));
      },
      subRoute: [],
    },
    {
      title: "beauty tips",
      get route() {
        return '/'+(this.title.replaceAll(' ', '-'));
      },
      subRoute: [],
    },
    {
      title: "equipment tips",
      get route() {
        return '/'+(this.title.replaceAll(' ', '-'));
      },
      subRoute: [],
    },
    {
      title: "food tips",
      get route() {
        return '/'+(this.title.replaceAll(' ', '-'));
      },
      subRoute: [],
    },
  ];
}
