import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthErr } from "./authErr";
import { Title } from "./title";
import { useAuth } from "./context/authContext";
import { useNavigate } from "react-router-dom";
import { HiDocumentAdd } from "react-icons/hi";
import { CreateQuiz } from "./createQuiz";
import { MdDelete, MdQuiz } from "react-icons/md";
import { Leaderboard } from "./leaderboard";
import { MdNavigateNext } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";
import { Footer } from "./footer";

export default function Quizzes() {
  const [adminComponent, setAdminComponent] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [quizzesData, setQuizzesData] = useState([]);
  const [curPage, setCurpage] = useState(0);
  const [lastPage, setLastPage] = useState(0);

  const { authErr, user, handleAuthErr } = useAuth();

  const navigate = useNavigate();

  const token = Cookies.get("token");
  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_DB_URL}/quiz/quizzes`,
          tokenHeader
        );

        console.log(response);
        if (response) {
          setQuizzes(pagination(response.data.reverse(), curPage).pageItems);
          setQuizzesData(response.data.reverse());

          setLastPage(pagination(response.data.reverse(), curPage).totalPages);
        }
      } catch (err) {
        console.log(err);
        if (err.status === 401) {
          handleAuthErr(true);
        }
      }
    };
    fetchQuizzes();
  }, [curPage]);

  function pagination(data, curPage = 0) {
    const itemsPerPage = 6;
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const pageItems = [];
    for (
      let i = curPage * itemsPerPage;
      i < itemsPerPage * (curPage + 1);
      i++
    ) {
      if (data[i]) {
        pageItems.push(data?.[i]);
      }
    }

    return { pageItems, totalPages };
  }

  const handleNavigateQuiz = (quiz) => {
    navigate(`/quiz/${quiz._id}`);
  };

  const handlePagination = (type) => {
    if (type === "next") {
      if (curPage + 1 < lastPage) {
        setCurpage((prev) => prev + 1);
      }
    }
    if (type === "prev") {
      if (curPage > 0) {
        setCurpage((prev) => prev - 1);
      }
    }
  };

  const handleRemoveQuiz = async (quiz) => {
    console.log(quiz);
    const data = {
      _id: quiz._id,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_DB_URL}/quiz/removequiz`,
        data,
        tokenHeader
      );

      console.log(response);

      if (response) {
        const filterQuizzes = quizzes.filter((quizz) => quizz._id !== quiz._id);

        const filteredQuizzes = quizzesData.filter(
          (quizz) => quizz._id !== quiz._id
        );
        setQuizzesData(filteredQuizzes);
        setLastPage(pagination(filteredQuizzes, curPage).totalPages);

        console.log("hadasda", filterQuizzes);
        if (filterQuizzes.length === 0) {
          if (curPage > 0) {
            setCurpage((prev) => prev - 1);
            setQuizzes(pagination(filteredQuizzes, curPage - 1).pageItems);
          }
        } else {
          setQuizzes(pagination(filteredQuizzes, curPage).pageItems);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="mt-28 w-full 3xl:grid grow flex-col lg:flex-row justify-items-center px-4 flex gap-4 justify-center items-center lg:items-start lg:justify-end  gap-y-4  3xl:grid-cols-3">
        <div className="flex 3xl:col-start-2 3xl:justify-self-center flex-col w-11/12 md:w-148">
          <div className="w-11/12 md:w-148 h-max max-h-[600px] overflow-y-auto backdrop-blur-sm pb-8 bg-white/95 border rounded-3xl shadow-xl/20 border-zinc-200  mx-auto">
            <Title title={"Quizzes"} />
            {authErr ? (
              <AuthErr />
            ) : (
              <div>
                {adminComponent ? (
                  <div>
                    <div className="flex justify-end w-11/12 mx-auto mt-2">
                      <button
                        onClick={() => setAdminComponent(false)}
                        className="w-28 h-10 bg-white border border-zinc-200 rounded-xl   ml-auto text-lg cursor-pointer shadow-sm hover:shadow-md hover:bg-zinc-50 transition"
                      >
                        Back
                      </button>
                    </div>

                    <CreateQuiz />
                  </div>
                ) : (
                  <div>
                    <h1 className="text-center pt-2 text-zinc-700 border-b text-lg w-11/12 mx-auto border-zinc-200 ">
                      Select one of the quizzes and earn points on completion
                    </h1>
                    <div className="mt-2 w-11/12 mx-auto flex justify-end">
                      <button
                        onClick={() => setAdminComponent(true)}
                        className={`${
                          user?.role === "admin" ? "flex" : "hidden"
                        } px-4 py-2 rounded-xl bg-indigo-500 text-white font-medium shadow-md hover:shadow-lg cursor-pointer hover:bg-indigo-600 transition items-center gap-2`}
                      >
                        <HiDocumentAdd className="text-xl" />
                        Add quiz
                      </button>
                    </div>

                    <div className="flex flex-col items-center mt-4 gap-2">
                      {quizzes.length > 0 ? (
                        quizzes.map((quiz, index) => (
                          <div
                            className="flex  w-11/12 py-4 text-zinc-800 items-center gap-2 rounded-2xl px-4 bg-gray-100/50 border border-zinc-200"
                            key={index}
                          >
                            <MdQuiz className="text-3xl text-indigo-500" />
                            <div className="flex flex-col xs:flex-row gap-4 xs:gap-0 xs:items-center w-full">
                              <div className="flex flex-col">
                                <p className="text-lg break-all font-semibold">
                                  {quiz.title}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2 text-zinc-500 items-start sm:items-center">
                                  <div className="flex gap-2 items-center">
                                    <p>Difficulty:</p>
                                    <p
                                      className={`${
                                        quiz.difficulty === "easy"
                                          ? "text-green-600 2 bg-green-100"
                                          : quiz.difficulty === "medium"
                                          ? "text-orange-600 bg-orange-100"
                                          : "text-red-600 bg-red-100"
                                      } rounded-full px-2 capitalize py-0.5 font-medium`}
                                    >
                                      {quiz.difficulty}
                                    </p>
                                  </div>
                                  <div className="flex gap-2 items-center">
                                    <p>Questions:</p>
                                    <p className="font-medium text-zinc-700">
                                      {quiz.questions.length}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 xs:ml-auto">
                                <button
                                  onClick={() => handleNavigateQuiz(quiz)}
                                  className="w-full xs:w-max xs:px-8 py-2  bg-gradient-to-r from-indigo-400 to-indigo-500 cursor-pointer  hover:shadow-md hover:from-indigo-500 hover:to-indigo-600 transition text-white shadow-sm rounded-md xs:ml-auto  font-medium"
                                >
                                  Start
                                </button>

                                <button
                                  onClick={() => handleRemoveQuiz(quiz)}
                                  className={`${
                                    user?.role === "admin" ? "block" : "hidden"
                                  } w-full xs:w-max xs:px-6 py-2  bg-gradient-to-r from-red-400 to-red-500/90 cursor-pointer  hover:shadow-md hover:from-red-500 hover:to-red-600 transition text-white shadow-sm rounded-md xs:ml-auto  font-medium`}
                                >
                                  <MdDelete className="text-xl text-gray-100" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex justify-center text-lg text-zinc-700">
                          <p>There is no quizzes at the moment</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div
              className={`${
                !adminComponent && quizzes.length > 0 ? "flex" : "hidden"
              }  justify-center gap-2 mt-4 items-center`}
            >
              <button
                onClick={() => handlePagination("prev")}
                className={`w-max px-1 ${
                  curPage > 0
                    ? "bg-indigo-500 cursor-pointer hover:bg-indigo-600/90"
                    : "bg-gray-300"
                } rounded-md `}
              >
                <MdNavigateBefore className="text-3xl text-white" />
              </button>
              <p className="text-lg text-zinc-800 font-medium">
                {curPage + 1}/{lastPage}
              </p>
              <button
                onClick={() => handlePagination("next")}
                className={`w-max px-1 ${
                  curPage + 1 < lastPage
                    ? "bg-indigo-500 cursor-pointer hover:bg-indigo-600/90"
                    : "bg-gray-300"
                } rounded-md `}
              >
                <MdNavigateNext className="text-3xl text-white" />
              </button>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/")}
                className="w-48 h-10 bg-gray-100/50 font-medium text-zinc-700 shadow-lg border border-zinc-200 rounded-xl mt-4 text-lg cursor-pointer hover:scale-101"
              >
                Menu
              </button>
            </div>
          </div>
        </div>
        <Leaderboard />
      </div>
      <Footer />
    </div>
  );
}
