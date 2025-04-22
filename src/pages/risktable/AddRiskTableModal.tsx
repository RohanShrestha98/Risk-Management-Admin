import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Button from "@/ui/Button";
import CustomSelect from "@/ui/CustomSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputField from "@/ui/InputField";
import { useForm } from "react-hook-form";
import { useCourseMutation } from "@/hooks/useMutateData";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useCourseGroupData, useUserData } from "@/hooks/useQueryData";
import toast from "react-hot-toast";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import { ConvertHtmlToPlainText } from "@/utils/convertHtmlToPlainText";

export default function AddRiskTableModal({
  asChild,
  children,
  edit,
  editData,
}) {
  const [open, setOpen] = useState(false);
  const { data } = useUserData();
  const [hasSubmittedClick, setHasSubmittedClick] = useState(false);
  const [value, setValue] = useState(edit ? editData?.description : "");
  const [action, setAction] = useState(edit ? editData?.action : "");
  const [error, setError] = useState("");
  const [selectedThreatLevel, setSelectedThreatLevel] = useState(
    edit ? editData?.threatlevel : 1
  );
  const [selectedAssignee, setSelectedAssignee] = useState(
    edit ? editData?.assignee : ""
  );
  const [selectedStatus, setSelectedStatus] = useState(
    edit ? editData?.status : ""
  );

  const fieldSchema = Yup.object().shape({
    title: Yup.string()
      .required("Required")
      .max(50, "Must be 36 characters or less"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(fieldSchema),
    defaultValues: {
      title: editData?.title,
      description: editData?.description,
      action: editData?.action,
      threatlevel: editData?.threatlevel,
      createdby: editData?.createdby,
    },
  });

  useEffect(() => {
    reset({
      threatlevel: editData?.threatlevel,
      title: editData?.title,
      description: editData?.description,
      createdby: editData?.createdby,
      assignee: editData?.assignee,
      status: editData?.status,
      action: editData?.action,
    });
    setError();
  }, [editData, reset, open]);

  const threatlevelOptions = [...Array(10)].map((_, i) => ({
    value: i + 1,
    label: `${i + 1}`,
  }));

  const assigneeOptions = convertToSelectOptions(data);
  const statusOptions = [
    {
      value: "identified",
      label: "Identified",
    },
    {
      value: "evaluated",
      label: "Evaluated",
    },
    {
      value: "mitigationInProgress",
      label: "Mitigation in Progress",
    },
    {
      value: "mitigated",
      label: "Mitigated",
    },
    {
      value: "closed",
      label: "Closed",
    },
    {
      value: "escalated",
      label: "Escalated",
    },
    {
      value: "transferred",
      label: "Transferred",
    },
  ];

  const courseMutation = useCourseMutation();

  const onSubmitHandler = async (data) => {
    const postData = {
      ...data,
      threatlevel: selectedThreatLevel,
      assignee: selectedAssignee,
      status: selectedStatus,
      createdby: "userID",
      description: ConvertHtmlToPlainText(value),
      action: ConvertHtmlToPlainText(action),
    };
    try {
      const response = await courseMutation.mutateAsync([
        edit ? "patch" : "post",
        edit ? `update/${editData?.id}` : "create/",
        postData,
      ]);
      setOpen(false);
      reset();
      setError();
      toast.success(`Risk ${edit ? "updated" : "added"} successfully`);
    } catch (err) {
      console.log("err", err);
      setError(err?.response?.data?.errors);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setValue("");
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]  min-w-[500px] bg-[#FAFAFA]">
        <DialogTitle className="text-[#22244D] font-medium text-base">
          {edit ? "Edit" : "Add"} Risk
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="flex flex-col gap-4">
            <div className="">
              <InputField
                register={register}
                name="title"
                placeholder="Enter Risk Title"
                className="w-full text-sm text-gray-500"
                defaultValue=""
                required
                label="Risk Title"
              />
              <p className="text-red-600 text-xs">
                {errors?.title?.message ?? error?.title}
              </p>
            </div>
            <div>
              <div className="flex justify-between gap-2">
                <div className="w-1/3">
                  <CustomSelect
                    options={threatlevelOptions}
                    label={""}
                    placeholder={
                      edit ? editData?.threatlevel : "Select Threat Level"
                    }
                    setSelectedField={setSelectedThreatLevel}
                    className={"w-full text-sm text-gray-500"}
                    labelName={"Threat Level"}
                    required={true}
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.threatlevel?.message ?? error?.threatlevel}
                  </p>
                </div>
                <div className="w-1/3">
                  <CustomSelect
                    options={assigneeOptions}
                    label={""}
                    placeholder={edit ? editData?.assignee : "Select assignee"}
                    setSelectedField={setSelectedAssignee}
                    className={"w-full text-sm text-gray-500"}
                    labelName={"Assignee"}
                    required={true}
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.assignee?.message ?? error?.assignee}
                  </p>
                </div>
                <div className="w-1/3">
                  <CustomSelect
                    options={statusOptions}
                    label={""}
                    placeholder={edit ? editData?.status : "Select status"}
                    setSelectedField={setSelectedStatus}
                    className={"w-full text-sm text-gray-500"}
                    labelName={"Status"}
                    required={true}
                  />
                  <p className="text-red-600 text-xs">
                    {errors?.status?.message ?? error?.status}
                  </p>
                </div>
              </div>
              <p className="text-[#344054] leading-5 font-medium text-sm my-1">
                Action
              </p>
              <ReactQuill
                theme="snow"
                className="h-[70px] mb-10"
                value={action}
                onChange={setAction}
              />
            </div>
            <p className="text-[#344054] leading-5 font-medium text-sm mb-1">
              Description <span className="text-red-600">*</span>{" "}
            </p>
            <ReactQuill
              theme="snow"
              className="h-[70px] mb-10"
              value={value}
              onChange={setValue}
            />
          </div>
          <div className="grid grid-cols-2 w-full mt-10 gap-2">
            <Button
              buttonName={"Clear"}
              className={"w-full "}
              danger
              handleButtonClick={(e) => {
                handleClear(e);
              }}
              icon={""}
            />
            <Button
              type="submit"
              buttonName={`${edit ? "Edit" : "Add"} Risk`}
              handleButtonClick={() => setHasSubmittedClick(true)}
              className={"w-full"}
              icon={""}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
