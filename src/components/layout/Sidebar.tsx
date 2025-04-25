import {
  Book,
  Calendar,
  CheckCircle,
  Coin,
  Dumbbell,
  Flame,
  Home,
  ListChecks,
  Settings,
  ShoppingBag,
  Tree2,
  User,
} from "lucide-react";
import { NavLink } from "./NavLink";

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
              <NavLink href="/" label="Home" icon={<Home className="h-5 w-5" />} />
            </li>
            <li>
              <NavLink href="/character" label="Character" icon={<User className="h-5 w-5" />} />
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 font-semibold text-sm uppercase text-rpg-tan/80">
            Progress
          </h2>
          <ul className="space-y-1">
            <li>
              <NavLink href="/quests" label="Quests" icon={<ListChecks className="h-5 w-5" />} />
            </li>
            <li>
              <NavLink href="/habits" label="Habits" icon={<CheckCircle className="h-5 w-5" />} />
            </li>
            <li>
              <NavLink href="/mood" label="Mood Tracker" icon={<Flame className="h-5 w-5" />} />
            </li>
            <li>
              <NavLink href="/skills" label="Skills" icon={<Tree2 className="h-5 w-5" />} />
            </li>
            <li>
              <NavLink href="/journal" label="Journal" icon={<Book className="h-5 w-5" />} />
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 font-semibold text-sm uppercase text-rpg-tan/80">
            Marketplace
          </h2>
          <ul className="space-y-1">
            <li>
              <NavLink href="/inventory" label="Inventory" icon={<Dumbbell className="h-5 w-5" />} />
            </li>
            <li>
              <NavLink href="/shop" label="Shop" icon={<Coin className="h-5 w-5" />} />
            </li>
            <li>
              <NavLink href="/shopping-list" label="Shopping List" icon={<ShoppingBag className="h-5 w-5" />} />
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 font-semibold text-sm uppercase text-rpg-tan/80">
            Settings
          </h2>
          <ul className="space-y-1">
            <li>
              <NavLink href="/settings" label="Settings" icon={<Settings className="h-5 w-5" />} />
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
