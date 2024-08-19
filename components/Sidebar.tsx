"use client";

import useBoards from "@/hooks/useBoards";
import React, { useEffect, useState } from "react";
import EditBoard from "./Modals/Board/EditBoard";
import { signOut, useSession } from "next-auth/react";

function Sidebar({
  hideSideNav,
  setHideSideNav,
}: {
  hideSideNav: boolean;
  setHideSideNav: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [openNewBoardModal, setOpenNewBoardModal] = useState(false);
  const { boards, activeTab, handleTabClick } = useBoards();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (boards && boards.length !== 0) {
      const board = boards?.find((board) => board._id === activeTab);
      if (board) {
        return;
      } else {
        handleTabClick(boards[0]?._id)
      }
    }
  }, [boards, activeTab]);

  return (
    <div
      className={`hidden lg:flex flex-col justify-between fixed top-0 bottom-0 left-0 w-72 mt-24 bg-[#2B2C37] border-r border-r-[#3E3F4E] pt-4 pb-8 z-10 overflow-y-auto transition-transform duration-[0.2s] ease-in-out`}
      style={
        hideSideNav
          ? {
              transform: "translateX(-100%)",
            }
          : {}
      }
    >
      {openNewBoardModal && (
        <EditBoard
          type="Create"
          open={openNewBoardModal}
          setOpen={setOpenNewBoardModal}
        />
      )}
      <div>
        <h2 className="px-8 text-[#828fa3] font-semibold text-sm">
          ALL BOARDS <span>({boards?.length})</span>
        </h2>
        {/* boards */}
        <div className="flex flex-col gap-2 mt-5 pr-6">
          {/* board tabs */}
          {boards?.map((board) => (
            <div
              key={board?._id}
              className={`flex items-center gap-4 px-8 hover:bg-[#A8A4FF] hover:text-white ${
                activeTab === board?._id
                  ? "text-white px-8 bg-[#635FC7] hover:bg-[#A8A4FF]"
                  : "text-[#828fa3]"
              } transition-colors duration-[0.2s] ease-in-out py-2 rounded-r-3xl cursor-pointer`}
              onClick={() => handleTabClick(board?._id)}
            >
              <div>
                <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
                    fill={"currentColor"}
                  />
                </svg>
              </div>
              <h3 className="font-semibold tracking-wide">{board?.name}</h3>
            </div>
          ))}
        </div>
        {/* create new board */}
        <div
          onClick={() => setOpenNewBoardModal(true)}
          className="px-8 mt-5 flex items-center gap-4 cursor-pointer hover:opacity-[0.6] transition-opacity duration-[0.2s] ease-in-out"
        >
          <div>
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
                fill={"#635FC7"}
              />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#635FC7"
                  d="M7.368 12V7.344H12V4.632H7.368V0H4.656v4.632H0v2.712h4.656V12z"
                />
              </svg>
            </div>
            <h3 className="text-[#635FC7] font-semibold">Create New Board</h3>
          </div>
        </div>
      </div>
      <div className="space-y-5">
        {/* user name and logout */}
        <div className="bg-[#20212c] font-bold rounded-md px-3 py-2 mx-8 flex flex-col gap-1 text-[0.9375rem] text-center">
          <div className="text-[#635FC7]">
            {status === "loading"
              ? "Loading.."
              : // @ts-expect-error
                `${session?.user.firstName} ${session?.user.lastName}`}
          </div>
          <div
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-[#828fa3] cursor-pointer hover:opacity-60 transition-opacity duration-[0.1s] ease-out"
          >
            Logout
          </div>
        </div>
        {/* hide sidebar */}
        <div
          onClick={() => setHideSideNav(true)}
          className="flex items-center gap-3 px-8 text-[0.9375rem] text-[#828fa3] font-bold hover:opacity-60 transition-opacity duration-[0.1s] ease-out cursor-pointer"
        >
          <span>
            <svg
              style={{ marginRight: "15px" }}
              width="18"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.522 11.223a4.252 4.252 0 0 1-3.654-5.22l3.654 5.22ZM9 12.25A8.685 8.685 0 0 1 1.5 8a8.612 8.612 0 0 1 2.76-2.864l-.86-1.23A10.112 10.112 0 0 0 .208 7.238a1.5 1.5 0 0 0 0 1.524A10.187 10.187 0 0 0 9 13.75c.414 0 .828-.025 1.239-.074l-1-1.43A8.88 8.88 0 0 1 9 12.25Zm8.792-3.488a10.14 10.14 0 0 1-4.486 4.046l1.504 2.148a.375.375 0 0 1-.092.523l-.648.453a.375.375 0 0 1-.523-.092L3.19 1.044A.375.375 0 0 1 3.282.52L3.93.068a.375.375 0 0 1 .523.092l1.735 2.479A10.308 10.308 0 0 1 9 2.25c3.746 0 7.031 2 8.792 4.988a1.5 1.5 0 0 1 0 1.524ZM16.5 8a8.674 8.674 0 0 0-6.755-4.219A1.75 1.75 0 1 0 12.75 5v-.001a4.25 4.25 0 0 1-1.154 5.366l.834 1.192A8.641 8.641 0 0 0 16.5 8Z"
                fill={"currentColor"}
              />
            </svg>
          </span>
          <span>Hide Sidebar</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
