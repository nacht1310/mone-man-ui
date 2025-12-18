export interface SpendingData {
  id: number;
  userId: number;
  categoryId: number;
  amount: number;
  date: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type DisplaySpendingData = Omit<SpendingData, 'date' | 'categoryId'> & {
  date: string;
  category: string;
};

export interface SpendingReturnData {
  data: SpendingData[];
  totalCount: number;
  page: number;
  size: number;
  sortField: keyof SpendingData;
  sortDirection: 'asc' | 'desc';
}

export type CreateSpendingPayload = Pick<
  SpendingData,
  'amount' | 'categoryId' | 'date' | 'description'
>;

export interface SpendingQueryParams {
  categoryIds?: Array<number>;
  dateStart?: number;
  dateEnd?: number;
  page: number;
  size: number;
  sortDirection?: 'asc' | 'desc';
  sortField: keyof SpendingData;
}

export interface CategoryData {
  id: number;
  name: string;
  keywords: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
