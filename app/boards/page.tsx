"use client";
import Column from "@/components/Column";
import Layout from "@/components/Layout";
import EditBoard from "@/components/Modals/Board/EditBoard";
import useBoards from "@/hooks/useBoards";
import { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import axiosInstance from "@/http/axiosInstance";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import useData from "@/hooks/useData";

export default function Boards() {
  const [openNewColumnModal, setOpenNewColumnModal] = useState(false);
  const [loadingTaskId, setLoadingTaskId] = useState("");
  const { boards, activeTab } = useBoards();
  const [board, setBoard] = useState(
    boards?.find((board) => board._id === activeTab)
  );

  const { refetch } = useData("kanban-boards", "/boards");

  useEffect(() => {
    setBoard(boards?.find((board) => board._id === activeTab));
  }, [boards, activeTab]);

  async function handleDragEnd(result: any) {
    const { source, destination } = result;

    // if board doesn't exist, do nothing
    if (!board) return;

    // If there's no destination (dropped outside any droppable), do nothing
    if (!destination) return;

    // If the task is dropped in the same place, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find the source and destination columns
    const sourceColumn = board.columns.find(
      (column) => column._id.toString() === source.droppableId
    );
    const destinationColumn = board.columns.find(
      (column) => column._id.toString() === destination.droppableId
    );

    if (!sourceColumn) return;

    // Get the task being dragged
    const [movedTask] = sourceColumn.tasks.splice(source.index, 1);

    // Add the task to the destination column
    destinationColumn?.tasks.splice(destination.index, 0, movedTask);

    // Update the board state
    setBoard({
      ...board,
      columns: board.columns.map((column) => {
        if (column._id === sourceColumn?._id) {
          return sourceColumn;
        } else if (column._id === destinationColumn?._id) {
          return destinationColumn;
        }
        return column;
      }),
    });

    // Make API request to update task column
    const taskId = movedTask._id;
    const newColumnId = destinationColumn?._id;
    const session = await getSession();
    const token = session?.user?.token;

    setLoadingTaskId(taskId);

    try {
      await axiosInstance.patch(
        `/tasks/${taskId}/status`,
        {
          columnId: newColumnId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoadingTaskId("");
      refetch();
      toast("Task's column was successfully updated", {
        type: "success",
        theme: "dark",
      });
    } catch (e: any) {
      setLoadingTaskId("");
      refetch();
      toast(e?.response?.data?.msg ? e?.response?.data?.msg : e?.message, {
        type: "error",
        theme: "dark",
      });
    }
  }

  return (
    <Layout>
      {openNewColumnModal && (
        <EditBoard
          type="Column"
          open={openNewColumnModal}
          setOpen={setOpenNewColumnModal}
        />
      )}
      <div className={`flex items-start gap-10`}>
        <DragDropContext onDragEnd={handleDragEnd}>
          {board?.columns?.map((column, index) => (
            <Column
              key={column?._id}
              _id={column?._id}
              name={column?.name}
              tasks={column?.tasks}
              ballColorIndex={index}
              loadingTaskId={loadingTaskId}
            />
          ))}
        </DragDropContext>
        {board && board?.columns?.length < 6 && (
          <div
            onClick={() => setOpenNewColumnModal(true)}
            className="shrink-0 w-[17.5rem] h-auto min-h-[calc(100vh-96px)] mt-11 flex items-center justify-center font-bold text-2xl text-[#828fa3] hover:text-[#635FC7] rounded-md transition-colors duration-[0.2s] ease-in-out cursor-pointer"
            style={{
              background:
                "linear-gradient(to bottom, rgba(121, 132, 147, 0.2),rgba(130,143,163,0.1), rgba(130,143,163,0))",
            }}
          >
            + New Column
          </div>
        )}
      </div>
    </Layout>
  );
}
