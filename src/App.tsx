
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import { DataProvider } from "./contexts/DataContext";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Quests from "./pages/Quests";
import Character from "./pages/Character";
import SkillTree from "./pages/SkillTree";
import Shop from "./pages/Shop";
import Inventory from "./pages/Inventory";
import NotFound from "./pages/NotFound";
import Challenges from "./pages/Challenges";
import Habits from "./pages/Habits";
import Mood from "./pages/Mood";
import Achievements from "./pages/Achievements";
import { ThemeSettings } from "./components/ThemeSettings";
import { initializeTheme } from "./utils/theme";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import { isAuthenticated, logout } from "./utils/auth";
import { useSupabaseSync } from "./hooks/useSupabaseSync";

const queryClient = new QueryClient();

// Initialize theme when app loads
initializeTheme();

// Layout component that includes the navbar
const Layout = ({ children }: { children: ReactNode }) => {
  // Initialize Supabase sync (will load data on auth change)
  const { isLoading } = useSupabaseSync();

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen relative">
        <Navbar />
        <main className="flex-grow px-4 pb-16 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-3xl mb-4">⌛</div>
            <p className="text-lg font-medium">Loading your data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <main className="flex-grow px-4 pb-16 pt-20">
        {children}
      </main>
    </div>
  );
};

// Public Layout - similar to Layout but for public pages
const PublicLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col min-h-screen relative">
    <Navbar />
    <main className="flex-grow px-4 pb-16 pt-20">
      {children}
    </main>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Index /></PublicLayout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/quests" element={
              <ProtectedRoute>
                <Layout><Quests /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/character" element={
              <ProtectedRoute>
                <Layout><Character /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/skills" element={
              <ProtectedRoute>
                <Layout><SkillTree /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/shop" element={
              <ProtectedRoute>
                <Layout><Shop /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute>
                <Layout><Inventory /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/challenges" element={
              <ProtectedRoute>
                <Layout><Challenges /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/habits" element={
              <ProtectedRoute>
                <Layout><Habits /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/mood" element={
              <ProtectedRoute>
                <Layout><Mood /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/achievements" element={
              <ProtectedRoute>
                <Layout><Achievements /></Layout>
              </ProtectedRoute>
            } />
            
            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DataProvider>
  </QueryClientProvider>
);

export default App;
