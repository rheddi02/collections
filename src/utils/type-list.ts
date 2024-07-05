import type { TypeListType } from "./types";

export const typeLists: TypeListType[] = [
  {
    label: "roof",
    get value() {
      return this.label.replaceAll(" ", "-");
    },
  },
  {
    label: "kitchen",
    get value() {
      return this.label.replaceAll(" ", "-");
    },
  },
  {
    label: "dinning",
    get value() {
      return this.label.replaceAll(" ", "-");
    },
  },
  {
    label: "room",
    get value() {
      return this.label.replaceAll(" ", "-");
    },
  },
  {
    label: "wall",
    get value() {
      return this.label.replaceAll(" ", "-");
    },
  },
  {
    label: "window",
    get value() {
      return this.label.replaceAll(" ", "-");
    },
  },
  {
    label: "general",
    get value() {
      return this.label.replaceAll(" ", "-");
    },
  },
  {
    label: "indoor",
    get value() {
      return this.label.replaceAll(" ", "-");
    },
  },
  {
    label: "outdoor",
    get value() {
      return this.label.replaceAll(" ", "-");
    },
  },
  {
    label: "toilet",
    get value() {
      return this.label.replaceAll(" ", "-");
    },
  },
  {
    label: "door",
    get value() {
      return this.label.replaceAll(" ", "-");
    },
  },
];
