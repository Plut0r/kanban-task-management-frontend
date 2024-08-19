"use client";

import Login from "@/components/Login";
import Register from "@/components/Register";
import Image from "next/image";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [type, setType] = useState<"register" | "login">("register");

  return (
    <main>
      <div
        className="w-full max-w-[400px] rounded-[0.25rem] bg-[#2B2C37] px-10 py-8 mx-auto my-12 transition-all ease-in-out duration-[0.3s] border-t-[5px] border-t-[#635FC7] flex flex-col items-center justify-center"
        style={{
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div>
          <Image
            src={"/images/logo-light.svg"}
            alt="logo"
            width={100}
            height={100}
          />
        </div>
        <h1 className="font-semibold text-2xl mt-7 text-white">
          {type === "register" ? "Register" : "Login"}
        </h1>
        {type === "register" ? <Register /> : <Login />}
        {type === "register" ? (
          <div className="mt-4 text-white">
            <p>
              Already a member?{" "}
              <span
                className="cursor-pointer text-[#635FC7] hover:text-[#A8A4FF] transition-colors duration-[0.2s] ease-in-out"
                onClick={() => setType("login")}
              >
                Login
              </span>
            </p>
          </div>
        ) : (
          <div className="mt-4 text-white">
            <p>
              Not a member yet?{" "}
              <span
                className="cursor-pointer text-[#635FC7] hover:text-[#A8A4FF] transition-colors duration-[0.2s] ease-in-out"
                onClick={() => setType("register")}
              >
                Register
              </span>
            </p>
          </div>
        )}
      </div>
      <ToastContainer />
    </main>
  );
}
