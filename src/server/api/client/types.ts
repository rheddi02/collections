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

export type homeInput = RouterInput["create"]["createHomeTip"];
export type homeOutput = RouterOutput["create"]['createHomeTip'];

export type beautyInput = RouterInput["create"]['createBeautyTip'];
export type beautyOutput = RouterOutput["create"]['createBeautyTip'];

export type equipmentInput = RouterInput["create"]['createEquipmentTip'];
export type equipmentOutput = RouterOutput["create"]['createEquipmentTip'];

export type healthInput = RouterInput["create"]['createHealthTip'];
export type healthOutput = RouterOutput["create"]['createHealthTip'];
