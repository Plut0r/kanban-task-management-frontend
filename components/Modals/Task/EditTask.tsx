import { ISubTask, ITask, ITaskAction } from "@/types";
import React, { useState } from "react";
import Modal from "react-modal";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import useBoards from "@/hooks/useBoards";
import axiosInstance from "@/http/axiosInstance";
import useData from "@/hooks/useData";
import { toast } from "react-toastify";
import { getSession } from "next-auth/react";

function EditTask(props: ITaskAction) {
  const { open, setOpen, type } = props;
  const { boards, activeTab } = useBoards();
  const targetBoard = boards?.find((board) => board._id === activeTab) || {
    _id: "",
    name: "",
    columns: [],
  };
  const [inputState, setInputState] = useState("");
  const [openStatusDropdown, setOpenStatusDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { refetch } = useData("kanban-boards", "/boards");

  const {
    register,
    setValue,
    getValues,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ITask>({
    defaultValues: {
      _id: type === "Create" ? "" : props.taskDetails?._id,
      title: type === "Create" ? "" : props.taskDetails?.title,
      description: type === "Create" ? "" : props.taskDetails?.description,
      subtasks:
        type === "Create"
          ? [{ _id: "", title: "", isCompleted: false }]
          : props.taskDetails?.subtasks.map((item: ISubTask) => ({
              _id: item?._id,
              title: item?.title,
              isCompleted: item?.isCompleted,
            })),
      columnId:
        type === "Create"
          ? targetBoard?.columns[0]?._id
          : props.taskDetails?.columnId,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  const status = getValues().columnId;

  const isDuplicatedName = (value = "") => {
    if (!targetBoard?.columns) return;
    if (type === "Edit" && props.taskDetails) {
      if (value.toLowerCase() === props.taskDetails.title.toLowerCase())
        return true;
    }
    return !targetBoard.columns.find((column) =>
      column.tasks?.find(
        (task) => task.title?.toLowerCase() == value.toLowerCase()
      )
    );
  };

  const handleAddNewSubTask = () => {
    if (fields.length > 6) return;
    append({ _id: "", title: "", isCompleted: false });
  };

  const onSubmit: SubmitHandler<ITask> = async (data) => {
    const session = await getSession();
    const token = session?.user?.token;
    setIsLoading(true);
    try {
      if (type === "Create") {
        await axiosInstance.post(
          "/tasks",
          {
            title: data?.title,
            ...(data?.description && {
              description: data?.description,
            }),
            columnId: data?.columnId,
            subtasks: data?.subtasks?.map((subtask) => {
              return {
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
      } else {
        await axiosInstance.patch(
          `/tasks/${props.taskDetails._id}`,
          {
            title: data?.title,
            ...(data?.description && {
              description: data?.description,
            }),
            columnId: data?.columnId,
            subtasks: data?.subtasks?.map((subtask) => {
              if (subtask?._id) {
                return {
                  id: subtask?._id,
                  title: subtask?.title,
                  isCompleted: subtask?.isCompleted,
                };
              } else {
                return {
                  title: subtask?.title,
                  isCompleted: subtask?.isCompleted,
                };
              }
            }),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      setIsLoading(false);
      refetch();
      toast(
        type === "Create"
          ? "Task was created successfully!"
          : "Task was updated successfully!",
        {
          type: "success",
          theme: "dark",
        }
      );
      setOpen(false);
    } catch (e: any) {
      setIsLoading(false);
      toast(e?.response?.data?.msg ? e?.response?.data?.msg : e?.message, {
        type: "error",
        theme: "dark",
      });
    }
  };

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
        <h3 className="text-lg font-semibold tracking-wide">
          {type === "Create" ? "Add New" : "Edit"} Task
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 flex flex-col gap-3"
        >
          {/* title */}
          <div>
            <p className="text-xs font-semibold text-[#fff] mb-2 tracking-wide">
              Title
            </p>
            <div
              className={`w-full border-2 ${
                errors.title
                  ? "border-[#EA5555]"
                  : inputState === "title"
                  ? "border-[#635FC7]"
                  : "border-[rgba(130,143,163,0.4)]"
              } rounded relative transition-colors duration-[0.2s] ease-in-out`}
            >
              <input
                type="text"
                {...register("title", {
                  validate: (value) => isDuplicatedName(value),
                  required: true,
                })}
                className="border-none bg-transparent outline-none text-[0.8125rem] font-medium w-full h-full rounded px-4 py-2"
                onFocus={() => setInputState("title")}
                onBlur={() => setInputState("")}
              />
              {errors.title?.type == "validate" && (
                <span className="absolute flex top-0 bottom-0 right-2 items-center text-xs font-semibold text-[#EA5555]">
                  Used
                </span>
              )}
              {errors.title?.type == "required" && (
                <span className="absolute flex top-0 bottom-0 right-2 items-center text-xs font-semibold text-[#EA5555]">
                  Required
                </span>
              )}
            </div>
          </div>
          {/* description */}
          <div>
            <p className="text-xs font-semibold text-[#fff] mb-2 tracking-wide">
              Description (optional)
            </p>
            <textarea
              className={`viewTaskDesc resize-none border-2 border-[rgba(130,143,163,0.4)] focus:border-[#635FC7] transition-colors duration-[0.2s] ease-in-out bg-transparent outline-none text-[0.8125rem] font-medium w-full h-full rounded px-4 py-2`}
              rows={4}
              {...register("description")}
            />
          </div>
          {/* subtasks */}
          <div>
            <p className="text-xs font-semibold text-[#fff] mb-2 tracking-wider">
              Subtasks
            </p>
            <ul className="flex flex-col gap-2 w-full">
              {fields.map((item: ISubTask, index: number) => {
                return (
                  <li className="flex items-center justify-between" key={index}>
                    <div
                      className={`w-[92%] border-2 ${
                        errors.subtasks?.[index]?.title
                          ? "border-[#EA5555]"
                          : inputState === `subtasks.${index}.title`
                          ? "border-[#635FC7]"
                          : "border-[rgba(130,143,163,0.4)]"
                      } rounded relative transition-colors duration-[0.2s] ease-in-out`}
                    >
                      <input
                        type="text"
                        defaultValue={`${item.title}`}
                        {...register(`subtasks.${index}.title`, {
                          required: true,
                        })}
                        className="border-none bg-transparent outline-none text-[0.8125rem] font-medium w-full h-full rounded px-4 py-2"
                        onFocus={() => setInputState(`subtasks.${index}.title`)}
                        onBlur={() => setInputState("")}
                      />
                      {errors.subtasks?.[index]?.title?.type == "required" && (
                        <span className="absolute flex top-0 bottom-0 right-2 items-center text-xs font-semibold text-[#EA5555]">
                          Required
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className=""
                      onClick={() => remove(index)}
                    >
                      <svg
                        width="15"
                        height="15"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g fill="#828FA3" fillRule="evenodd">
                          <path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z" />
                          <path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z" />
                        </g>
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
            {fields.length < 7 && (
              <button
                type="button"
                className="text-[0.8125rem] w-full h-10 rounded-3xl bg-[#fff] hover:opacity-90 font-bold text-[#635FC7] transition-all duration-[0.2s] ease-in-out"
                style={{ marginTop: "1.5rem" }}
                onClick={handleAddNewSubTask}
              >
                + Add New Subtask
              </button>
            )}
          </div>
          {/* status */}
          <div className="mt-2">
            <p className="text-xs font-bold">Status</p>
            <div className="relative">
              <button
                type="button"
                className="w-full flex items-center justify-between py-2 px-[1rem] rounded text-xs font-bold mt-2 border-2 border-[rgba(130,143,163,0.4)] text-white capitalize transition duration-[0.2s] ease-in-out focus:outline-none focus:border-[#635FC7] cursor-pointer"
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
                        setValue("columnId", column?._id, {
                          shouldValidate: true,
                        }),
                        setOpenStatusDropdown(false)
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
            type="submit"
            className="mb-8 text-[0.8125rem] w-full h-10 rounded-3xl text-[#fff] hover:opacity-90 font-bold bg-[#635FC7] hover:bg-[#A8A4FF] transition-all duration-[0.2s] ease-in-out"
            style={{ marginTop: "1rem" }}
            disabled={isLoading}
          >
            {isLoading
              ? "Loading..."
              : type === "Create"
              ? "Create Task"
              : "Save Changes"}
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default EditTask;
