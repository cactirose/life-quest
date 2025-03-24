
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type QuestSearchProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export const QuestSearch = ({ searchQuery, setSearchQuery }: QuestSearchProps) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <Input
        type="search"
        placeholder="Search quests or tags (e.g. #work)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 py-6 rounded-lg border-rpg-brown/30"
      />
    </div>
  );
};
