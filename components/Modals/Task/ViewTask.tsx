import useBoards from "@/hooks/useBoards";
import useData from "@/hooks/useData";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import axiosInstance from "@/http/axiosInstance";
import { ITaskEdit } from "@/types";
import { getSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";

function ViewTask({
  open,
  setOpen,
  taskDetails,
  setEditTaskModal,
  setDeleteTaskModal,
}: ITaskEdit) {
  const [subtasks, setSubtasks] = useState(taskDetails?.subtasks);
  const [status, setStatus] = useState(taskDetails?.columnId);
  const [openStatusDropdown, setOpenStatusDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { boards, activeTab } = useBoards();
  const targetBoard = boards?.find((board) => board._id === activeTab) || {
    _id: "",
    name: "",
    columns: [],
  };

  const { refetch } = useData("kanban-boards", "/boards");

  const {
    ref: dropDownRef,
    buttonRef,
    isComponentVisible: openDropdown,
    setIsComponentVisible: setOpenDropdown,
  } = useOnClickOutside();

  function handleCheck(subtitle: string) {
    const subtaskIndex = subtasks?.findIndex((s) => s?.title === subtitle);
    if (subtaskIndex === -1) return; // Subtask not found

    const updatedSubtasks = [...subtasks]; // Create a copy of the original array

    // Toggle the completion status of the subtask
    updatedSubtasks[subtaskIndex].isCompleted =
      !updatedSubtasks[subtaskIndex].isCompleted;

    setSubtasks(updatedSubtasks);
  }

  async function handleEditTask() {
    const session = await getSession();
    const token = session?.user?.token;
    setIsLoading(true);
    try {
      await axiosInstance.patch(
        `/tasks/${taskDetails._id}`,
        {
          title: taskDetails?.title,
          ...(taskDetails?.description && {
            description: taskDetails?.description,
          }),
          columnId: status,
          subtasks: subtasks?.map((subtask) => {
            return {
              id: subtask?._id,
              title: subtask?.title,
              isCompleted: subtask?.isCompleted,
            };
          }),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLoading(false);
      refetch();
      toast("Task was updated successfully!", {
        type: "success",
        theme: "dark",
      });
      setOpen(false);
    } catch (e: any) {
      setIsLoading(false);
      toast(e?.response?.data?.msg ? e?.response?.data?.msg : e?.message, {
        type: "error",
        theme: "dark",
      });
    }
  }

  return (
    <Modal
      appElement={document.getElementById("root") || undefined}
      isOpen={open}
      className="modal"
      overlayClassName="backdrop"
      onRequestClose={() => setOpen(false)}
      shouldCloseOnOverlayClick={true}
    >
      <div className="w-full">
        {/* mobile close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute flex justify-end md:hidden right-3 top-3"
        >
          <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
            <g fill="#828FA3" fillRule="evenodd">
              <path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z" />
              <path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z" />
            </g>
          </svg>
        </button>
        {/* title and dropdown */}
        <div className="mt-4 md:mt-0 flex items-start justify-between gap-4">
          <h2 className="font-bold text-lg">{taskDetails?.title}</h2>
          <div
            ref={buttonRef}
            className="shrink-0 cursor-pointer bg-transparent hover:bg-[#20212C] p-2 rounded-xl transition-colors duration-[0.2s] ease-in-out"
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
              className="absolute bg-[#20212C] w-52 px-5 py-4 -right-16 top-20 rounded-lg fadeIn flex flex-col gap-2"
              style={{
                boxShadow: "0 0 8px rgba(54, 78, 126,0.101545)",
              }}
            >
              <div
                className="text-[#828fa3] transition-opacity duration-[0.2s] ease-in-out cursor-pointer hover:opacity-[0.6]"
                onClick={() => (
                  setEditTaskModal && setEditTaskModal(true), setOpen(false)
                )}
              >
                Edit Task
              </div>
              <div
                className="text-[#EA5555] transition-opacity duration-[0.2s] ease-in-out cursor-pointer hover:opacity-[0.6]"
                onClick={() => (
                  setDeleteTaskModal && setDeleteTaskModal(true), setOpen(false)
                )}
              >
                Delete Task
              </div>
            </div>
          )}
        </div>
        {/* description */}
        <p
          className="viewTaskDesc text-sm text-[#828fa3] leading-6 max-h-40 overflow-x-hidden overflow-y-auto mt-3"
          style={{ wordBreak: "break-word" }}
        >
          {taskDetails?.description
            ? taskDetails?.description
            : "No description"}
        </p>
        {/* subtasks */}
        <div className="mt-5 flex flex-col gap-3">
          <div className="text-xs font-bold">
            Subtasks (
            {
              taskDetails?.subtasks?.filter((subtask) => subtask?.isCompleted)
                .length
            }{" "}
            of {taskDetails?.subtasks?.length})
          </div>
          {subtasks?.length > 0 ? (
            subtasks?.map((subtask, index) => (
              <label
                key={index}
                className={`checkbox ${
                  subtask?.isCompleted ? "checked" : ""
                } flex items-center p-3 bg-[#20212C] hover:bg-[rgba(99,95,199,0.25)] rounded-lg text-xs font-bold cursor-pointer`}
              >
                <input
                  type="checkbox"
                  checked={subtask?.isCompleted}
                  onChange={() => handleCheck(subtask?.title)}
                />
                {subtask?.title}
              </label>
            ))
          ) : (
            <div className="text-[0.8125rem] text-[#828fa3]">No subtasks.</div>
          )}
        </div>
        {/* status */}
        <div className="mt-5">
          <p className="text-xs font-bold">Current Status</p>
          <div className="relative">
            <button
              className="w-full flex items-center justify-between py-2 px-[1rem] rounded text-xs font-bold mt-3 border-2 border-[rgba(130,143,163,0.4)] text-white capitalize transition duration-[0.2s] ease-in-out focus:outline-none focus:border-[#635FC7] cursor-pointer"
              onClick={() => setOpenStatusDropdown((prev) => !prev)}
            >
              <span className="text-nowrap text-ellipsis overflow-hidden mr-4">
                {
                  boards[0]?.columns?.find((column) => column?._id === status)
                    ?.name
                }
              </span>
              <span
                className="transition-transform duration-[0.3s] ease-in-out"
                style={
                  openStatusDropdown ? { transform: "rotate(180deg)" } : {}
                }
              >
                <svg width="10" height="7" xmlns="http://www.w3.org/2000/svg">
                  <path
                    stroke="#635FC7"
                    strokeWidth="2"
                    fill="none"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </span>
            </button>
            {openStatusDropdown && (
              <div
                className="selectWrapper absolute top-0 bottom-0 flex flex-col gap-2 items-start h-fit w-full rounded-[4px] p-4 bg-[#20212C] whitespace-nowrap text-ellipsis overflow-hidden border border-[#20212C]"
                style={{
                  transform: "translateY(3rem)",
                  boxShadow: "0 0 8px rgba(54, 78, 126,0.101545)",
                }}
              >
                {targetBoard?.columns?.map((column) => (
                  <div
                    className="whitespace-nowrap text-ellipsis overflow-hidden cursor-pointer font-medium text-[#828fa3] text-[0.8125rem] hover:font-bold hover:text-white capitalize transition-all duration-[0.2s] ease-in-out w-full"
                    onClick={() => (
                      setStatus(column?._id), setOpenStatusDropdown(false)
                    )}
                  >
                    {column?.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* button */}
        <button
          onClick={handleEditTask}
          type="submit"
          className="mb-8 text-[0.8125rem] w-full h-10 rounded-3xl text-[#fff] hover:opacity-90 font-bold bg-[#635FC7] hover:bg-[#A8A4FF] transition-all duration-[0.2s] ease-in-out"
          style={{ marginTop: "1rem" }}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Save Changes"}
        </button>
      </div>
    </Modal>
  );
}

export default ViewTask;
