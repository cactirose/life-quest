
import React, { Suspense, LazyExoticComponent, ComponentType } from "react";

interface LoadableProps {
  children: LazyExoticComponent<ComponentType<any>>;
}

const Loadable = (Component: LazyExoticComponent<ComponentType<any>>) => (props: any) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <Component {...props} />
    </Suspense>
  );
};

export default Loadable;
