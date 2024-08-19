import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ScrollContainer from "react-indiana-drag-scroll";
import MobileSidebar from "./MobileSidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useData from "@/hooks/useData";
import { WithAuthProps } from "@/types";
import useBoards from "@/hooks/useBoards";
import Loading from "./UI/Loading";
import EditBoard from "./Modals/Board/EditBoard";
import Error from "./UI/Error";
import useIsLargeScreen from "@/hooks/useIsLargeScreen";

function Layout({ children }: WithAuthProps) {
  const isLargeScreen = useIsLargeScreen();
  const [showMobileSideNav, setShowMobileSideNav] = useState(false);
  const [showNewBoardModal, setShowNewBoardModal] = useState(false);
  const [hideSideNav, setHideSideNav] = useState(false);
  const { setBoards } = useBoards();

  const { data, isLoading, isError, refetch } = useData(
    "kanban-boards",
    "/boards"
  );

  useEffect(() => {
    setBoards(data?.boards);
  }, [data]);

  return (
    <div className="flex flex-col h-screen">
      {isLoading && <Loading />}
      {isError && <Error refetch={refetch} />}
      {showNewBoardModal && (
        <EditBoard
          open={showNewBoardModal}
          setOpen={setShowNewBoardModal}
          type="Create"
        />
      )}
      <Header setShowMobileSideNav={setShowMobileSideNav} />
      <div className="flex flex-grow">
        <Sidebar hideSideNav={hideSideNav} setHideSideNav={setHideSideNav} />
        {showMobileSideNav && (
          <MobileSidebar
            open={showMobileSideNav}
            setOpen={setShowMobileSideNav}
          />
        )}
        <ScrollContainer
          className={`main`}
          style={
            hideSideNav || !isLargeScreen
              ? {
                  marginLeft: "0px",
                  width: "calc(100% - 0px)",
                }
              : {
                  marginLeft: "288px",
                  width: "calc(100% - 288px)",
                }
          }
          nativeMobileScroll={true}
          vertical={false}
          hideScrollbars={false}
          ignoreElements={".card"}
        >
          <div className="h-auto min-h-[calc(100vh-96px)] w-fit px-8 py-6">
            {data?.boards?.length === 0 ? (
              // empty board
              <div
                className="flex flex-col gap-4 items-center justify-center h-[calc(100vh-96px)]"
                style={
                  hideSideNav || !isLargeScreen
                    ? {
                        width: "calc(100vw - 0px)",
                      }
                    : {
                        width: "calc(100vw - 288px)",
                      }
                }
              >
                <p className="text-white">
                  No board has been created yet. Create a new board to get
                  started
                </p>
                <button
                  onClick={() => setShowNewBoardModal(true)}
                  className="bg-[#635FC7] hover:bg-[#A8A4FF] transition-colors duration-[0.2s] ease-in-out text-white text-base px-4 py-3 rounded-3xl font-semibold"
                >
                  + Create New Board
                </button>
                <div className="flex flex-col gap-4 items-center justify-center"></div>
              </div>
            ) : (
              children
            )}
          </div>
          {/* desktop show sidebar button */}
          {hideSideNav && (
            <button
              onClick={() => setHideSideNav(!hideSideNav)}
              className="fixed hidden lg:flex items-center justify-center left-0 bottom-8 bg-[#635FC7] hover:bg-[#A8A4FF] text-white w-14 h-12 rounded-tr-3xl rounded-br-3xl selectWrapper transition-colors duration-[0.2s] ease-in-out"
            >
              <svg width="16" height="11" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15.815 4.434A9.055 9.055 0 0 0 8 0 9.055 9.055 0 0 0 .185 4.434a1.333 1.333 0 0 0 0 1.354A9.055 9.055 0 0 0 8 10.222c3.33 0 6.25-1.777 7.815-4.434a1.333 1.333 0 0 0 0-1.354ZM8 8.89A3.776 3.776 0 0 1 4.222 5.11 3.776 3.776 0 0 1 8 1.333a3.776 3.776 0 0 1 3.778 3.778A3.776 3.776 0 0 1 8 8.89Zm2.889-3.778a2.889 2.889 0 1 1-5.438-1.36 1.19 1.19 0 1 0 1.19-1.189H6.64a2.889 2.889 0 0 1 4.25 2.549Z"
                  fill={"currentColor"}
                />
              </svg>
            </button>
          )}
          {/* mobile and tablet sidebar button */}
          {!showMobileSideNav && (
            <button
              onClick={() => setShowMobileSideNav(!showMobileSideNav)}
              className="fixed hidden md:flex items-center justify-center lg:hidden left-0 bottom-8 bg-[#635FC7] hover:bg-[#A8A4FF] text-white w-14 h-12 rounded-tr-3xl rounded-br-3xl selectWrapper transition-colors duration-[0.2s] ease-in-out"
            >
              <svg width="16" height="11" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15.815 4.434A9.055 9.055 0 0 0 8 0 9.055 9.055 0 0 0 .185 4.434a1.333 1.333 0 0 0 0 1.354A9.055 9.055 0 0 0 8 10.222c3.33 0 6.25-1.777 7.815-4.434a1.333 1.333 0 0 0 0-1.354ZM8 8.89A3.776 3.776 0 0 1 4.222 5.11 3.776 3.776 0 0 1 8 1.333a3.776 3.776 0 0 1 3.778 3.778A3.776 3.776 0 0 1 8 8.89Zm2.889-3.778a2.889 2.889 0 1 1-5.438-1.36 1.19 1.19 0 1 0 1.19-1.189H6.64a2.889 2.889 0 0 1 4.25 2.549Z"
                  fill={"currentColor"}
                />
              </svg>
            </button>
          )}
        </ScrollContainer>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Layout;

// export default withAuth(Layout);
