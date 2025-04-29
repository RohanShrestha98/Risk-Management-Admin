import InputField from "@/ui/InputField";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useChangePasswordMutation } from "@/hooks/useMutateData";
import toast from "react-hot-toast";

export default function Settings() {
  const [active, setActive] = useState(true);
  const fieldSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Required"),
    newPassword: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
    // password: Yup.string().required("Required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(fieldSchema),
    defaultValues: {},
  });

  const changePasswordMutation = useChangePasswordMutation();

  const onSubmitHandler = async (data) => {
    try {
      const response = await changePasswordMutation.mutateAsync([
        `post`,
        "",
        data,
      ]);
      toast.success(`Password changed successfully`);
    } catch (err) {
      console.log("err", err);
      setError(err?.response?.data?.errors);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="m-6 border">
      <p
        className={`text-sm font-semibold ${active ? "text-blue-800" : ""}`}
        onClick={() => setActive(true)}
      >
        Change Password
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div className="">
          <InputField
            register={register}
            name="firstname"
            placeholder="Enter First Name"
            className="w-full text-sm text-gray-500"
            defaultValue=""
            required
            label="First Name"
          />
          <p className="text-red-600 text-xs">
            {errors?.firstname?.message ?? error?.firstname}
          </p>
        </div>

        <div className="">
          <InputField
            register={register}
            name="lastname"
            placeholder="Enter Last Name"
            className="w-full text-sm text-gray-500"
            defaultValue=""
            required
            label="Last Name"
          />
          <p className="text-red-600 text-xs">
            {errors?.lastname?.message ?? error?.lastname}
          </p>
        </div>
      </div>
    </form>
  );
}
