import React from "react";

function Error({ refetch }: { refetch: any }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.6)] flex flex-col justify-center items-center z-[9999]">
      <p className="text-white">Something went wrong, Please try again.</p>
      <button
        onClick={() => refetch()}
        className="bg-[#635FC7] hover:bg-[#A8A4FF] transition-colors duration-[0.2s] ease-in-out text-white text-base px-5 py-2 rounded-xl font-semibold mt-5"
      >
        Refetch
      </button>
    </div>
  );
}

export default Error;
