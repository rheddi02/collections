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
      title: "home improvements",
      get route() {
        return '/'+(this.title.replaceAll(' ', '-'));
      },
      subRoute: [],
    },
    {
      title: "wellness",
      get route() {
        return '/'+(this.title.replaceAll(' ', '-'));
      },
      subRoute: [],
    },
  ];
}
