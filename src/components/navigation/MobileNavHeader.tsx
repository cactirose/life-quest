
import React from "react";

interface MobileNavHeaderProps {
  statusBar: React.ReactNode;
}

const MobileNavHeader = ({ statusBar }: MobileNavHeaderProps) => {
  return (
    <div className="p-4 border-b border-[hsl(var(--nav-hover))]">
      <h2 className="text-xl font-pixel mb-2">Life Quest</h2>
      {statusBar}
    </div>
  );
};

export default MobileNavHeader;
