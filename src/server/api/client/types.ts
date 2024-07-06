import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../root";

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

export type dashboardOutput = RouterOutput["dashboard"]["get"];

export type formData =
  | homeInput
  | homeOutput
  | beautyInput
  | beautyOutput
  | equipmentInput
  | equipmentOutput
  | healthInput
  | healthOutput;

export type homeInput = RouterInput["home"]["create"];
export type homeOutput = RouterOutput["home"]["create"];

export type beautyInput = RouterInput["beauty"]["create"];
export type beautyOutput = RouterOutput["beauty"]["create"];

export type equipmentInput = RouterInput["equipment"]["create"];
export type equipmentOutput = RouterOutput["equipment"]["create"];

export type healthInput = RouterInput["health"]["create"];
export type healthOutput = RouterOutput["health"]["create"];
