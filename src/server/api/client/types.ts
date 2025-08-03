import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../root";

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

export type linkInput = RouterInput["create"]["link"];
export type linkOutput = RouterOutput["create"]['link'];

export type coinInput = RouterInput["create"]['coin'];
export type coinOutput = RouterOutput["create"]['coin'];

export type categoryInput = RouterInput["create"]['category'];
export type categoryOutput = RouterOutput["create"]['category'];

export type CommonOutputType =
  | coinOutput
  | linkOutput
  | categoryOutput;