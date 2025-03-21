
export const DataSyncingIndicator = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 flex justify-center items-center p-2">
      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
      <span className="text-sm">Syncing your data...</span>
    </div>
  );
};
