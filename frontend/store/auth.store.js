// Zustand store placeholder for authentication state
// Install: npm install zustand

// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export const useAuthStore = create(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,
//       isAuthenticated: false,
//       setUser: (user) => set({ user, isAuthenticated: !!user }),
//       setToken: (token) => set({ token }),
//       logout: () => set({ user: null, token: null, isAuthenticated: false }),
//     }),
//     { name: 'auth-storage' }
//   )
// );

export const useAuthStore = () => ({
  user: null,
  token: null,
  isAuthenticated: false,
});
