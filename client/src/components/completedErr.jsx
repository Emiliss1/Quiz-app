import { useNavigate } from "react-router-dom";

export function CompletedErr({ err }) {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-100/20 w-11/12 xs:w-max px-4 xs:px-20 flex justify-center items-center gap-2 flex-col shadow-md py-4 mx-auto rounded-xl border border-zinc-200 mt-8">
      <p className="text-lg text-center">{err}</p>
      <button
        onClick={() => navigate("/quizzes")}
        className="py-1.5 text-white font-medium rounded-md w-5/6 xs:w-32 bg-indigo-500 cursor-pointer hover:bg-indigo-600/90"
      >
        Back
      </button>
    </div>
  );
}
