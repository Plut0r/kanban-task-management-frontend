import { IBoard } from "@/types";
import { atomWithStorage } from "jotai/utils";

export const tokenAtom = atomWithStorage("kanban_token", "");
export const boardsAtom = atomWithStorage<IBoard[]>("kanban-boards-app", []);
export const activeTabAtom = atomWithStorage<string>("kanban-active-tab", "")