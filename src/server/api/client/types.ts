import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../root';

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

export type homeImprovementInput = RouterInput['homeImprovement']['create'];
export type homeImprovementOutput = RouterOutput['homeImprovement']['create'];

export type wellnessInput = RouterInput['wellness']['create'];
export type wellnessOutput = RouterOutput['wellness']['create'];
