
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate, Outlet } from "react-router-dom";
import Loadable from "./components/ui/Loadable";
import ProtectedRoute from "./components/ProtectedRoute";
import { Layout } from "./components/layout/Layout";

// Helper placeholder components for missing pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <h1 className="text-2xl font-bold">{title} Page</h1>
  </div>
);

// Lazy load pages
const Dashboard = Loadable(lazy(() => import("./pages/Dashboard")));
const Character = Loadable(lazy(() => import("./pages/Character")));
const Shop = Loadable(lazy(() => import("./pages/Shop")));
const Quests = Loadable(lazy(() => import("./pages/Quests")));
const Achievements = Loadable(lazy(() => import("./pages/Achievements")));
const Habits = Loadable(lazy(() => import("./pages/Habits")));
const Mood = Loadable(lazy(() => import("./pages/Mood")));
const Inventory = Loadable(lazy(() => import("./pages/Inventory")));
const ShoppingList = Loadable(lazy(() => import("./pages/ShoppingList")));
const NotFound = Loadable(lazy(() => import("./pages/NotFound")));

// Placeholder pages for missing components
const Skills = () => <PlaceholderPage title="Skills" />;
const GrowthTree = () => <PlaceholderPage title="Growth Tree" />;
const Friends = () => <PlaceholderPage title="Friends" />;
const Community = () => <PlaceholderPage title="Community" />;
const Settings = () => <PlaceholderPage title="Settings" />;
const Help = () => <PlaceholderPage title="Help" />;

// Auth pages
const Login = () => <PlaceholderPage title="Login" />;
const Signup = () => <PlaceholderPage title="Signup" />;
const ForgotPassword = () => <PlaceholderPage title="Forgot Password" />;

export const Routes = () => {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path="/" element={<Layout><Outlet /></Layout>}>
          {/* Auth routes */}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          
          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" /></ProtectedRoute>} />
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="character" element={<ProtectedRoute><Character /></ProtectedRoute>} />
          <Route path="shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
          <Route path="quests" element={<ProtectedRoute><Quests /></ProtectedRoute>} />
          <Route path="skills" element={<ProtectedRoute><Skills /></ProtectedRoute>} />
          <Route path="achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
          <Route path="habits" element={<ProtectedRoute><Habits /></ProtectedRoute>} />
          <Route path="mood" element={<ProtectedRoute><Mood /></ProtectedRoute>} />
          <Route path="growth-tree" element={<ProtectedRoute><GrowthTree /></ProtectedRoute>} />
          <Route path="friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
          <Route path="community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
          <Route path="inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="shopping-list" element={<ProtectedRoute><ShoppingList /></ProtectedRoute>} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </RouterRoutes>
    </BrowserRouter>
  );
};

export default Routes;
