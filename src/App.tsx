import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { DataProvider } from "./contexts/DataContext";
import { AuthProvider } from "./features/auth/context/AuthContext";
import Navbar from "./components/Navbar";
import { Landing } from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Quests from "./pages/Quests";
import Character from "./pages/Character";
import SkillTree from "./pages/SkillTree";
import Shop from "./pages/Shop";
import Inventory from "./pages/Inventory";
import NotFound from "./pages/NotFound";
import Habits from "./pages/Habits";
import Mood from "./pages/Mood";
import Achievements from "./pages/Achievements";
import { ThemeSettings } from "./components/ThemeSettings";
import { initializeTheme } from "./utils/theme";
import Login from "@/pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import { useSupabaseSync } from "./hooks/useSupabaseSync";
import { useDataSync } from "./hooks/useDataSync";
import { useGameDataManager } from "./hooks/gameData";
import ShoppingList from "./pages/ShoppingList";
import ShoppingListForm from "./pages/ShoppingListForm";
import ShoppingListDetail from "./pages/ShoppingListDetail";
import ShoppingListEdit from "./pages/ShoppingListEdit";
import Journal from "./pages/Journal";
import JournalEntryForm from "./pages/JournalEntryForm";
import JournalEntryDetail from "./pages/JournalEntryDetail";
import JournalEntryEdit from "./pages/JournalEntryEdit";
import { validateThemeImplementation } from '@/utils/theme/themeValidator';
import { useAuth } from "@/features/auth/context/AuthContext";

const queryClient = new QueryClient();

// Initialize theme when app loads
initializeTheme();

// Layout component that includes the navbar
const Layout = ({ children }: { children: ReactNode }) => {
  const { isLoading, loadingProgress, error } = useGameDataManager();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Add timeout detection
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isLoading) {
      setLoadingTimeout(false);
      timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 15000); // Show retry button after 15 seconds
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);

  const handleRetry = () => {
    // Force reload the page
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen relative">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">Loading your game data... {loadingProgress}%</div>
            {loadingTimeout && (
              <Button onClick={handleRetry}>
                Taking too long? Click to retry
              </Button>
            )}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen relative">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">Error loading game data</div>
            <Button onClick={handleRetry}>
              Retry
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <main className="flex-grow px-4 pb-16 pt-20">{children}</main>
    </div>
  );
};

// Public Layout - similar to Layout but for public pages
const PublicLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col min-h-screen relative">
    <Navbar />
    <main className="flex-grow">{children}</main>
  </div>
);

// Route guard for authenticated users
const AuthenticatedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const App = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      validateThemeImplementation();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/"
                  element={
                    <AuthenticatedRoute>
                      <PublicLayout>
                        <Landing />
                      </PublicLayout>
                    </AuthenticatedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/update-password" element={<UpdatePassword />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quests"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Quests />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/character"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Character />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/skills"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <SkillTree />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shop"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Shop />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Inventory />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/habits"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Habits />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mood"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Mood />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/achievements"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Achievements />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                
                {/* Shopping List Routes */}
                <Route
                  path="/shopping-list"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ShoppingList />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shopping-list/new"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ShoppingListForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shopping-list/:id"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ShoppingListDetail />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shopping-list/:id/edit"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ShoppingListEdit />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                
                {/* Journal Routes */}
                <Route
                  path="/journal"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Journal />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/journal/new"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <JournalEntryForm />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/journal/:id"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <JournalEntryDetail />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/journal/:id/edit"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <JournalEntryEdit />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Not Found Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
