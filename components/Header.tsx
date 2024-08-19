"use client";

import useBoards from "@/hooks/useBoards";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import Image from "next/image";
import React, { useState } from "react";
import EditTask from "./Modals/Task/EditTask";
import EditBoard from "./Modals/Board/EditBoard";
import DeleteTask from "./Modals/Task/DeleteTask";

function Header({
  setShowMobileSideNav,
}: {
  setShowMobileSideNav: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { boards, activeTab } = useBoards();
  const [modal, setModal] = useState({
    openNewTaskModal: false,
    openEditBoardModal: false,
    openDeleteBoardModal: false,
  });

  const {
    ref: dropDownRef,
    buttonRef,
    isComponentVisible: openDropdown,
    setIsComponentVisible: setOpenDropdown,
  } = useOnClickOutside();

  const board = boards?.find((board) => board._id === activeTab);

  return (
    <div className="fixed top-0 w-full h-24 bg-[#2B2C37] border-b border-b-[#3E3F4E] flex items-center z-10">
      {modal.openNewTaskModal && (
        <EditTask
          type="Create"
          open={modal.openNewTaskModal}
          setOpen={() =>
            setModal((prev) => ({ ...prev, openNewTaskModal: false }))
          }
        />
      )}
      {modal.openEditBoardModal && (
        <EditBoard
          type="Edit"
          open={modal.openEditBoardModal}
          setOpen={() =>
            setModal((prev) => ({ ...prev, openEditBoardModal: false }))
          }
        />
      )}
      {modal.openDeleteBoardModal && (
        <DeleteTask
          type="Board"
          open={modal.openDeleteBoardModal}
          setOpen={() =>
            setModal((prev) => ({ ...prev, openDeleteBoardModal: false }))
          }
          _id={board ? board?._id : ""}
          name={board ? board?.name : "N/A"}
        />
      )}
      <div className="md:border-r md:border-r-[#3E3F4E] pl-8 md:w-60 lg:w-72 h-full flex items-center shrink-0">
        {/* tablet and desktop logo */}
        <div className="hidden md:flex shrink-0 w-full cursor-pointer">
          <Image
            src={"/images/logo-light.svg"}
            alt="logo"
            width={150}
            height={150}
          />
        </div>
        {/* mobile logo */}
        <div
          onClick={() => setShowMobileSideNav(true)}
          className="md:hidden shrink-0 w-full cursor-pointer"
          style={{ transform: "rotate(90deg)" }}
        >
          <svg width="24" height="25" xmlns="http://www.w3.org/2000/svg">
            <g fill="#635FC7" fill-rule="evenodd">
              <rect width="6" height="25" rx="2" />
              <rect opacity=".75" x="9" width="6" height="25" rx="2" />
              <rect opacity=".5" x="18" width="6" height="25" rx="2" />
            </g>
          </svg>
        </div>
      </div>
      <div className="px-5 md:px-8 lg:px-10 flex items-center justify-between w-full">
        <h1 className="text-lg md:text-2xl text-white font-semibold tracking-wider">
          {board ? board?.name : "No Board Found"}
        </h1>
        <div className="flex items-center gap-6 relative">
          <button
            onClick={() =>
              setModal((prev) => ({ ...prev, openNewTaskModal: true }))
            }
            className="bg-[#635FC7] hover:bg-[#A8A4FF] transition-colors duration-[0.2s] ease-in-out text-white text-base px-4 py-3 rounded-3xl font-semibold flex items-center gap-2"
          >
            <span>
              <Image
                src={"/images/icon-add-task-mobile.svg"}
                alt="add-icon"
                width={10}
                height={10}
              />
            </span>
            <span className="hidden lg:flex">Add new task</span>
          </button>
          <div
            ref={buttonRef}
            className="cursor-pointer bg-transparent hover:bg-[#20212C] p-2 rounded-xl transition-colors duration-[0.2s] ease-in-out"
            onClick={() => setOpenDropdown((prev) => !prev)}
          >
            <Image
              src={"/images/icon-vertical-ellipsis.svg"}
              alt="verical-ellipsis"
              width={5}
              height={5}
            />
          </div>
          {openDropdown && (
            <div
              ref={dropDownRef}
              className="shrink-0 absolute bg-[#20212C] w-52 px-5 py-4 right-0 top-14 rounded-lg fadeIn flex flex-col gap-2"
              style={{
                boxShadow: "0 0 8px rgba(54, 78, 126,0.101545)",
              }}
            >
              <div
                onClick={() => (
                  setModal((prev) => ({ ...prev, openEditBoardModal: true })),
                  setOpenDropdown(false)
                )}
                className="text-[#828fa3] transition-opacity duration-[0.2s] ease-in-out cursor-pointer hover:opacity-[0.6]"
              >
                Edit Board
              </div>
              <div
                onClick={() => (
                  setModal((prev) => ({ ...prev, openDeleteBoardModal: true })),
                  setOpenDropdown(false)
                )}
                className="text-[#EA5555] transition-opacity duration-[0.2s] ease-in-out cursor-pointer hover:opacity-[0.6]"
              >
                Delete Board
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
