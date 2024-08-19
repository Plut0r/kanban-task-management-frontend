import useBoards from "@/hooks/useBoards";
import { IModal } from "@/types";
import { signOut } from "next-auth/react";
import React, { useState } from "react";
import EditBoard from "./Modals/Board/EditBoard";

function MobileSidebar({ open, setOpen }: IModal) {
  const [openNewBoardModal, setOpenNewBoardModal] = useState(false);
  const { boards, activeTab, handleTabClick } = useBoards();
  return (
    <div
      className={`flex lg:hidden w-[200px] backdrop h-screen fixed top-0 ${
        open ? "left-0" : "-left-[100%]"
      }`}
    >
      {openNewBoardModal && (
        <EditBoard
          type="Create"
          open={openNewBoardModal}
          setOpen={setOpenNewBoardModal}
        />
      )}
      <div className="bg-[#2B2C37] flex flex-col justify-between">
        <div>
          <button
            onClick={() => setOpen(false)}
            className="uppercase py-4 pr-4 flex items-center justify-end w-full text-[#828fa3]"
          >
            <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
              <g fill="#828FA3" fillRule="evenodd">
                <path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z" />
                <path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z" />
              </g>
            </svg>
          </button>
          <div className="mt-2">
            <h2 className="px-8 text-[#828fa3] font-semibold text-sm">
              ALL BOARDS <span>({boards.length})</span>
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
                    <svg
                      width="16"
                      height="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
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
                  <svg
                    width="12"
                    height="12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#635FC7"
                      d="M7.368 12V7.344H12V4.632H7.368V0H4.656v4.632H0v2.712h4.656V12z"
                    />
                  </svg>
                </div>
                <h3 className="text-[#635FC7] font-semibold">
                  Create New Board
                </h3>
              </div>
            </div>
          </div>
        </div>
        {/* user name and logout */}
        <div className="bg-[#20212c] font-bold rounded-md px-3 py-2 mx-8 my-4 flex flex-col gap-1 text-[0.9375rem] text-center">
          <div className="text-[#635FC7]">Zainab Ogunola</div>
          <div
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-[#828fa3] cursor-pointer hover:opacity-60 transition-opacity duration-[0.1s] ease-out"
          >
            Logout
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileSidebar;
