
export const DataSyncingIndicator = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background/95 shadow-md rounded-md flex justify-center items-center p-2 border border-primary/20">
      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
      <span className="text-sm">Syncing data...</span>
    </div>
  );
};
