import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../root";

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

export type dashboardOutput = RouterOutput["dashboard"]["get"];

export type CommonInputType = {
  title: string;
  description: string;
  type: string;
  url: string;
}

export type CommonOutputType = {
  id: number;
  title: string;
  description: string;
  type: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export type formData =
  | homeInput
  | homeOutput
  | beautyInput
  | beautyOutput
  | equipmentInput
  | equipmentOutput
  | healthInput
  | healthOutput;

export type homeInput = RouterInput["create"]["homeTip"];
export type homeOutput = RouterOutput["create"]['homeTip'];

export type beautyInput = RouterInput["create"]['beautyTip'];
export type beautyOutput = RouterOutput["create"]['beautyTip'];

export type equipmentInput = RouterInput["create"]['equipmentTip'];
export type equipmentOutput = RouterOutput["create"]['equipmentTip'];

export type healthInput = RouterInput["create"]['healthTip'];
export type healthOutput = RouterOutput["create"]['healthTip'];
