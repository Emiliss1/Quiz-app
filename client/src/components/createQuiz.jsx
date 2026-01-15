import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { MdDelete } from "react-icons/md";
import { useAuth } from "./context/authContext";
import { AuthErr } from "./authErr";

export function CreateQuiz() {
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [answerErr, setAnswerErr] = useState("");
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [questionTitle, setQuestionTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionErr, setQuestionErr] = useState("");
  const [questionsErr, setQuestionsErr] = useState("");
  const [quizMsg, setQuizMsg] = useState("");

  const maxAnswers = 4;
  const minAnswers = 1;
  const maxQuestions = 30;
  const minQuestions = 1;

  const token = Cookies.get("token");
  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { authErr, handleAuthErr } = useAuth();

  const handleAddAnswer = (e) => {
    e.preventDefault();
    if (answer.trim(" ") && answers.length < maxAnswers) {
      const answerData = {
        answer,
        isCorrect,
      };
      setAnswers((prev) => [answerData, ...prev]);
      setAnswer("");
      setIsCorrect(false);
      console.log("answers", answers);
      setAnswerErr("");
    }
    if (!answer.trim(" ")) {
      setAnswerErr("You can't leave answer blank");
    }
    if (answers.length === maxAnswers) {
      setAnswerErr(`You can't add more than ${maxAnswers} answers`);
    }
  };

  const handleAddQuestion = () => {
    if (
      questionTitle.trim(" ") &&
      questions.length < maxQuestions &&
      answers.length >= minAnswers
    ) {
      const question = {
        question: questionTitle,
        answers,
      };
      setQuestions((prev) => [question, ...prev]);
      setAnswers([]);
      setQuestionTitle("");
      setQuestionErr("");
      console.log(questions);
    }
    if (!questionTitle.trim(" ")) {
      setQuestionErr("Question field can't be blank");
    }
    if (questions.length === maxQuestions) {
      setQuestionErr(`The max number of questions is ${maxQuestions}`);
    }
    if (answers.length < minAnswers) {
      setQuestionErr(`You should have atleast ${minAnswers} answers`);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    const quiz = {
      title,
      difficulty,
      questions,
    };
    if (questions.length >= minQuestions) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_DB_URL}/quiz/create`,
          quiz,
          tokenHeader
        );
        if (response) {
          setTitle("");
          setDifficulty("easy");
          setQuestions([]);
          setAnswers([]);
          console.log("quiz", quiz);
          setQuestionsErr("");

          setQuizMsg(
            "Succesfully created quiz you wil redirected in a few seconds"
          );

          const redirectTime = 3;

          setTimeout(() => {
            window.location.reload();
          }, 1000 * redirectTime);
        }
      } catch (err) {
        console.log(err);
        if (err.status === "401") {
          handleAuthErr(true);
        }
        setQuestionsErr(err.response.data.message);
      }
    } else {
      setQuestionsErr(
        `Your quiz should have atleast ${minQuestions} questions`
      );
    }
  };

  const handleRemoveAnswer = (index) => {
    const newAnswers = answers.filter((ans, i) => i !== index);

    if (!newAnswers) return;

    setAnswers(newAnswers);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);

    if (!newQuestions) return;

    setQuestions(newQuestions);
  };

  return (
    <div>
      {authErr ? (
        <AuthErr />
      ) : (
        <div>
          <h1 className="text-center text-2xl font-medium text-zinc-800 border-b border-zinc-200 w-11/12 mx-auto">
            Create quiz
          </h1>
          <form
            onSubmit={handleCreateQuiz}
            className="w-11/12 mx-auto text-zinc-7-- flex flex-col mt-4 text-lg"
          >
            <div className="flex flex-col justify-center px-4 gap-2 bg-white border border-zinc-200 rounded-xl py-4 shadow-sm ">
              <label className="font-medium">Title</label>
              <input
                className="bg-white border px-2 py-1 border-zinc-400 focus:outline focus:outline-indigo-500 w-11/12 xs:w-58 rounded-lg"
                type="text"
                placeholder="Set title"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
              />
              <label className="mt-2 font-medium">Difficulty</label>
              <select
                onChange={(e) => setDifficulty(e.target.value)}
                value={difficulty}
                className="w-32 bg-white border rounded-lg py-1 focus:outline focus:outline-indigo-500 border-zinc-400"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="mt-4 flex flex-col text-zinc-700 justify-center bg-white border border-zinc-200 shadow-sm rounded-xl px-4 py-4">
              <label className="mt-2 font-medium">
                Question (max {`${maxQuestions}`} questions)
              </label>
              <textarea
                className="bg-white border px-2 focus:outline focus:outline-indigo-500 border-zinc-400 shadow-sm w-11/12 md:w-120 max-h-28  rounded-sm"
                maxLength={200}
                type="text"
                value={questionTitle}
                placeholder="Set question"
                onChange={(e) => setQuestionTitle(e.target.value)}
              >
                {questionTitle}
              </textarea>
              <label className="mt-2 font-medium">
                Answer (max {`${maxAnswers}`} answers){" "}
              </label>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <input
                  className="bg-white border px-2 focus:outline py-1 focus:outline-indigo-500 border-zinc-400 w-11/12 xs:w-58 rounded-sm"
                  type="text"
                  placeholder="Set answer"
                  onChange={(e) => setAnswer(e.target.value)}
                  value={answer}
                />
                <div className="flex  items-center gap-2">
                  <label className="text-base">Correct answer</label>
                  <input
                    onChange={(e) => setIsCorrect(e.target.checked)}
                    className="w-6 h-6 accent-green-400"
                    checked={isCorrect}
                    type="checkbox"
                  />
                  <button
                    type="button"
                    onClick={handleAddAnswer}
                    className="w-24 h-8 bg-green-500/90 rounded-sm text-white font-medium shadow-sm hover:bg-green-500 transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
              {answerErr && (
                <div className="w-full mt-2 bg-red-100 text-red-700 rounded-lg px-3 py-2 border border-red-300 text-sm">
                  <p>{answerErr}</p>
                </div>
              )}
              <h1 className="mt-2 w-10/12 mx-auto text-center font-medium border-b">
                Answers
              </h1>
              <div className="flex w-10/12 mx-auto py-2 gap-2 flex-col">
                {answers.length > 0 &&
                  answers.map((ans, index) => (
                    <div
                      className="flex justify-around rounded-lg border border-zinc-200 px-2 py-2 items-center bg-gray-100/50"
                      key={index}
                    >
                      <p className="w-10/12 break-all">{ans.answer}</p>
                      <input
                        type="checkbox"
                        checked={ans.isCorrect}
                        readOnly
                        className="w-6 h-6 accent-green-400"
                      />
                      <button
                        onClick={() => handleRemoveAnswer(index)}
                        className="flex justify-center items-center bg-red-400 w-8 rounded-sm h-8 cursor-pointer hover:bg-red-500/80 ml-4"
                      >
                        <MdDelete className="text-xl text-gray-100" />
                      </button>
                    </div>
                  ))}
              </div>

              <div className="w-10/12 mx-auto flex flex-col items-center gap-4 border-t-1 py-1 border-zinc-800 justify-center">
                {questionErr && (
                  <div className="w-max px-1 max-w-78 h-9 bg-red-400 text-red-700 flex items-center justify-center rounded-sm border-2 mt-2 border-red-500">
                    <p>{questionErr}</p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="w-full  mt-2 px-1  h-9 bg-indigo-500 rounded-lg text-white shadow-sm hover:bg-indigo-600/90 transition font-medium cursor-pointer"
                >
                  Add question
                </button>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm mt-4">
              <h1 className="mt-4 w-10/12 mx-auto text-center border-b">
                Questions
              </h1>
              <div className="flex flex-col w-10/12 mx-auto mt-2 mb-2 border-b pb-2 items-center gap-2">
                {questions.length > 0 &&
                  questions.map((item, index) => (
                    <div
                      className="w-10/12 border border-zinc-200 rounded-xl py-2 rounded-sm px-4 bg-gray-100/50"
                      key={index}
                    >
                      <div className="grid grid-cols-1 xs:grid-cols-3">
                        <p className="text-center font-semibold col-start-1 xs:col-start-2 mx-auto">
                          Question:
                        </p>
                        <button
                          onClick={() => handleRemoveQuestion(index)}
                          className="flex justify-self-center xs:justify-self-end justify-center items-center bg-red-400 w-8 rounded-sm h-8 cursor-pointer hover:bg-red-500/80 "
                        >
                          <MdDelete className="text-xl text-gray-100" />
                        </button>
                      </div>
                      <p className="bg-white border break-all border-zinc-200 mx-auto mt-2 px-1 rounded-lg mb-2">
                        {item.question}
                      </p>
                      <p className="text-center font-semibold">Answers:</p>
                      <div className="flex flex-col gap-2">
                        {item.answers.length > 0 &&
                          item.answers.map((ans, index) => (
                            <div
                              className="flex items-center gap-2 bg-white border border-zinc-200 rounded-md  px-2"
                              key={index}
                            >
                              <p className="break-all w-11/12">{ans.answer}</p>
                              <input
                                type="checkbox"
                                readOnly
                                className="w-6 h-6 accent-green-400"
                                checked={ans.isCorrect}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="w-full bg-white border border-zinc-200 shadow-sm rounded-xl p-4 mx-auto mt-2 flex flex-col items-center gap-4  justify-center">
              {questionsErr && (
                <div className="-full bg-red-100 text-red-700 rounded-lg px-3 py-2 border border-red-300 text-sm">
                  <p>{questionsErr}</p>
                </div>
              )}
              {quizMsg && (
                <div className="w-full bg-green-100 text-green-700 rounded-lg px-3 py-2 border border-green-300 text-sm">
                  <p>{quizMsg}</p>
                </div>
              )}
              <button
                type="submit"
                className="w-full px-1  h-10 bg-green-500/90 rounded-lg shadow-sm text-white hover:bg-green-500 transition font-medium cursor-pointer"
              >
                Create quiz
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
