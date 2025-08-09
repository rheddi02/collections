import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../root";

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

export type linkInput = RouterInput["create"]["link"];
export type linkOutput = RouterOutput["create"]['link'];
export type linkListOutput = RouterOutput["list"]["link"];

export type categoryInput = RouterInput["create"]['categories'];
export type categoryOutput = RouterOutput["create"]['categories'];
// export type categoryUpdateOutput = RouterOutput["update"]['categories'];
// export type categoryUpdateInput = RouterInput["update"]['categories'];
// export type categoryListOutput = RouterOutput["list"]["categories"];
export type categoryAllOutput = RouterOutput["list"]["allCategories"];

export type CommonOutputType =
  | linkOutput
  | linkListOutput
  | categoryOutput
  | categoryAllOutput