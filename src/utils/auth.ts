
// Simple auth utility for demo purposes
// In a real app, this would be connected to a backend service like Supabase, Firebase, etc.

export const isAuthenticated = (): boolean => {
  return localStorage.getItem("isAuthenticated") === "true";
};

export const logout = (): void => {
  localStorage.removeItem("isAuthenticated");
};
