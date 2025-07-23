"use client";
import React from "react";

const AuthDivider = () => {
  return (
    <div className="relative flex justify-center items-center my-6">
      <div className="absolute inset-x-0 border-t border-gray-300"></div>
      <span className="relative bg-white px-3 text-sm text-gray-500">OR</span>
    </div>
  );
};

export default AuthDivider;
