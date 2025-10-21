import { processSignup, StepName } from "./config.customer-signup";
import type { StepConfig } from "./define-process";

export type Compiled = {
  byName: Record<
    StepName,
    { step: number; stepName: StepName; cfg: StepConfig }
  >;
  byNumber: Record<number, StepName>;
};

function compile(): Compiled {
  const byName = {} as Compiled["byName"];
  const byNumber: Compiled["byNumber"] = {};
  processSignup.stepsInOrder.forEach((name, i) => {
    const cfg = processSignup.config[name];
    const step = i + 1;
    byName[name] = { step, stepName: name, cfg };
    byNumber[step] = name;
  });
  return { byName, byNumber };
}

export const COMPILED = compile();
