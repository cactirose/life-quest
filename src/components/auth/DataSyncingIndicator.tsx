
import { useIsMobile } from "@/hooks/use-mobile";

interface DataSyncingIndicatorProps {
  isLoading?: boolean;
  isSyncing?: boolean;
}

export const DataSyncingIndicator = ({ isLoading, isSyncing }: DataSyncingIndicatorProps) => {
  const isMobile = useIsMobile();
  
  const message = isLoading ? "Loading your data..." : "Syncing data...";
  
  return (
    <div className={`fixed ${isMobile ? 'bottom-16' : 'bottom-4'} right-4 z-50 bg-background/95 shadow-md rounded-md flex justify-center items-center p-2 border border-primary/20`}>
      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
      <span className="text-sm">{message}</span>
    </div>
  );
};
