import Cookies from "js-cookie";
import { AuthErr } from "./authErr";
import { MdLibraryBooks } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
import { Title } from "./title";
import { Leaderboard } from "./leaderboard";
import { IoMdSettings } from "react-icons/io";
import { Footer } from "./footer";

export default function Main() {
  const token = Cookies.get("token");
  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const navigate = useNavigate();

  const { authErr } = useAuth();

  return (
    <div className="flex flex-col h-screen">
      <div className="mt-28 grow w-full 3xl:grid flex-col lg:flex-row justify-items-center px-4 flex gap-4 justify-center items-center lg:items-start lg:justify-end  gap-y-4  3xl:grid-cols-3">
        <div className="w-11/12 sm:w-148  3xl:col-start-2 3xl:justify-self-center h-max min-h-96 p-2 bg-white/95 backdrop-blur-sm border rounded-xl shadow-xl/20 border-zinc-200 ">
          <Title title={"Menu"} />
          {authErr ? (
            <AuthErr />
          ) : (
            <div className="flex flex-col items-center mt-4 gap-4">
              <div
                onClick={() => navigate("/quizzes")}
                className="w-11/12 h-max px-2 py-2 border-l-4 border-indigo-500 rounded-sm shadow-md bg-gray-200/50  flex items-center gap-4 cursor-pointer transition  hover:scale-101"
              >
                <MdLibraryBooks className="text-4xl text-indigo-500" />
                <div className="flex w-11/12 flex-col justify-center">
                  <h1 className="text-lg font-medium">Quizzes</h1>
                  <p className="text-zinc-700 sm:text-base text-sm">
                    Search for quizzes and complete them to earn points
                  </p>
                </div>
              </div>
              <div
                onClick={() => navigate("/settings")}
                className="w-11/12 h-max px-2 py-2 border-l-4 border-zinc-800 rounded-sm shadow-md bg-gray-200/50  flex items-center gap-4 cursor-pointer transition  hover:scale-101"
              >
                <IoMdSettings className="text-4xl text-zinc-800" />
                <div className="flex w-11/12 flex-col justify-center">
                  <h1 className="text-lg font-medium">Settings</h1>
                  <p className="text-zinc-700 text-sm sm:text-base">
                    Manage your account, update username or change password
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <Leaderboard />
      </div>
      <Footer />
    </div>
  );
}
