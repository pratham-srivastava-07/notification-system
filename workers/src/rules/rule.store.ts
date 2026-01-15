import { Rule } from "./rules.type";

export const RULES: Rule[] = [
  {
    id: "rule-1",
    tenant_id: "11111111-1111-1111-1111-111111111111",
    event_type: "USER_SIGNUP",
    channels: ["EMAIL", "WEBHOOK"]
  }
];

export function getRulesForEvent(
  tenant_id: string,
  event_type: string
): Rule[] {
  return RULES.filter(
    rule =>
      rule.tenant_id === tenant_id &&
      rule.event_type === event_type
  );
}
