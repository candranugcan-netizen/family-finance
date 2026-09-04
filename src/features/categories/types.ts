export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  is_active: boolean;
}