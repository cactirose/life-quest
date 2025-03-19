
import { Link, useLocation } from "react-router-dom";
import { useGameData } from "@/contexts/DataContext";
import { 
  MapPin, 
  UserCircle, 
  Scroll, 
  GitBranch, 
  ShoppingBag, 
  Package,
  LayoutDashboard,
  Trophy,
  Calendar,
  HeartPulse
} from "lucide-react";

const Navbar = () => {
  const { character } = useGameData();
  const location = useLocation();
  
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/quests", label: "Quests", icon: <Scroll size={20} /> },
    { path: "/character", label: "Character", icon: <UserCircle size={20} /> },
    { path: "/skills", label: "Skills", icon: <GitBranch size={20} /> },
    { path: "/shop", label: "Shop", icon: <ShoppingBag size={20} /> },
    { path: "/inventory", label: "Inventory", icon: <Package size={20} /> },
    { path: "/challenges", label: "Challenges", icon: <Trophy size={20} /> },
    { path: "/habits", label: "Habits", icon: <Calendar size={20} /> },
    { path: "/mood", label: "Mood", icon: <HeartPulse size={20} /> }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-rpg-brown shadow-md py-2">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <MapPin size={24} className="text-rpg-tan" />
            <h1 className="text-xl font-pixel text-rpg-tan">Life Quest</h1>
          </Link>
          
          {/* Status Bar */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-rpg-tan font-pixel">
              <span>Level: {character.level}</span>
              <span>XP: {character.xp}/{character.nextLevelXp}</span>
              <span>Coins: {character.coins}</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="font-pixel">
            <ul className="flex space-x-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`flex items-center px-2 py-1 rounded transition-colors ${
                      location.pathname === item.path 
                        ? "bg-rpg-tan text-rpg-brown" 
                        : "text-rpg-tan hover:bg-rpg-dark-wood"
                    }`}
                  >
                    <span className="hidden md:block mr-1">{item.label}</span>
                    <span className="block">{item.icon}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
