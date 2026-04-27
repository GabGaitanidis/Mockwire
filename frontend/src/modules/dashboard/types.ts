export interface StatusCodeRule {
  weight: number;
  message: string;
}

export type StatusCodesMap = Record<string, StatusCodeRule>;

export interface ConditionBranch {
  if: Record<string, string>;
  then: Record<string, unknown>;
}

export interface ConditionSet {
  id: number;
  name: string;
  description?: string | null;
  conditions: ConditionBranch[];
  createdAt?: string;
  user_id?: number;
  project_id?: number;
}

export interface Rule {
  id: number;
  version?: string;
  endpoint: string;
  latency: number;
  dataSchema: Record<string, string>;
  statusCodes?: StatusCodesMap;
}

export interface UrlItem {
  id?: number;
  url: string;
  createdAt?: string;
  rules_id?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  api_key: string;
}

export interface Project {
  id: number;
  name: string;
}

export interface RuleFormData {
  endpoint: string;
  dataSchema: string;
  latency: number;
  statusCodes: StatusCodesMap;
}

export interface StatusCodeInput {
  code: string;
  weight: string;
  message: string;
}

export interface FieldTypeOption {
  label: string;
  fakerPath: string;
}

export interface SchemaEntry {
  fieldName: string;
  fakerPath: string;
  label: string;
}

export interface TestResponse {
  statusCode?: number;
  message?: string;
  data: any;
  error: string | null;
  totalDelayMs?: number;
  configuredLatencyMs?: number;
  networkDelayMs?: number;
}

export interface CreateRuleRequest {
  endpoint: string;
  dataSchema: Record<string, string>;
  latency: number;
  statusCodes: StatusCodesMap;
}

export interface CreateConditionSetRequest {
  name: string;
  description?: string;
  conditions: ConditionBranch[];
}

export type UpdateConditionSetRequest = Partial<CreateConditionSetRequest>;

export interface MessageResponse {
  message: string;
}

export interface RulesResponse extends MessageResponse {
  rules: Rule[];
}

export interface ConditionSetsResponse extends MessageResponse {
  conditionSets: ConditionSet[];
}

export interface ConditionSetResponse extends MessageResponse {
  conditionSet: ConditionSet;
}

export interface UrlsResponse extends MessageResponse {
  urls: UrlItem[] | string[];
}

export interface CreateRuleResponse extends MessageResponse {
  rule: Rule;
}

export interface CreateDynamicUrlResponse extends MessageResponse {
  url: UrlItem | string;
}
