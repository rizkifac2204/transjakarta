"use client";

import { useEffect } from "react";
import { useNotFound } from "@/providers/not-found-context";
import NotFoundPublik from "@/components/front/NotFoundPublik";

export default function CustomNotFoundPage() {
  const { setIsNotFound } = useNotFound();

  useEffect(() => {
    setIsNotFound(true);
    return () => setIsNotFound(false); // reset saat pindah
  }, [setIsNotFound]);

  return <NotFoundPublik />;
}
