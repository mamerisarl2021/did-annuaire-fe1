export const ROUTES = {
  public: {
    home: '/',
    login: '/login',
    register: '/register',
    registerSuccess: '/register/success',
    activate: (token: string) => `/activate/${token}`,
    contact: '/contact',
  },
};
