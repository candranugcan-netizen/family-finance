// types.ts
export type TransactionType = 'income' | 'expense' | 'transfer';

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  account_id: string;
  to_account_id?: string | null;
  category_id?: string | null;
  new_category_name?: string | null; // Added field for new category
  notes?: string;
  date: string;
}

export interface TransactionRecord {
  id: string;
  type: TransactionType;
  amount: number;
  notes: string | null;
  date: string;
  created_at: string;
  category?: { name: string } | null;
  account?: { name: string } | null;
  to_account?: { name: string } | null;
}