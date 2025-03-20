
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { useIsMobile } from "./hooks/use-mobile";

const queryClient = new QueryClient();

// Initialize theme when app loads
initializeTheme();

// Layout component that includes the navbar
const Layout = ({ children }: { children: ReactNode }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <main className={`flex-grow px-${isMobile ? '2' : '4'} pb-16 pt-${isMobile ? '16' : '20'}`}>
        {children}
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/quests" element={<Layout><Quests /></Layout>} />
            <Route path="/character" element={<Layout><Character /></Layout>} />
            <Route path="/skills" element={<Layout><SkillTree /></Layout>} />
            <Route path="/shop" element={<Layout><Shop /></Layout>} />
            <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
            <Route path="/challenges" element={<Layout><Challenges /></Layout>} />
            <Route path="/habits" element={<Layout><Habits /></Layout>} />
            <Route path="/mood" element={<Layout><Mood /></Layout>} />
            <Route path="/achievements" element={<Layout><Achievements /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DataProvider>
  </QueryClientProvider>
);

export default App;
