import { RiAdminFill } from "react-icons/ri";
import { useAuth } from "./context/authContext";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthErr } from "./authErr";
import { Footer } from "./footer";

export default function Settings() {
  const [newUsername, setNewUsername] = useState("");
  const [password, setPassword] = useState("");
  const [curPassword, setCurPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confNewPassword, setConfNewPassword] = useState("");
  const [userErrMsg, setUserErrMsg] = useState("");
  const [userSuccMsg, setUserSuccMsg] = useState("");
  const [passErrMsg, setPassErrMsg] = useState("");
  const [passSuccMsg, setPassSuccMsg] = useState("");

  const { user, updateToken, authErr, handleAuthErr } = useAuth();

  const navigate = useNavigate();

  const token = Cookies.get("token");
  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    try {
      const data = {
        newUsername,
        password,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_DB_URL}/user/updateusername`,
        data,
        tokenHeader
      );
      console.log(response);

      if (response) {
        Cookies.set("token", response.data.accessToken, { expires: 1 / 24 });
        updateToken(response.data.accessToken);
        setUserErrMsg("");
        setNewUsername("");
        setPassword("");
        setUserSuccMsg("Successfully changed your username");
      }
    } catch (err) {
      console.log(err);
      if (err.status === 401) {
        handleAuthErr(true);
      }
      setUserErrMsg(err.response.data.message);
      setUserSuccMsg("");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      const data = {
        password: curPassword,
        newPassword,
        confNewPassword,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_DB_URL}/user/updatepassword`,
        data,
        tokenHeader
      );

      if (response) {
        setPassErrMsg("");
        setPassSuccMsg("You successfully changed your password");
        setCurPassword("");
        setNewPassword("");
        setConfNewPassword("");
      }
    } catch (err) {
      if (err.status === 401) {
        handleAuthErr(true);
      }
      console.log(err);
      setPassErrMsg(err.response.data.message);
      setPassSuccMsg("");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="w-11/12 grow lg:w-[900px] mb-8 h-max pb-8 bg-white/95 backdrop-blur-sm mx-auto mt-28 border border-zinc-200 rounded-xl shadow-xl/20">
        {authErr ? (
          <AuthErr />
        ) : (
          <div>
            <div className="bg-gray-200/20 py-4 border-b border-zinc-200 text-center text-3xl font-medium">
              <h1>Settings</h1>
            </div>
            <div className="flex items-center shadow-md w-11/12 mx-auto mt-6 bg-white border border-zinc-200 rounded-lg p-4 gap-4">
              {user?.role === "admin" ? (
                <RiAdminFill className="text-6xl bg-gray-100/50 p-2 rounded-full border border-zinc-200 text-indigo-600" />
              ) : (
                <FaUser className="text-6xl " />
              )}
              <p
                className={`text-2xl  w-max ${
                  user?.role === "admin" ? "text-indigo-700" : "text-zinc-800"
                }`}
              >
                {user?.username}
              </p>
            </div>
            <div className="flex flex-col items-center lg:flex-row mt-8 justify-center gap-8">
              <div className="h-max w-11/12 sm:w-78 bg-gray-100/20 text-zinc-800 shadow-md border border-zinc-200 rounded-lg px-2 sm:px-8 p-4">
                <h1 className="text-lg text-center">Change username</h1>
                <form
                  onSubmit={handleUpdateUsername}
                  className="mt-2 flex flex-col "
                >
                  <label className="text-lg">New username</label>
                  <input
                    value={newUsername}
                    required
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="p-2 border bg-gray-100/50 rounded-lg border-zinc-200"
                    type="text"
                  />
                  <label className="text-lg mt-4">Password</label>
                  <input
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 border bg-gray-100/50 rounded-lg border-zinc-200"
                    type="password"
                  />
                  {userErrMsg && (
                    <div className="w-full bg-red-100 rounded-lg py-1 px-4 h-max break-all mt-2 border border-red-600 text-red-600">
                      {userErrMsg}
                    </div>
                  )}
                  {userSuccMsg && (
                    <div className="w-full bg-green-100 rounded-lg py-1 px-4 h-max break-all mt-2 border border-green-600 text-green-600">
                      {userSuccMsg}
                    </div>
                  )}
                  <button
                    className="mt-2 bg-indigo-500 py-1 rounded-lg text-white shadow-sm font-medium cursor-pointer hover:bg-indigo-600/90 transition"
                    type="submit"
                  >
                    Update
                  </button>
                </form>
              </div>
              <div className="h-max w-11/12 sm:w-78 bg-gray-100/20 text-zinc-800 shadow-md border border-zinc-200 rounded-lg px-2 sm:px-8 p-4">
                <h1 className="text-lg text-center">Change Password</h1>
                <form
                  onSubmit={handleUpdatePassword}
                  className="mt-2 flex flex-col "
                >
                  <label className="text-lg">Current password</label>
                  <input
                    value={curPassword}
                    required
                    onChange={(e) => setCurPassword(e.target.value)}
                    className="p-2 border bg-gray-100/50 rounded-lg border-zinc-200"
                    type="password"
                  />
                  <label className="text-lg mt-4">New password</label>
                  <input
                    value={newPassword}
                    required
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="p-2 border bg-gray-100/50 rounded-lg border-zinc-200"
                    type="password"
                  />
                  <label className="text-lg mt-4">Confirm new password</label>
                  <input
                    value={confNewPassword}
                    required
                    onChange={(e) => setConfNewPassword(e.target.value)}
                    className="p-2 border bg-gray-100/50 rounded-lg border-zinc-200"
                    type="password"
                  />
                  {passErrMsg && (
                    <div className="w-full bg-red-100 rounded-lg py-1 px-4 h-max break-all mt-2 border border-red-600 text-red-600">
                      {passErrMsg}
                    </div>
                  )}
                  {passSuccMsg && (
                    <div className="w-full bg-green-100 rounded-lg py-1 px-4 h-max break-all mt-2 border border-green-600 text-green-600">
                      {passSuccMsg}
                    </div>
                  )}
                  <button
                    className="mt-2 bg-indigo-500 py-1 rounded-lg text-white shadow-sm font-medium cursor-pointer hover:bg-indigo-600/90 transition"
                    type="submit"
                  >
                    Update
                  </button>
                </form>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={() => navigate("/")}
                className="w-48 rounded-lg py-1.5 shadow-md border bg-gray-100/20 text-zinc-800 font-medium border-zinc-300 cursor-pointer hover:bg-gray-100/50 transition"
              >
                Menu
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
