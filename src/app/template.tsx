import React, { type ReactNode } from "react";

const Template = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default Template;
