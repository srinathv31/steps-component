export type ScenarioConfig = { result: string };
export type StepConfig = {
  http_method?: string;
  endpoint?: string;
  success: ScenarioConfig;
  error: ScenarioConfig;
};

/**
 * Locks steps as a literal tuple and enforces that config has exactly those keys.
 */
export function defineProcess<const TSteps extends readonly string[]>(
  stepsInOrder: TSteps
) {
  type StepName = TSteps[number];

  return function withConfig<
    const TConfig extends Record<StepName, StepConfig>
  >(config: TConfig) {
    return { stepsInOrder, config };
  };
}
