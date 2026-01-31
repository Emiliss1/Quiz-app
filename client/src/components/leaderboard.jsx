import axios from "axios";
import { useEffect, useState } from "react";
import { FaTrophy } from "react-icons/fa";

export function Leaderboard() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_DB_URL}/user/topusers`,
        );

        if (response) {
          setUsers(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchTopUsers();
  }, []);
  return (
    <div className="w-11/12 sm:w-120  h-max pb-4 shadow-xl/20 mb-4 sm:mb-0 bg-white/95 backdrop-blur-sm border border-zinc-200 rounded-xl">
      <div className="bg-gray-200/20 border-b border-zinc-200  text-xl font-medium py-4 flex justify-center gap-2 items-center">
        <FaTrophy className="text-2xl text-yellow-500" />
        <h1 className="break-all">Leaderboard</h1>
        <FaTrophy className="text-2xl text-yellow-500" />
      </div>

      <div className="w-11/12 p-4 flex flex-col gap-4  items-center bg-white border border-zinc-200 mx-auto mt-4 rounded-lg shadow-sm">
        {users ? (
          users.map((user, index) => (
            <div
              className="w-full py-2 flex items-center text-zinc-700 gap-2 shadow-sm px-4 bg-gray-100/50 border border-zinc-200 rounded-md"
              key={index}
            >
              <p
                className={`font-medium w-7 h-7 text-center rounded-full ${
                  index === 0
                    ? "text-amber-600 bg-amber-200 border-2 border-amber-400"
                    : index === 1
                      ? "text-slate-500 bg-slate-200 border-2 border-slate-500"
                      : index === 2
                        ? "text-amber-600 bg-orange-300 border-2 border-amber-600"
                        : ""
                }`}
              >
                {index + 1}
              </p>
              <p className="font-medium text-lg text-zinc-800">
                {user.username}
              </p>
              <p className="ml-auto font-medium text-lg ">{user.points}</p>
            </div>
          ))
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
