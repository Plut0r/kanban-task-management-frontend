import { activeTabAtom, boardsAtom } from "@/store/globalAtom";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

function useBoards() {
  const [boards, setBoards] = useAtom(boardsAtom);
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);

  const handleTabClick = (boardId: string) => {
    setActiveTab(boardId);
  };

  return { boards, activeTab, handleTabClick, setBoards };
}

export default useBoards;
