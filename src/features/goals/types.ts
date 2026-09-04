export interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
}

export interface CreateGoalInput {
  name: string;
  target_amount: number;
  target_date?: string;
}

export interface TopUpGoalInput {
  id: string;
  amount: number;
}