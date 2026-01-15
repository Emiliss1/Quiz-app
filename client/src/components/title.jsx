import React from "react";
import { FaUser } from "react-icons/fa";
import { IoExit } from "react-icons/io5";
import { useAuth } from "./context/authContext";
import { RiAdminFill } from "react-icons/ri";

export function Title({ title }) {
  const { user, authErr, logOut } = useAuth();
  return (
    <div className="h-max py-4 bg-gray-200/20 px-4 border-b-2 w-full border-gray-300/30 grid grid-cols-1 justify-items-center gap-y-2 sm:grid-cols-3 ">
      {!authErr && (
        <div className="flex gap-1 row-start-3 sm:row-start-1 items-center ">
          <div className="w-max h-9 bg-white px-2 shadow-sm rounded-full border border-zinc-200 self-center flex items-center gap-1">
            {user?.role === "admin" ? (
              <RiAdminFill className="text-lg  text-indigo-600" />
            ) : (
              <FaUser className="text-lg " />
            )}
            <p
              className={`text-lg w-max ${
                user?.role === "admin" ? "text-indigo-700" : "text-zinc-800"
              }`}
            >
              {user?.username}
            </p>
          </div>
          <div
            onClick={logOut}
            className="bg-red-200 h-8 w-8 flex items-center justify-center px-1 rounded-xl cursor-pointer hover:bg-red-300 transition"
          >
            <IoExit className="text-xl text-red-600" />
          </div>
        </div>
      )}

      <h1 className="mx-auto self-center break-all col-start-1 sm:col-start-2 text-4xl font-semibold text-slate-800 tracking-wide">
        {title}
      </h1>
      <div
        className={` ${
          !authErr ? "flex" : "hidden"
        } items-center bg-white sm:ml-auto w-max px-3 py-1 rounded-full border border-zinc-200 shadow-sm col-start-1 sm:col-start-3 self-end`}
      >
        <p>
          Points: <span className="font-medium">{user?.points}</span>
        </p>
      </div>
    </div>
  );
}
