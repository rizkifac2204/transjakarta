"use client";

import { useFormStatus } from "react-dom";
import Button from "@/components/ui/Button";

function ButtonSubmit({ text, className }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className={`btn-sm ${className}`}
      disabled={pending}
      isLoading={pending}
      text={pending ? "Memproses ..." : text}
    />
  );
}

export default ButtonSubmit;
