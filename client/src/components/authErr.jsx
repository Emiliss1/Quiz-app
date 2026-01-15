import React from "react";
import { useNavigate } from "react-router-dom";

export function AuthErr() {
  const navigate = useNavigate();
  return (
    <div className="w-11/12 h-max py-10 sm:py-18 bg-gray-200/20 border border-zinc-200 shadow-md rounded-xl mx-auto mt-4 flex items-center justify-center text-lg">
      <div className="flex flex-col text-center items-center gap-2">
        <p>You are not logged in. Please sign in</p>
        <button
          onClick={() => navigate("/login")}
          className="w-5/6 sm:w-36 h-9 rounded-sm bg-gradient-to-r from-green-300 to-green-400/70 shadow-sm font-medium text-green-700 cursor-pointer hover:bg-green-400/70"
        >
          Log in
        </button>
      </div>
    </div>
  );
}
