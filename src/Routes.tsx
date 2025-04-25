
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import Loadable from "./components/ui/Loadable";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Lazy load pages
const Dashboard = Loadable({ children: lazy(() => import("./pages/Dashboard")) });
const Character = Loadable({ children: lazy(() => import("./pages/Character")) });
const Shop = Loadable({ children: lazy(() => import("./pages/Shop")) });
const Quests = Loadable({ children: lazy(() => import("./pages/Quests")) });
const Skills = Loadable({ children: lazy(() => import("./pages/Skills")) });
const Achievements = Loadable({ children: lazy(() => import("./pages/Achievements")) });
const Habits = Loadable({ children: lazy(() => import("./pages/Habits")) });
const Mood = Loadable({ children: lazy(() => import("./pages/Mood")) });
const GrowthTree = Loadable({ children: lazy(() => import("./pages/GrowthTree")) });
const Friends = Loadable({ children: lazy(() => import("./pages/Friends")) });
const Community = Loadable({ children: lazy(() => import("./pages/Community")) });
const Settings = Loadable({ children: lazy(() => import("./pages/Settings")) });
const Help = Loadable({ children: lazy(() => import("./pages/Help")) });
const Inventory = Loadable({ children: lazy(() => import("./pages/Inventory")) });
const ShoppingList = Loadable({ children: lazy(() => import("./pages/ShoppingList")) });
const Login = Loadable({ children: lazy(() => import("./pages/auth/Login")) });
const Signup = Loadable({ children: lazy(() => import("./pages/auth/Signup")) });
const ForgotPassword = Loadable({ children: lazy(() => import("./pages/auth/ForgotPassword")) });
const NotFound = Loadable({ children: lazy(() => import("./pages/NotFound")) });

export const Routes = () => {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path="/" element={<Layout />}>
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
