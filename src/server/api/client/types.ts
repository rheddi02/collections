import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../root";

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

export type CommonInputType = {
  title: string;
  description: string;
  type: string;
  url: string;
  isPublic?: boolean;
}

export type CommonOutputType = {
  id: number;
  title: string;
  description: string;
  type: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  userId: number;
}

export type formData =
  | linkInput
  | linkOutput

export type linkInput = RouterInput["create"]["link"];
export type linkOutput = RouterOutput["create"]['link'];

export type coinInput = RouterInput["create"]['coin'];
export type coinOutput = RouterOutput["create"]['coin'];

export type categoryInput = RouterInput["create"]['category'];
export type categoryOutput = RouterOutput["create"]['category'];
