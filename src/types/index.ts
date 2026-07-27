export type Role = 'USER' | 'PRO' | 'ADMIN';

export interface User {
  id: number;
  full_name: string;
  username: string;        // new — unique handle
  email: string;
  role: Role;
  avatar_url?: string;
  is_active: boolean;
  is_verified: boolean;
  free_credits_used: number;
  remaining_free_credits: number;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  badge: string;
  description: string;
}

export interface Language {
  id: string;
  name: string;
  extension: string;
  monacoId: string;
  icon: string;
}

export interface CodePreset {
  id: string;
  title: string;
  sourceLanguage: string;
  targetLanguage: string;
  code: string;
}

export interface ConversionRecord {
  id?: number;
  user_id?: number;
  source_language: string;
  target_language: string;
  model_used: string;
  source_code: string;
  target_code: string;
  explanation?: string;
  execution_time_ms: number;
  code_size_bytes: number;
  created_at: string;
}

export interface ConversionExplanation {
  summary: string;
  key_changes: string[];
  syntax_differences: string[];
  performance_notes: string;
  best_practices: string[];
}

export interface CodeAnalysis {
  bugs: string[];
  security_vulnerabilities: string[];
  refactoring_suggestions: string[];
  complexity_score: string;
}

export interface SubscriptionInfo {
  id?: number;
  plan: 'FREE' | 'PRO_MONTHLY' | 'PRO_YEARLY' | 'ENTERPRISE';
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'EXPIRED';
  role: Role;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
  free_credits_used: number;
  free_credits_limit: number;
}

// ─── Admin Types ─────────────────────────────────────────────────────────────
export interface AdminUser {
  id: number;
  full_name: string;
  username: string;
  email: string;
  role: Role;
  is_active: boolean;
  free_credits_used: number;
  remaining_free_credits: number;
  created_at: string;
  total_conversions?: number;
  subscription?: {
    plan: string;
    status: string;
    current_period_end?: string;
  };
}

export interface AdminMetrics {
  users: {
    total: number;
    active: number;
    new_today: number;
    free: number;
    pro: number;
    admin: number;
  };
  conversions: {
    total: number;
    daily: number;
  };
  api: {
    total_calls: number;
    avg_latency_ms: number;
    estimated_cost_usd: number;
  };
  languages: {
    top_source: { language: string; count: number }[];
    top_target: { language: string; count: number }[];
  };
  model_usage: { model: string; count: number }[];
  revenue: {
    mrr_usd: number;
    arr_usd: number;
  };
  system: {
    status: string;
    database: string;
  };
}

export interface AdminSubscription {
  id: number;
  user_id: number;
  username: string;
  email: string;
  plan: string;
  status: string;
  cancel_at_period_end: boolean;
  current_period_start?: string;
  current_period_end?: string;
}

export interface AdminConversion {
  id: number;
  user_id: number;
  source_language: string;
  target_language: string;
  model_used: string;
  execution_time_ms: number;
  code_size_bytes: number;
  created_at: string;
}
