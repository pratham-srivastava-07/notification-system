import { getRulesForEvent } from "./rule.store";

export function evaluateRules(event: any) {
  const rules = getRulesForEvent(
    event.tenant_id,
    event.event_type
  );

  return rules.flatMap(rule => rule.channels);
}
