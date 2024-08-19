import { ILogin } from "@/types";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";

function Login() {
  const [inputState, setInputState] = useState<"email" | "password" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();

  async function handleLogin(
    type: "regular_login" | "demo",
    formData?: ILogin
  ) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email:
          type === "regular_login" ? formData?.email : "demouser@gmail.com",
        password: type === "regular_login" ? formData?.password : "secret",
      });
      setIsLoading(false);
      if (result?.error) {
        toast(result.error, { type: "error" });
      } else {
        toast("Login successful!", { type: "success", theme: "dark" });
        router.push("/boards");
      }
    } catch (e: any) {
      setIsLoading(false);
      toast(e.message, { type: "error", theme: "dark" });
    }
  }

  const onSubmit: SubmitHandler<ILogin> = async (formData) => {
    handleLogin("regular_login", formData);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mt-7 text-white"
      >
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
      <button
        disabled={isLoading}
        onClick={() => handleLogin("demo")}
        className="w-full h-10 rounded-lg bg-[#635FC7] hover:bg-[#A8A4FF] text-white mt-4 transition-colors duration-[0.2s] ease-in-out"
      >
        Explore the App
      </button>
    </div>
  );
}

export default Login;
