import { IBoard, IBoardAction, IColumn, IModal } from "@/types";
import React, { useState } from "react";
import Modal from "react-modal";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { hasDuplicates } from "@/helper/util";
import axiosInstance from "@/http/axiosInstance";
import { toast } from "react-toastify";
import useBoards from "@/hooks/useBoards";
import useData from "@/hooks/useData";
import Cookies from "universal-cookie";
import { getSession } from "next-auth/react";

function EditBoard({ open, setOpen, type }: IBoardAction) {
  const { boards, activeTab } = useBoards();
  const targetBoard = boards?.find((board) => board._id === activeTab) || {
    _id: "",
    name: "",
    columns: [],
  };
  const [inputState, setInputState] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { refetch } = useData("kanban-boards", "/boards");

  const {
    register,
    watch,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<IBoard>({
    defaultValues: {
      name: type === "Create" ? "" : targetBoard?.name,
      columns:
        type === "Create"
          ? [{ _id: "", name: "", tasks: [] }]
          : targetBoard?.columns?.map((item: IColumn) => ({
              _id: item._id,
              name: item.name,
              tasks: item.tasks,
            })),
      _id: type === "Create" ? "" : targetBoard?._id,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });
  const watchFieldArray = watch("columns");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray?.[index],
    };
  });

  const isDuplicatedName = (value: string | undefined) => {
    if (targetBoard) {
      if (targetBoard?.name == value) return true;
    }
    return !boards.find(
      (item) => item.name?.toLowerCase() == value?.toLowerCase()
    );
  };

  const handleAddNewColumn = () => {
    if (fields.length > 5) return;
    append({ _id: "", name: "", tasks: [] });
  };

  const onSubmit: SubmitHandler<IBoard> = async (data) => {
    const session = await getSession();
    const token = session?.user?.token;
    setIsLoading(true);
    try {
      if (type === "Create") {
        await axiosInstance.post(
          "/boards",
          {
            name: data?.name,
            columns: data?.columns?.map((column) => column?.name),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axiosInstance.patch(
          `/boards/${targetBoard?._id}`,
          {
            name: data?.name,
            columns: data?.columns?.map((column) => {
              if (column?._id) {
                return {
                  id: column?._id,
                  name: column?.name,
                };
              } else {
                return {
                  name: column?.name,
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
          ? "Board was created successfully!"
          : "Board was updated successfully!",
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
          {type === "Edit" && "Edit Board"}
          {type === "Create" && "Add New Board"}
          {type === "Column" && "Add New Column"}
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 flex flex-col gap-3"
        >
          {/* name */}
          <div>
            <p className="text-xs font-semibold text-[#fff] mb-2 tracking-wide">
              Name
            </p>
            <div
              className={`w-full border-2 ${
                errors.name
                  ? "border-[#EA5555]"
                  : inputState === "name"
                  ? "border-[#635FC7]"
                  : "border-[rgba(130,143,163,0.4)]"
              } rounded relative transition-colors duration-[0.2s] ease-in-out`}
            >
              <input
                type="text"
                {...register("name", {
                  validate: (value) => isDuplicatedName(value),
                  required: true,
                })}
                className={`border-none bg-transparent outline-none text-[0.8125rem] font-medium w-full h-full rounded px-4 py-2 ${
                  type === "Column" ? "opacity-30" : ""
                }`}
                onFocus={() => setInputState("name")}
                onBlur={() => setInputState("")}
                disabled={type === "Column"}
              />
              {errors.name?.type == "validate" && (
                <span className="absolute flex top-0 bottom-0 right-2 items-center text-xs font-semibold text-[#EA5555]">
                  Used
                </span>
              )}
              {errors.name?.type == "required" && (
                <span className="absolute flex top-0 bottom-0 right-2 items-center text-xs font-semibold text-[#EA5555]">
                  Required
                </span>
              )}
            </div>
          </div>
          {/* columns */}
          <div>
            <p className="text-xs font-semibold text-[#fff] mb-2 tracking-wider">
              Columns
            </p>
            <ul className="flex flex-col gap-2 w-full">
              {controlledFields.map((item: IColumn, index: number) => {
                return (
                  <li className="flex items-center justify-between" key={index}>
                    <div
                      className={`w-[92%] border-2 ${
                        errors.columns?.[index]?.name
                          ? "border-[#EA5555]"
                          : inputState === `columns.${index}.name`
                          ? "border-[#635FC7]"
                          : "border-[rgba(130,143,163,0.4)]"
                      } rounded relative transition-colors duration-[0.2s] ease-in-out`}
                    >
                      <input
                        type="text"
                        defaultValue={`${item.name}`}
                        {...register(`columns.${index}.name`, {
                          validate: (value) =>
                            hasDuplicates(value, index, watchFieldArray),
                          required: true,
                        })}
                        className="border-none bg-transparent outline-none text-[0.8125rem] font-medium w-full h-full rounded px-4 py-2"
                        onFocus={() => setInputState(`columns.${index}.name`)}
                        onBlur={() => setInputState("")}
                      />
                      {errors.columns?.[index]?.name?.type == "validate" && (
                        <span className="absolute flex top-0 bottom-0 right-2 items-center text-xs font-semibold text-[#EA5555]">
                          Used
                        </span>
                      )}
                      {errors.columns?.[index]?.name?.type == "required" && (
                        <span className="absolute flex top-0 bottom-0 right-2 items-center text-xs font-semibold text-[#EA5555]">
                          Required
                        </span>
                      )}
                    </div>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        className={`${
                          item?.tasks!.length < 1
                            ? ""
                            : "opacity-20 pointer-events-none"
                        }`}
                        // className={`${
                        //   type === "Create"
                        //     ? ""
                        //     : "opacity-20 pointer-events-none"
                        // }`}
                        // disabled={item?.tasks!.length < 1}
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
                    )}
                  </li>
                );
              })}
            </ul>
            {fields.length < 6 && (
              <button
                type="button"
                className="text-[0.8125rem] w-full h-10 rounded-3xl bg-[#fff] hover:opacity-90 font-bold text-[#635FC7] transition-all duration-[0.2s] ease-in-out"
                style={{ marginTop: "1.5rem" }}
                onClick={handleAddNewColumn}
              >
                + Add New Column
              </button>
            )}
          </div>
          {/* button */}
          <button
            type="submit"
            className="mb-8 text-[0.8125rem] w-full h-10 rounded-3xl text-[#fff] hover:opacity-90 font-bold bg-[#635FC7] hover:bg-[#A8A4FF] transition-all duration-[0.2s] ease-in-out"
            style={{ marginTop: "0.2rem" }}
            disabled={isLoading}
          >
            {isLoading
              ? "Loading..."
              : type === "Edit"
              ? "Save Changes"
              : "Create New Board"}
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default EditBoard;
