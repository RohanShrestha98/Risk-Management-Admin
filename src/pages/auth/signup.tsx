/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuthSignupMutation } from "@/hooks/useMutateData";
import Button from "@/ui/Button";
import LoginInput from "@/ui/LoginInput";
import toast from "react-hot-toast";

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .required("Required")
    .max(36, "Must be 36 characters or less"),
  firstName: Yup.string()
    .required("Required")
    .max(36, "Must be 36 characters or less"),
  lastName: Yup.string()
    .required("Required")
    .max(36, "Must be 36 characters or less"),
  phoneNumber: Yup.string().required("Required"),
  email: Yup.string()
    .required("Required")
    .max(36, "Must be 36 characters or less"),
  password: Yup.string().required("Required"),
});

const SignUp = () => {
  const { setUser } = useAuthStore();
  const authMutation = useAuthSignupMutation();
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
      toast.success("Signup successfully");
      navigate("/login");
      reset();
    } catch (error) {
      console.log("error", error);
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
        <div className="flex flex-col items-center md:justify-center mt-10 ">
          <div className="flex flex-col items-center">
            <div className="flex flex-col gap-1 mb-10 md:items-center tracking-tight md:justify-center text-2xl sm:text-xl font-bold ">
              <p className=" text-2xl">Signup </p>
              <p className="text-[#666] text-base font-medium">
                Create your free account
              </p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className="w-full md:px-4 "
            >
              <div className="grid grid-cols-2  gap-3">
                <div className="rounded-md">
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Firstname <span className="text-red-600">*</span>
                  </p>
                  <LoginInput
                    className="bg-white w-full text-sm"
                    register={register}
                    name="firstName"
                    type="text"
                    placeholder="Enter first name"
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.firstName?.message ?? error?.firstName}
                  </p>
                </div>
                <div className="rounded-md">
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Lastname <span className="text-red-600">*</span>
                  </p>
                  <LoginInput
                    className="bg-white w-full text-sm"
                    register={register}
                    name="lastName"
                    type="text"
                    placeholder="Enter last name"
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.lastName?.message ?? error?.lastName}
                  </p>
                </div>
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
                    Email <span className="text-red-600">*</span>
                  </p>
                  <LoginInput
                    className="bg-white w-full text-sm"
                    register={register}
                    name="email"
                    type="email"
                    placeholder="Enter email"
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.email?.message ?? error?.email}
                  </p>
                </div>
                <div className="rounded-md">
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Phone number <span className="text-red-600">*</span>
                  </p>
                  <LoginInput
                    className="bg-white w-full text-sm"
                    register={register}
                    name="phoneNumber"
                    type="number"
                    placeholder="Enter phone number"
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.phoneNumber?.message ?? error?.phoneNumber}
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
              </div>

              <Button
                buttonName={"Sign up"}
                className={"w-full h-10 text-lg font-normal "}
                icon={undefined}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
