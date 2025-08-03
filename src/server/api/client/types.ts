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
  | homeInput
  | homeOutput
  | beautyInput
  | beautyOutput
  | equipmentInput
  | equipmentOutput
  | healthInput
  | healthOutput
  | linkInput
  | linkOutput

export type linkInput = RouterInput["create"]["link"];
export type linkOutput = RouterOutput["create"]['link'];

export type homeInput = RouterInput["create"]["homeTip"];
export type homeOutput = RouterOutput["create"]['homeTip'];

export type beautyInput = RouterInput["create"]['beautyTip'];
export type beautyOutput = RouterOutput["create"]['beautyTip'];

export type equipmentInput = RouterInput["create"]['equipmentTip'];
export type equipmentOutput = RouterOutput["create"]['equipmentTip'];

export type healthInput = RouterInput["create"]['healthTip'];
export type healthOutput = RouterOutput["create"]['healthTip'];

export type videoInput = RouterInput["create"]['video'];
export type videoOutput = RouterOutput["create"]['video'];

export type coinInput = RouterInput["create"]['coin'];
export type coinOutput = RouterOutput["create"]['coin'];

export type categoryInput = RouterInput["create"]['category'];
export type categoryOutput = RouterOutput["create"]['category'];
