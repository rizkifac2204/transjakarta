"use client";

import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function Template({ children }) {
  return (
    <>
      <Breadcrumbs />
      {children}
    </>
  );
}
