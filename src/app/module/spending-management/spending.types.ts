export interface SpendingData {
  id: number;
  userId: number;
  categoryId: number;
  amount: number;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSpendingPayload {
  categoryId: string;
  amount: number;
  date: string;
  description?: string;
}

export interface SpendingQueryParams {
  categoryIds?: Array<number>;
  userId?: number;
  dateStart?: number;
  dateEnd?: number;
  page: number;
  size: number;
  sortDirection?: 'asc' | 'desc';
  sortField: keyof SpendingData;
}
