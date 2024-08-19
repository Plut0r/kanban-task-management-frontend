import React from "react";

function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.6)] flex flex-col justify-center items-center z-[9999]">
      <span className="loader"></span>
      <p className="text-white mt-5">
        Just a moment, your boards are being fetched.
      </p>
    </div>
  );
}

export default Loading;
