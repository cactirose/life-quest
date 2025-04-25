
import {
  Book,
  Calendar,
  CheckCircle,
  Coins,
  Dumbbell,
  Flame,
  Home,
  ListChecks,
  Settings,
  ShoppingBag,
  Trees,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

export function Sidebar() {
  return (
    <aside className="w-64 bg-rpg-brown/70 min-h-screen py-8 px-4 border-r border-rpg-tan/30">
      <nav className="space-y-6">
        <div>
          <h2 className="mb-2 font-semibold text-sm uppercase text-rpg-tan/80">
            General
          </h2>
          <ul className="space-y-1">
            <li>
              <Link to="/" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-rpg-tan/80 hover:bg-rpg-brown/50">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/character" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-rpg-tan/80 hover:bg-rpg-brown/50">
                <User className="h-5 w-5" />
                <span>Character</span>
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 font-semibold text-sm uppercase text-rpg-tan/80">
            Progress
          </h2>
          <ul className="space-y-1">
            <li>
              <Link to="/quests" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-rpg-tan/80 hover:bg-rpg-brown/50">
                <ListChecks className="h-5 w-5" />
                <span>Quests</span>
              </Link>
            </li>
            <li>
              <Link to="/habits" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-rpg-tan/80 hover:bg-rpg-brown/50">
                <CheckCircle className="h-5 w-5" />
                <span>Habits</span>
              </Link>
            </li>
            <li>
              <Link to="/mood" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-rpg-tan/80 hover:bg-rpg-brown/50">
                <Flame className="h-5 w-5" />
                <span>Mood Tracker</span>
              </Link>
            </li>
            <li>
              <Link to="/skills" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-rpg-tan/80 hover:bg-rpg-brown/50">
                <Trees className="h-5 w-5" />
                <span>Skills</span>
              </Link>
            </li>
            <li>
              <Link to="/journal" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-rpg-tan/80 hover:bg-rpg-brown/50">
                <Book className="h-5 w-5" />
                <span>Journal</span>
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 font-semibold text-sm uppercase text-rpg-tan/80">
            Marketplace
          </h2>
          <ul className="space-y-1">
            <li>
              <Link to="/inventory" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-rpg-tan/80 hover:bg-rpg-brown/50">
                <Dumbbell className="h-5 w-5" />
                <span>Inventory</span>
              </Link>
            </li>
            <li>
              <Link to="/shop" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-rpg-tan/80 hover:bg-rpg-brown/50">
                <Coins className="h-5 w-5" />
                <span>Shop</span>
              </Link>
            </li>
            <li>
              <Link to="/shopping-list" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-rpg-tan/80 hover:bg-rpg-brown/50">
                <ShoppingBag className="h-5 w-5" />
                <span>Shopping List</span>
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 font-semibold text-sm uppercase text-rpg-tan/80">
            Settings
          </h2>
          <ul className="space-y-1">
            <li>
              <Link to="/settings" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-rpg-tan/80 hover:bg-rpg-brown/50">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
