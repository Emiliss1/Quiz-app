import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { CompleteQuiz } from "./completeQuiz";
import { useAuth } from "./context/authContext";
import { Footer } from "./footer";

export default function Quiz() {
  const [quiz, setQuiz] = useState("");
  const [curQuestion, setCurQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(0);

  const { pathname } = useLocation();
  const quizId = pathname.replace("/quiz/", "");

  const token = Cookies.get("token");
  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { authErr, updateBalance } = useAuth();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_DB_URL}/quiz/getquiz/${quizId}`,
          tokenHeader
        );
        if (response) {
          setQuiz(response.data);
        }
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchQuiz();
  }, []);

  const handleAnswerQuestion = (value, ans) => {
    if (value) {
      if (answers.some((answer) => answer.questionIndex === curQuestion)) {
        const addedAnswers = answers.map((answer) => {
          const newAns = answer;
          if (answer.questionIndex === curQuestion) {
            newAns.guessedAnswers.push(ans);
          }
          return newAns;
        });
        setAnswers(addedAnswers);
      } else {
        const answer = {
          questionIndex: curQuestion,
          guessedAnswers: [],
        };

        answer.guessedAnswers.push(ans);

        setAnswers((prev) => [answer, ...prev]);
      }
    } else {
      const newAnswers = answers.map((oldAns) => {
        const newAns = oldAns;
        if (oldAns.questionIndex === curQuestion) {
          const newGuessedAnswers = oldAns.guessedAnswers.filter(
            (guessedAns) => guessedAns !== ans
          );
          newAns.guessedAnswers = newGuessedAnswers;
        }

        return newAns;
      });
      setAnswers(newAnswers);
    }
    console.log(answers);
  };

  const handleQuestionNavigation = (type) => {
    if (type === "next") {
      if (curQuestion < quiz.questions.length - 1) {
        setCurQuestion((prev) => prev + 1);
      }
    }
    if (type === "prev") {
      if (curQuestion > 0) {
        setCurQuestion((prev) => prev - 1);
      }
    }
  };

  const checkCheckboxValue = (value) => {
    const foundQuestion = answers.find(
      (answ) => answ.questionIndex === curQuestion
    );
    if (!foundQuestion) return false;
    console.log(
      foundQuestion.guessedAnswers.some((ans) => ans.answer === value.answer)
    );
    return foundQuestion.guessedAnswers.some(
      (ans) => ans.answer === value.answer
    );
  };

  const calculateCorrectAnswers = () => {
    let correctAnswers = 0;

    answers.forEach((ans) => {
      const isCorrect = ans.guessedAnswers.every(
        (gAns) => gAns.isCorrect === true
      );
      if (isCorrect) correctAnswers++;
      console.log(isCorrect);
    });

    const answerScore = Math.round(
      (correctAnswers / quiz.questions.length) * 100
    );
    setScore(answerScore);
    console.log(answerScore);

    let answerPoints = 0;

    if (answerScore < 70 && answerScore >= 40) {
      answerPoints = 0;
    }
    if (answerScore >= 70 && answerScore < 80) {
      answerPoints = 1;
    }
    if (answerScore >= 80 && answerScore < 90) {
      answerPoints = 2;
    }
    if (answerScore >= 90 && answerScore < 100) {
      answerPoints = 3;
    }
    if (answerScore === 100) {
      answerPoints = 5;
    }
    if (answerScore >= 0 && answerScore < 40) {
      answerPoints = -1;
    }

    setPoints(answerPoints);

    return answerPoints;
  };

  const handleFinishQuiz = async () => {
    const pointsData = { points: calculateCorrectAnswers() };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_DB_URL}/quiz/completequiz`,
        pointsData,
        tokenHeader
      );
      console.log(response);
      if (response) {
        setIsFinished(true);
        updateBalance();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="w-11/12  lg:w-[1000px] h-max pb-8 bg-white/95 mx-auto mt-28 border backdrop-blur-sm border-zinc-200 shadow-xl/20 rounded-xl">
        <div className="flex justify-center items-center py-2  bg-gray-200/20 border-b-1 border-zinc-200  text-3xl">
          <h1>{quiz.title}</h1>
        </div>
        {isFinished ? (
          <CompleteQuiz score={score} points={points} />
        ) : authErr ? (
          <authErr />
        ) : (
          <div className="flex flex-col">
            {quiz.questions?.length > 0 &&
              quiz.questions.map((question, index) => (
                <div key={index}>
                  {index === curQuestion && (
                    <div>
                      <div className="flex justify-center items-center h-28 shadow-sm text-2xl border bg-gray-100/50 mt-4 rounded-lg border-zinc-200 w-11/12 mx-auto">
                        <p className="break-all">{question.question}</p>
                      </div>
                      <div className="w-11/12 grid mx-auto grid-cols-1 xs:grid-cols-2 shadow-sm bg-white border border-zinc-200 py-12 rounded-lg justify-center justify-items-center mt-8 gap-8">
                        {question.answers?.length > 0 &&
                          question.answers.map((ans, index) => (
                            <div
                              className="bg-gray-100/50 py-2 px-4 shadow-sm break-all border border-zinc-200 rounded-md w-10/12 flex items-center  justify-between"
                              key={index}
                            >
                              <p className="w-11/12 break-all">{ans.answer}</p>
                              <input
                                checked={checkCheckboxValue(ans)}
                                type="checkbox"
                                onChange={(e) =>
                                  handleAnswerQuestion(e.target.checked, ans)
                                }
                                className="w-6 h-6 accent-green-400"
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            <div className="grid grid-cols-1 md:grid-cols-3 px-1 xs:px-8 items-center">
              <div className="flex col-start-1 md:col-start-2 shadow-md text-white bg-gray-100/20 border border-zinc-200 px-4 py-3 rounded-xl mx-auto w-max text-lg mt-8 gap-4 items-center">
                <button
                  onClick={() => handleQuestionNavigation("prev")}
                  className={`w-12 xs:w-20 h-9   bg-gradient-to-l ${
                    curQuestion > 0
                      ? "from-indigo-500 to-indigo-600 hover:from-indigo-500/90 hover:to-indigo-600/90"
                      : "from-gray-200 to-gray-300 text-zinc-700"
                  }  rounded-sm cursor-pointer  transition`}
                >
                  Prev
                </button>
                <p className="font-medium text-zinc-700">
                  {curQuestion + 1}/{quiz.questions?.length}
                </p>
                <button
                  onClick={() => handleQuestionNavigation("next")}
                  className={`${
                    curQuestion < quiz.questions?.length - 1
                      ? " from-indigo-500 to-indigo-600 hover:from-indigo-500/90 hover:to-indigo-600/90"
                      : " from-gray-200 to-gray-300 text-zinc-700"
                  } w-12 xs:w-20 h-9 bg-gradient-to-r  rounded-sm cursor-pointer   transition`}
                >
                  Next
                </button>
              </div>
              <button
                onClick={handleFinishQuiz}
                className="w-36 cursor-pointer justify-self-center md:justify-self-end font-semibold self-end hover:from-green-400/90 hover:to-green-500/85 transition  shadow-md text-green-900 rounded-sm h-9 bg-gradient-to-r from-green-400 to-green-500  mr-2 mt-8"
              >
                Finish
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
