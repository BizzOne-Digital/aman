"use client";

import { motion } from "framer-motion";

export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        className="route-curtain"
        aria-hidden="true"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        style={{ position: "fixed", inset: 0, zIndex: 45, background: "#075dff", transformOrigin: "top", pointerEvents: "none" }}
      />
      {children}
    </>
  );
}
