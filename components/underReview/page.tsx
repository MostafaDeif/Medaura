"use client";

import { motion } from "framer-motion";

export default function UnderReview() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-gray-50 via-white to-gray-100 px-4 text-center">
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="mb-6"
      >
        <svg
          className="h-16 w-16 text-yellow-500 drop-shadow-md"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-3 text-3xl font-bold text-gray-800"
      >
        Account Under Review
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-md text-lg text-gray-600"
      >
        Your account is currently being reviewed by our team.
        <br />
        You will be notified once it’s approved.
      </motion.p>
    </div>
  );
}