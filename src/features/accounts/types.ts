export type AccountType = 'Bank' | 'Cash' | 'E-Wallet' | 'Investment';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  initial_balance: number;
  current_balance: number;
  icon?: string;
  is_active: boolean;
  created_at: string;
}

export interface CreateAccountInput {
  name: string;
  type: AccountType;
  initial_balance: number;
}