import React from "react";

import { FaSpinner } from "react-icons/fa";

const Space = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="flex items-center gap-3">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        <h1 className="text-3xl font-bold text-gray-800">404</h1>
      </div>
      <p className="text-xl text-gray-600">Page not found</p>
      <p className="text-gray-500">Space loki vacchesaav...!</p>
    </div>
  );
};

export default Space;
