/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuthMutation } from "@/hooks/useMutateData";
import Button from "@/ui/Button";
import LoginInput from "@/ui/LoginInput";
import toast from "react-hot-toast";

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .required("Required")
    .max(36, "Must be 36 characters or less"),
  password: Yup.string().required("Required"),
});

const Login = () => {
  const { setUser } = useAuthStore();
  const authMutation = useAuthMutation();
  const [error, setError] = useState();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(loginSchema),
  });

  const onSubmitHandler = async (data) => {
    try {
      const result = await authMutation.mutateAsync(["post", "", data]);
      setUser({
        token: result?.data?.access,
        refresh: result?.data?.refresh,
        data: result?.data?.user,
      });
      toast.success("Login successfully");
      navigate("/");
      reset();
    } catch (error) {
      console.log("error", error?.response?.data?.errors);
      setError(error?.response?.data?.errors);
    }
  };

  const [usingMobile, setUsingMobile] = useState(false);

  return (
    //
    <div className=" flex flex-col ">
      {/* <img src={loginBgR} className="absolute right-0 sm:w-7" alt="" /> */}
      <div className="flex md:justify-center p-4 gap-1 items-center ">
        <img className="h-12 w-12" src={logo} alt="logo" />
        <div className="font-bold text-[#121212] flex flex-col">
          <p>Risk Register</p>
          <p className="mt-[-6px]">App</p>
        </div>
      </div>
      <div className="md:items-center md:justify-center flex flex-col">
        <div className="flex flex-col items-center md:justify-center mt-20 ">
          <div className="flex flex-col items-center">
            <div className="flex flex-col gap-1 mb-10 md:items-center tracking-tight md:justify-center text-2xl sm:text-xl font-bold ">
              <p className=" text-2xl">Log in</p>
              <p className="text-[#666] text-base font-medium">
                Enter your credentials to login to your account.
              </p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className="flex w-full flex-col gap-3 md:px-4 "
            >
              <div className="rounded-md">
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Username <span className="text-red-600">*</span>
                </p>
                <LoginInput
                  className="bg-white w-full text-sm"
                  register={register}
                  name="username"
                  type="text"
                  placeholder="Enter user name"
                />
                <p className="text-red-600 text-xs">
                  {errors?.username?.message ?? error?.username}
                </p>
              </div>
              <div className="rounded-md">
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Password <span className="text-red-600">*</span>
                </p>
                <LoginInput
                  className="bg-white w-full text-sm"
                  register={register}
                  name="password"
                  type="password"
                  placeholder="Password"
                />
                <p className="text-red-600 text-xs">
                  {errors?.password?.message ?? error?.password}
                </p>
              </div>
              <p className="text-red-600 text-xs">{error?.error}</p>
              <div
                className={`tracking-tight flex gap-2 justify-end sm:my-4 ${
                  !usingMobile ? "my-2" : " my-5 "
                }`}
              >
                {/* <p className="text-theme-color text-sm lg:text-xs whitespace-nowrap cursor-pointer underline">
                  Forgot your password?
                </p> */}
              </div>
              <img
                className="hidden md:block bottom-0 absolute justify-start left-0 sm:w-7"
                alt=""
              />
              <Button
                buttonName={"Login"}
                className={"w-full h-10 text-lg font-normal "}
                icon={undefined}
              />
            </form>
          </div>
          {/* <div className="flex whitespace-nowrap justify-center tracking-tight text-sm gap-1 mt-20">
            <p className="text-[#666]">Don’t have an account? </p>

            <p
              onClick={() => navigate("/signup")}
              className="text-theme-color cursor-pointer underline"
            >
              Create a free account
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
