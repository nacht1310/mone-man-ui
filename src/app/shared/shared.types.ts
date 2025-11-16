export interface TableColumn<T> {
  name: keyof T;
  displayName: string;
  sortDirections: Array<'ascend' | 'descend'>;
  sortOrder: 'ascend' | 'descend' | null;
}
