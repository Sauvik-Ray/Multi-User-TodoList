"use client";

import * as React from "react";
import { ToastContext } from "@/components/ui/toaster";

export function useToast() {
  const toast = React.useContext(ToastContext);

  if (!toast) {
    throw new Error("useToast must be used inside <ToasterProvider />");
  }

  return toast;
}
