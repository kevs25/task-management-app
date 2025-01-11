//this file hsndles switching between task views and logout option

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import tasks from "../assets/task.svg";
import logout_icon from "../assets/logout_icon.svg";
import list_icon from "../assets/list_icon.svg";
import board_icon from "../assets/board_icon.svg";
import ListViewTasks from "./ListView/ListViewTasks";
import BoardViewTasks from "./BoardView/BoardViewTasks";
import { logout } from "../FireBaseConfig";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Mulish', sans-serif;
    padding : 1rem
  }
`;

export interface Props {
  username: string;
  profilePhoto: string;
}

export default function NavBar(props: Props) {
  const navigate = useNavigate();

  const [view, setView] = useState<"list" | "board">("list");

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("user");
    navigate("/"); // Navigate back to login
  };

  return (
    <>
      <GlobalStyle />
      <div className="flex flex-wrap justify-between p-2">
        <h1 className="text-2xl font-semibold text-gray-950 flex items-center mb-4">
          <span className="mr-2">
            <img
              src={tasks}
              alt="task icon"
              style={{ filter: "brightness(0)" }}
            />
          </span>
          TaskBuddy
        </h1>

        {/* Desktop Profile Section */}
        <div className="hidden sm:inline-block">
          <div className="flex flex-col">
            <div className="flex flex-row gap-2">
              <img
                className="w-10 h-10 rounded-full"
                src={props.profilePhoto}
                alt="profile"
              />
              <p className="mt-1">{props.username}</p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center px-4 py-2 mt-2 bg-gray-100 text-black rounded-md"
            >
              <img
                src={logout_icon}
                className="w-5 h-5 mr-3"
                alt="logout icon"
              />
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Profile Section */}
        <div className="hidden max-sm:inline-block">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center text-black rounded-md"
          >
            <img
              className="w-10 h-10 rounded-full"
              src={props.profilePhoto}
              alt="profile"
            />
          </button>
        </div>
      </div>

      <div className="hidden md:inline-block">
        <div className="flex gap-4 p-4">
          <button
            className={`flex items-center justify-center px-4 py-2 mt-2 text-black  ${
              view === "list" ? "border-b-2 border-black" : ""
            }`}
            onClick={() => setView("list")}
          >
            <img className="mr-3" src={list_icon} alt="list-icon" />
            List View
          </button>
          <button
            className={`flex items-center justify-center px-4 py-2 mt-2 text-black ${
              view === "board" ? "border-b-2 border-black" : ""
            }`}
            onClick={() => setView("board")}
          >
            <img className="mr-3" src={board_icon} alt="board-icon" />
            Board View
          </button>
        </div>
      </div>

      <div className="p-4 max-md:p-1">
        {view === "list" ? (
          // List View
          <ListViewTasks />
        ) : (
          // Board View
          <BoardViewTasks />
        )}
      </div>
    </>
  );
}
