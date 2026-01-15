import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "./context/authContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  const { logIn } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    const data = {
      username,
      password,
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_DB_URL}/auth/signin`,
        data
      );
      if (response) {
        logIn(response.data.accessToken);
        navigate("/");
        setErrMsg("");
      }
    } catch (err) {
      console.log(err);
      setErrMsg(err.response.data.message);
    }
    setUsername("");
    setPassword("");
  };

  return (
    <div className="h-screen flex items-center">
      <div className="w-11/12 sm:w-122 h-max pb-4 border border-zinc-200 rounded-xl shadow-xl bg-white/95 backdrop-blur-sm mx-auto">
        <div className="h-max py-2 border-b w-10/12 mx-auto border-zinc-200">
          <h1 className="text-center text-2xl text-zinc-700 font-medium">
            Log in
          </h1>
        </div>
        {errMsg && (
          <div className="w-10/12 h-max py-1 bg-red-300 mx-auto rounded-sm mt-2 -mb-2 px-2 text-red-700 border-1 border-red-600">
            <p>{errMsg}</p>
          </div>
        )}
        <form
          onSubmit={handleSignIn}
          className="w-10/12 mx-auto border border-zinc-200 p-4 rounded-lg bg-zinc-100/20 shadow-sm text-lg mt-4 flex flex-col"
        >
          <label>Username</label>
          <input
            value={username}
            className="bg-white border rounded-md shadow-sm focus:outline-indigo-500/40 px-2 h-9 border-zinc-200"
            placeholder="Your username"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="mt-4">Password</label>
          <input
            value={password}
            className="bg-white border rounded-md shadow-sm focus:outline-indigo-500/40 px-2 h-9 border-zinc-200"
            placeholder="Your password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full h-9 mt-4 bg-green-300 text-green-800 shadow-sm transition rounded-sm cursor-pointer hover:bg-green-400/80"
            type="subbmit"
          >
            Log in
          </button>
        </form>
        <div className="w-10/12 mx-auto text-center border-b border-zinc-200 text-lg mt-3">
          <p>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-green-600 bg-green-100 px-2 rounded-full py-0.5 font-bolder cursor-pointer hover:bg-green-200"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
