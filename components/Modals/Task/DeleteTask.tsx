import useData from "@/hooks/useData";
import axiosInstance from "@/http/axiosInstance";
import { ITaskDelete } from "@/types";
import { getSession } from "next-auth/react";
import React, { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";

function DeleteTask({ open, setOpen, name, type, _id }: ITaskDelete) {
  const [isLoading, setIsLoading] = useState(false);
  const { refetch } = useData("kanban-boards", "/boards");

  async function handleDelete() {
    const session = await getSession();
    const token = session?.user?.token;
    setIsLoading(true);
    try {
      await axiosInstance.delete(
        type === "Board" ? `/boards/${_id}` : `/tasks/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLoading(false);
      refetch();
      toast(
        type === "Board"
          ? "Board was deleted succesfully!"
          : "Task was deleted successfully",
        {
          type: "success",
        }
      );
      setOpen(false);
    } catch (e: any) {
      setIsLoading(false);
      toast(e?.response?.data?.msg ? e?.response?.data?.msg : e?.message, {
        type: "error",
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
        <div className="mb-6">
          <h3 className="text-[#EA5555] mb-4 font-bold">
            Delete this {type === "Board" ? "board" : "task"}?
          </h3>
          <p className="text-[0.8125rem] text-[#828fa3] font-medium leading-[23px]">
            Are you sure you want to delete the{" "}
            {type === "Board" ? "board" : "task"} &apos;{name}
            &apos;? This action will remove all existing{" "}
            {type === "Board" ? "columns and tasks" : "subtasks"} and it cannot
            be reversed.
          </p>
        </div>
        <div className="mb-8 grid grid-cols-2 gap-4">
          <button
            onClick={handleDelete}
            className="bg-[#EA5555] text-white rounded-3xl hover:opacity-60 py-2 transition-all duration-[0.2s] ease-in-out font-bold text-[0.9rem]"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Delete"}
          </button>
          <button
            className="bg-[#f0effa] text-[#635FC7] rounded-3xl hover:opacity-60 py-2 transition-all duration-[0.2s] ease-in-out font-bold text-[0.9rem]"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteTask;
