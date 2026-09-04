export interface Budget {
  id: string;
  category_id: string;
  amount: number;
  period: string; // "YYYY-MM"
  category?: { name: string };
}

export interface CreateBudgetInput {
  category_id: string;
  amount: number;
  period: string;
}