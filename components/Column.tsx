import { IExtendedColumn, ITask } from "@/types";
import React, { useState } from "react";
import ViewTask from "./Modals/Task/ViewTask";
import EditTask from "./Modals/Task/EditTask";
import DeleteTask from "./Modals/Task/DeleteTask";
import { Droppable, Draggable } from "@hello-pangea/dnd";

const colors = [
  "#49C4E5",
  "#8471F2",
  "#67E2AE",
  "#e5a449",
  "#2a3fdb",
  "#c36e6e",
];

function Column({
  name,
  tasks,
  _id,
  ballColorIndex,
  loadingTaskId,
}: IExtendedColumn) {
  const [modal, setModal] = useState({
    openViewTaskModal: false,
    openEditTaskModal: false,
    openDeleteTaskModal: false,
  });
  const [taskDetails, setTaskDetails] = useState<ITask>({
    _id: "",
    title: "",
    description: "",
    status: "",
    columnId: "",
    subtasks: [],
  });

  return (
    <div className="h-full">
      {modal.openViewTaskModal && (
        <ViewTask
          type="Edit"
          open={modal.openViewTaskModal}
          setOpen={() =>
            setModal((prev) => ({ ...prev, openViewTaskModal: false }))
          }
          taskDetails={taskDetails}
          setEditTaskModal={() =>
            setModal((prev) => ({ ...prev, openEditTaskModal: true }))
          }
          setDeleteTaskModal={() =>
            setModal((prev) => ({ ...prev, openDeleteTaskModal: true }))
          }
        />
      )}
      {modal.openEditTaskModal && (
        <EditTask
          type="Edit"
          open={modal.openEditTaskModal}
          setOpen={() =>
            setModal((prev) => ({ ...prev, openEditTaskModal: false }))
          }
          taskDetails={taskDetails}
        />
      )}
      {modal.openDeleteTaskModal && (
        <DeleteTask
          type="Task"
          open={modal.openDeleteTaskModal}
          setOpen={() =>
            setModal((prev) => ({ ...prev, openDeleteTaskModal: false }))
          }
          name={taskDetails?.title}
          _id={taskDetails?._id}
        />
      )}
      <div className="flex items-center gap-2 mb-7">
        <div
          className={`w-4 h-4 rounded-full`}
          style={{ backgroundColor: colors[ballColorIndex] || "#49C4E5" }}
        ></div>
        <h3 className="uppercase text-[#828fa3] text-xs tracking-[0.17em] tracking font-semibold">
          {name} ({tasks?.length})
        </h3>
      </div>
      <Droppable droppableId={_id}>
        {(provided, snapshot) => {
          // console.log("Droppable provided:", provided);
          return (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`flex flex-col gap-7 w-[17.5rem] h-auto min-h-[calc(100vh-96px)] ${
                tasks?.length === 0
                  ? "border-2 border-dashed border-[rgba(130,143,163,0.4)] rounded-md"
                  : ""
              } `}
            >
              {/* task card */}
              {tasks?.map((task, index) => (
                <Draggable
                  key={task._id}
                  draggableId={task._id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => {
                    // console.log('Draggable provided:', provided);
                    return (
                      <div
                        // key={task?.id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`card ${
                          loadingTaskId === task?._id ? "flashing" : ""
                        } w-full bg-[#2B2C37] border border-[#868686]/10 px-4 py-6 rounded-lg cursor-grab`}
                        onClick={() => (
                          setTaskDetails((prev) => ({
                            ...prev,
                            _id: task?._id,
                            title: task?.title,
                            description: task?.description,
                            columnId: task?.columnId,
                            subtasks: task?.subtasks,
                          })),
                          setModal((prev) => ({
                            ...prev,
                            openViewTaskModal: true,
                          }))
                        )}
                        // style={{
                        //   boxShadow: "0px 4px 6px rgba(54, 78, 126,0.101545)",
                        // }}
                        style={{
                          ...provided.draggableProps.style,
                          boxShadow: snapshot.isDragging
                            ? "0px 4px 6px rgba(54, 78, 126,0.101545)"
                            : "none",
                          transform: snapshot.isDragging
                            ? provided?.draggableProps?.style?.transform
                            : "none",
                          transition: snapshot.isDragging
                            ? provided?.draggableProps?.style?.transition
                            : "none",
                        }}
                      >
                        <h3
                          className="text-white text-[0.9rem] tracking-wider font-semibold text-ellipsis overflow-hidden"
                          style={{ wordBreak: "break-word" }}
                        >
                          {task?.title}
                        </h3>
                        <p className="text-[#828fa3] font-semibold text-xs mt-3">
                          {
                            task.subtasks.filter(
                              (subtask) => subtask.isCompleted
                            ).length
                          }{" "}
                          of {task?.subtasks?.length} subtasks
                        </p>
                      </div>
                    );
                  }}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
}

export default Column;
