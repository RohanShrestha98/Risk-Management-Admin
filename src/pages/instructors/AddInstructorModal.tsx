import ChooseImage from "@/components/ChooseImage";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Button from "@/ui/Button";
import CustomSelect from "@/ui/CustomSelect";
import InputField from "@/ui/InputField";
import { useForm } from "react-hook-form";
import { useUserMutation } from "@/hooks/useMutateData";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useCourseData, useSubjectData } from "@/hooks/useQueryData";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import toast from "react-hot-toast";

export default function AddInstructorModal({
  asChild,
  children,
  edit = false,
  editData,
}) {
  const [selectedCourse, setSelectedCourse] = useState(
    edit ? editData?.course?.id : ""
  );
  const [selectedSubject, setSelectedSubject] = useState(
    edit ? editData?.subject?.id : ""
  );
  const [selectedGender, setSelectedGender] = useState(
    edit ? editData?.gender : ""
  );
  const [selectedImage, setSelectedImage] = useState();
  const [open, setOpen] = useState(false);
  const { data } = useCourseData("", "", "", "", open);
  const { data: subjectData } = useSubjectData(
    "",
    selectedCourse,
    "",
    "",
    open
  );
  const courseOptions = convertToSelectOptions(data?.data);
  const subjectOptions = convertToSelectOptions(subjectData?.data);
  const [hasSubmittedClick, setHasSubmittedClick] = useState(false);
  const [error, setError] = useState("");

  const fieldSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("Required")
      .max(36, "Must be 36 characters or less"),
    lastName: Yup.string()
      .required("Required")
      .max(36, "Must be 36 characters or less"),
    middleName: Yup.string().max(36, "Must be 36 characters or less"),
    email: Yup.string().required("Required"),
    phone: Yup.string()
      .required("Required")
      .max(10, "Must be exactly 10 characters")
      .min(10, "Must be exactly 10 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(fieldSchema),
    defaultValues: {
      firstName: editData?.firstName ?? "",
      lastName: editData?.lastName ?? "",
      middleName: editData?.middleName ?? "",
      phone: editData?.phone ?? "",
      email: editData?.email ?? "",
    },
  });

  useEffect(() => {
    reset({
      firstName: editData?.firstName ?? "",
      lastName: editData?.lastName ?? "",
      middleName: editData?.middleName ?? "",
      phone: editData?.phone ?? "",
      email: editData?.email ?? "",
    });
    setError();
  }, [editData, reset, open]);

  const handleClear = (e) => {
    e.preventDefault();
    setSelectedCourse("");
    setSelectedSubject("");
    setSelectedImage("");
    setSelectedGender("");
    reset();
  };

  const instructorMutation = useUserMutation();

  const onSubmitHandler = async (data) => {
    const postData = {
      ...data,
      courseid: selectedCourse,
      subjectid: selectedSubject,
      gender: selectedGender,
      image: selectedImage && selectedImage,
    };
    try {
      const response = await instructorMutation.mutateAsync([
        `${edit ? "patch" : "post"}`,
        edit ? `update/${editData?.id}` : "create/",
        postData,
      ]);
      setHasSubmittedClick(false);
      setOpen(false);
      reset();
      setSelectedImage();
      setError();
      toast.success(`Instructor ${edit ? "updated" : "added"} successfully`);
    } catch (err) {
      console.log("err", err);
      setError(err?.response?.data?.errors);
    }
  };
  const genderOptions = [
    {
      value: "male",
      label: "Male",
    },
    {
      value: "female",
      label: "Female",
    },
    {
      value: "other",
      label: "Others",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]  min-w-[500px] bg-[#FAFAFA]">
        <DialogTitle className="text-[#22244D] font-medium text-base">
          {edit ? "Edit" : "Add"} instructor
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="flex flex-col gap-4">
            <ChooseImage
              setSelectedImage={setSelectedImage}
              selectedImage={selectedImage}
              defaultUrl={editData?.image}
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <CustomSelect
                  options={courseOptions}
                  label={""}
                  placeholder={
                    edit ? editData?.course?.courseID : "Select course"
                  }
                  className={"w-full text-sm text-gray-500"}
                  labelName={"Course"}
                  required={true}
                  setSelectedField={setSelectedCourse}
                />
                <p className="text-red-600 text-xs">
                  {hasSubmittedClick && !selectedCourse && !edit && "Required"}
                  {error?.courseid}
                </p>
              </div>
              <div>
                <CustomSelect
                  options={subjectOptions}
                  label={""}
                  placeholder={
                    edit ? editData?.subject?.title : "Select subject"
                  }
                  className={"w-full text-sm text-gray-500"}
                  labelName={"Subject"}
                  required={true}
                  setSelectedField={setSelectedSubject}
                />
                <p className="text-red-600 text-xs">
                  {hasSubmittedClick && !selectedSubject && !edit && "Required"}
                  {error?.subjectid}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="">
                <InputField
                  register={register}
                  name="firstName"
                  placeholder="Enter First Name"
                  className="w-full text-sm text-gray-500"
                  defaultValue=""
                  required
                  label="First Name"
                />
                <p className="text-red-600 text-xs">
                  {errors?.firstName?.message ?? error?.firstName}
                </p>
              </div>
              <div className="">
                <InputField
                  register={register}
                  name="middleName"
                  placeholder="Enter Middle Name"
                  className="w-full text-sm text-gray-500"
                  defaultValue=""
                  required={false}
                  label="Middle Name"
                />
                <p className="text-red-600 text-xs">
                  {errors?.middleName?.message ?? error?.middleName}
                </p>
              </div>
              <div className="">
                <InputField
                  register={register}
                  name="lastName"
                  placeholder="Enter Last Name"
                  className="w-full text-sm text-gray-500"
                  defaultValue=""
                  required
                  label="Last Name"
                />
                <p className="text-red-600 text-xs">
                  {errors?.lastName?.message ?? error?.lastName}
                </p>
              </div>
            </div>
            <div>
              <CustomSelect
                options={genderOptions}
                label={""}
                placeholder={edit ? editData?.gender : "Select gender"}
                setSelectedField={setSelectedGender}
                className={"w-full text-sm text-gray-500"}
                labelName={"Gender"}
                required={true}
              />
              <p className="text-red-600 text-xs">
                {hasSubmittedClick && !selectedGender && "Required"}
                {error?.gender}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="">
                <InputField
                  register={register}
                  required
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  className="w-full text-sm text-gray-500"
                  defaultValue=""
                  label="Email"
                />
                <p className="text-red-600 text-xs">
                  {errors?.email?.message ?? error?.email}
                </p>
              </div>
              <div className="">
                <InputField
                  register={register}
                  name="phone"
                  type="number"
                  placeholder="Enter phone number"
                  className="w-full text-sm text-gray-500"
                  defaultValue=""
                  required
                  label="Phone Number"
                />
                <p className="text-red-600 text-xs">
                  {errors?.phone?.message ?? error?.phone}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 w-full mt-10 gap-2">
            <Button
              buttonName={`${edit ? "Reset" : "Clear"}`}
              className={"w-full "}
              danger
              handleButtonClick={(e) => handleClear(e)}
              icon={""}
            />
            <Button
              type="submit"
              buttonName={`${edit ? "Edit" : "Add"} instructor`}
              handleButtonClick={() => {
                setHasSubmittedClick(true);
              }}
              className={"w-full"}
              icon={""}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
