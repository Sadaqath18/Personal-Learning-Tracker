"use client";
import { motion } from "framer-motion";

export default function Spinner() {
  return (
    <motion.div
      className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    />
  );
}
