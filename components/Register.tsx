import { IRegister } from "@/types";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { signIn } from "next-auth/react";

function Register() {
  const [inputState, setInputState] = useState<
    "first-name" | "last-name" | "email" | "password" | ""
  >("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegister>();

  const onSubmit: SubmitHandler<IRegister> = async (formData) => {
    setIsLoading(true);
    try {
      const registrationResponse = await axios.post("/api/auth/register", {
        firstName: formData.first_name,
        lastName: formData.last_name,
        email: formData.email,
        password: formData.password,
      });
      if (registrationResponse.status === 200) {
        const signInResult = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });
        setIsLoading(false);
        if (signInResult?.error) {
          toast(signInResult.error, { type: "error" });
        } else {
          toast("Registration successful!", { type: "success", theme: "dark" });
          router.push("/boards");
        }
      } else {
        setIsLoading(false);
        toast("Registration failed", { type: "error", theme: "dark" });
      }
    } catch (e: any) {
      // console.log(e);
      setIsLoading(false);
      toast(e?.response?.data?.msg ? e?.response?.data?.msg : e?.message, {
        type: "error",
        theme: "dark",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-7 text-white">
      <div className="flex flex-col gap-2">
        <label htmlFor="first-name" className="text-sm font-medium">
          First Name
        </label>
        <div
          className={`w-full h-8 border-2 ${
            errors.first_name
              ? "border-[#EA5555]"
              : inputState === "first-name"
              ? "border-[#635FC7]"
              : "border-[rgba(130,143,163,0.4)]"
          } rounded relative transition-colors duration-[0.2s] ease-in-out`}
        >
          <input
            id="first-name"
            type="text"
            {...register("first_name", {
              required: true,
            })}
            className="border-none bg-transparent outline-none text-sm w-full px-2 h-full"
            onFocus={() => setInputState("first-name")}
            onBlur={() => setInputState("")}
          />
          {errors.first_name?.type == "required" && (
            <span className="absolute flex top-0 bottom-0 right-2 items-center text-xs font-semibold text-[#EA5555]">
              Required
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-5">
        <label htmlFor="last-name" className="text-sm font-medium">
          Last Name
        </label>
        <div
          className={`w-full h-8 border-2 ${
            errors.last_name
              ? "border-[#EA5555]"
              : inputState === "last-name"
              ? "border-[#635FC7]"
              : "border-[rgba(130,143,163,0.4)]"
          } rounded relative transition-colors duration-[0.2s] ease-in-out`}
        >
          <input
            id="last-name"
            type="text"
            {...register("last_name", {
              required: true,
            })}
            className="border-none bg-transparent outline-none text-sm w-full px-2 h-full"
            onFocus={() => setInputState("last-name")}
            onBlur={() => setInputState("")}
          />
          {errors.last_name?.type == "required" && (
            <span className="absolute flex top-0 bottom-0 right-2 items-center text-xs font-semibold text-[#EA5555]">
              Required
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <div
          className={`w-full h-8 border-2 ${
            errors.email
              ? "border-[#EA5555]"
              : inputState === "email"
              ? "border-[#635FC7]"
              : "border-[rgba(130,143,163,0.4)]"
          } rounded relative transition-colors duration-[0.2s] ease-in-out`}
        >
          <input
            id="email"
            type="email"
            {...register("email", {
              required: true,
              pattern: /^\S+@\S+$/i,
            })}
            className="border-none bg-transparent outline-none text-sm w-full px-2 h-full"
            onFocus={() => setInputState("email")}
            onBlur={() => setInputState("")}
          />
          {errors.email?.type == "pattern" && (
            <span className="absolute flex top-0 bottom-0 right-2 items-center text-xs font-semibold text-[#EA5555]">
              Invalid
            </span>
          )}
          {errors.email?.type == "required" && (
            <span className="absolute flex top-0 bottom-0 right-2 items-center text-xs font-semibold text-[#EA5555]">
              Required
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-5">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <div
          className={`w-full h-8 border-2 ${
            errors.password
              ? "border-[#EA5555]"
              : inputState === "password"
              ? "border-[#635FC7]"
              : "border-[rgba(130,143,163,0.4)]"
          } rounded relative transition-colors duration-[0.2s] ease-in-out`}
        >
          <input
            id="password"
            type="password"
            {...register("password", {
              required: true,
              minLength: 6,
            })}
            className="border-none bg-transparent outline-none text-sm w-full px-2 h-full"
            onFocus={() => setInputState("password")}
            onBlur={() => setInputState("")}
          />
          {errors.password?.type == "required" && (
            <span className="absolute flex top-0 bottom-0 right-2 items-center text-xs font-semibold text-[#EA5555]">
              Required
            </span>
          )}
          {errors.password?.type == "minLength" && (
            <span className="absolute flex top-0 bottom-0 right-2 items-center text-xs font-semibold text-[#EA5555]">
              Too short
            </span>
          )}
        </div>
      </div>
      <button
        disabled={isLoading}
        className="w-full h-10 rounded-lg bg-[#635FC7] hover:bg-[#A8A4FF] text-white mt-8 transition-colors duration-[0.2s] ease-in-out"
      >
        {isLoading ? "Loading..." : "Submit"}
      </button>
    </form>
  );
}

export default Register;
