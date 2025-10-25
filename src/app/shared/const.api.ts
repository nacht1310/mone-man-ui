export const API = {
  LOGIN: 'auth/login',
  REGISTER: 'auth/register',
  SPENDING_MANAGEMENT: {
    LIST: 'spending/list',
    CREATE: 'spending/create',
    DETAIL: (id: string) => `spending/${id}`,
    DELETE: (id: string) => `spending/${id}`,
    UPDATE: (id: string) => `spending/${id}`,
  },
};
