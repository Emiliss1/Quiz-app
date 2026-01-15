import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./components/main";
import Login from "./components/login";
import Register from "./components/register";
import Quizzes from "./components/quizzes";
import { AuthProvider } from "./components/context/authContext";
import Quiz from "./components/quiz";
import Settings from "./components/settings";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/" element={<Main />}></Route>
            <Route path="/quizzes" element={<Quizzes />}></Route>
            <Route path="/quiz/:id" element={<Quiz />}></Route>
            <Route path="/settings" element={<Settings />}></Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
