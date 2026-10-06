"use client";

import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#111111] group-[.toaster]:text-white group-[.toaster]:border-[#222222] group-[.toaster]:shadow-xl group-[.toaster]:rounded-none text-xs uppercase tracking-wider font-semibold",
          description: "group-[.toast]:text-[#AAAAAA] normal-case text-xs tracking-normal font-normal",
          actionButton:
            "group-[.toast]:bg-[#B6E600] group-[.toast]:text-[#111111] font-bold",
          cancelButton:
            "group-[.toast]:bg-[#333333] group-[.toast]:text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
