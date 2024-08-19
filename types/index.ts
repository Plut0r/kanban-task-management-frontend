export type IRegister = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type ILogin = {
  email: string;
  password: string;
};

export type ISubTask = {
  _id: string;
  title: string;
  isCompleted: boolean;
};

export type ITask = {
  _id: string;
  title: string;
  description: string;
  status: string;
  columnId: string;
  subtasks: ISubTask[];
};

export type IColumn = {
  _id: string;
  name: string;
  tasks: ITask[];
};

export type IExtendedColumn = IColumn & {
  ballColorIndex: number;
  loadingTaskId: string;
};

export type IBoard = {
  _id: string;
  name: string;
  columns: IColumn[];
};

export type IModal = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ITaskBase extends IModal {
  setEditTaskModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteTaskModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

export type ITaskEdit = ITaskBase & {
  type: "Edit";
  taskDetails: ITask;
};

export type ITaskDelete = IModal & {
  _id: string;
  type: "Task" | "Board";
  name: string;
};

export type ITaskCreate = ITaskBase & {
  type: "Create";
};

export type ITaskAction = ITaskEdit | ITaskCreate;

export type IBoardAction = IModal & {
  type: "Edit" | "Create" | "Column";
};

export interface WithAuthProps {
  children: React.ReactNode;
}
