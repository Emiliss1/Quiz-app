import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
import { AuthErr } from "./authErr";

export function CompleteQuiz({ score, points }) {
  const navigate = useNavigate();

  const { authErr } = useAuth();

  return (
    <div className="mt-4 text-zinc-800">
      {authErr ? (
        <AuthErr />
      ) : (
        <div>
          <div className="bg-gray-100/20 w-11/12 xs:w-max px-4 xs:px-20 shadow-md py-4 mx-auto rounded-xl border border-zinc-200">
            <h1 className="text-center text-2xl">
              You have completed the quiz
            </h1>
            <p className="text-center text-2xl mt-4">
              Your score{" "}
              <span
                className={`px-4 rounded-full  ${
                  score < 70 && score >= 40
                    ? "text-orange-600 bg-orange-100"
                    : score > 70 && score < 100
                    ? "text-green-600 bg-green-100"
                    : score === 100
                    ? "text-violet-600 bg-violet-100"
                    : "text-red-600 bg-red-100"
                }`}
              >
                {score}%
              </span>
            </p>
            {score >= 70 ? (
              <p className="text-center text-center text-xl mt-2">
                You have earned{" "}
                <span className="text-indigo-600 px-2 rounded-xl bg-indigo-100 font-medium">
                  {points}
                </span>
                points
              </p>
            ) : score < 40 ? (
              <p className="text-xl text-center mt-2">
                You lost{" "}
                <span className="text-red-600 bg-red-100 px-2 rounded-xl font-medium">
                  {Math.abs(points)}
                </span>{" "}
                point
              </p>
            ) : (
              <p className="text-xl text-center mt-2">
                Your score is too low so you get no points
              </p>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => navigate("/quizzes")}
              className="w-11/12 xs:w-40 h-9 bg-gradient-to-r from-indigo-500 to-indigo-600 text-lg font-medium shadow-md text-white rounded-sm cursor-pointer hover:from-indigo-500/95 hover:to-indigo-600/95"
            >
              Finish quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
