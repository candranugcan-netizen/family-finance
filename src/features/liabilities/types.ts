export interface Liability {
  id: string;
  name: string;
  category: string;
  initial_amount: number;
  remaining_amount: number;
}

export interface CreateLiabilityInput {
  name: string;
  category: string;
  initial_amount: number;
  remaining_amount: number;
}