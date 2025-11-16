export const API = {
  LOGIN: 'auth/login',
  REGISTER: 'auth/register',
  VERIFY_TOKEN: 'auth/verify',
  SPENDING_MANAGEMENT: {
    LIST: 'spending/list',
    CREATE: 'spending/create',
    DETAIL: (id: number) => `spending/${id}`,
    DELETE: (id: number) => `spending/${id}`,
    UPDATE: (id: number) => `spending/${id}`,
  },
};
