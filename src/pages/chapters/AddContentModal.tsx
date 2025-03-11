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
import { useContentMutation } from "@/hooks/useMutateData";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import ChooseImage from "@/components/ChooseImage";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";

export default function AddContentModal({
  asChild,
  children,
  edit,
  editData,
  chapterId,
}) {
  const [open, setOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(
    edit ? editData?.unitID : ""
  );
  const [contentType, setContentType] = useState(1);
  const [urlVideoType, setUrlVideoType] = useState(2);
  const [selectedImage, setSelectedImage] = useState();
  const [selectedNotePdf, setSelectedNotePdf] = useState();
  const [isPremium, setIsPremium] = useState(edit ? editData?.isPremium : true);
  const [hasNote, setHasNote] = useState(edit ? editData?.hasNote : false);
  const [isVisibility, setIsVisibility] = useState(
    edit ? editData?.isPremium : true
  );
  const [error, setError] = useState("");
  const [hasSubmittedClick, setHasSubmittedClick] = useState(false);
  const [duration, setDuration] = useState(0);
  const [value, setValue] = useState("");

  const fieldSchema = Yup.object().shape({
    title: Yup.string()
      .required("Required")
      .max(36, "Must be 36 characters or less"),
    // url: Yup.string()
    //     .required("Required")
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
    },
  });

  useEffect(() => {
    reset({
      title: editData?.title,
    });
    setError();
  }, [editData, reset, open]);

  const levelOptions = [
    {
      value: "beginner",
      label: "Beginner",
    },
    {
      value: "intermediate",
      label: "Intermediate",
    },

    {
      value: "expert",
      label: "Expert",
    },
  ];
  const selectedValue = levelOptions?.filter(
    (item) => item?.value == selectedLevel
  );
  const contentMutation = useContentMutation();

  const onSubmitHandler = async (data) => {
    const postData = {
      ...data,
      level: selectedLevel,
      file: selectedImage,
      length: duration && duration.toFixed(0),
      isPremium: isPremium,
      visibility: isVisibility,
      chapterid: chapterId,
      contentType: contentType === 1 ? "video" : "pdf",
      note: {
        title: data?.noteTitle,
        description: value,
        file: selectedNotePdf,
      },
    };
    try {
      const response = await contentMutation.mutateAsync([
        edit ? "patch" : "post",
        edit ? `update/${editData?.id}` : "create/",
        postData,
      ]);
      setOpen(false);
      setSelectedImage();
      setDuration(0);
      reset();
      toast.success("Content added successfully");
    } catch (err) {
      console.log("err", err);
      {
        err?.response?.data?.errors?.error &&
          toast.error(err?.response?.data?.errors?.error);
      }
      setError(err?.response?.data?.errors);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    reset();
    setValue("");
  };

  const typeOptions = [
    {
      id: 1,
      label: "Video",
    },
    {
      id: 2,
      label: "PDF",
    },
  ];
  const urlVideo = [
    // {
    //     id: 1,
    //     label: "URL"
    // },
    {
      id: 2,
      label: "Video File",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]  min-w-[500px] bg-[#FAFAFA]">
        <DialogTitle className="text-[#22244D] font-medium text-base">
          {edit ? "Edit" : "Add"} Content
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="flex flex-col gap-4 h-[400px] overflow-auto">
            <div className="flex items-center gap-2">
              {typeOptions?.map((item) => {
                return (
                  <div
                    onClick={() => setContentType(item?.id)}
                    className={`flex items-center text-sm font-medium cursor-pointer border gap-3 py-1 px-4 rounded-full ${
                      contentType === item?.id
                        ? "border-[#4365a7] text-[#4365a7]"
                        : "border-gray-400 text-gray-500"
                    }`}
                  >
                    <div key={item?.id}>{item?.label}</div>
                    <input
                      type="radio"
                      checked={contentType === item?.id ? true : false}
                      className=""
                    ></input>
                  </div>
                );
              })}
            </div>
            <div>
              <InputField
                register={register}
                name="title"
                placeholder="Enter Content Title"
                className="w-full text-sm text-gray-500"
                defaultValue=""
                required
                label="Content Title"
              />
              <p className="text-red-600 text-xs">
                {errors?.title?.message ?? error?.title}
              </p>
            </div>
            <div className="flex gap-10">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Is Premium ?</p>
                <Switch
                  onClick={() => setIsPremium(!isPremium)}
                  checked={isPremium}
                  className="bg-gray-300"
                />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Visibility ?</p>
                <Switch
                  onClick={() => setIsVisibility(!isVisibility)}
                  checked={isVisibility}
                  className="bg-gray-300"
                />
              </div>
            </div>
            {contentType === 1 && (
              <div className="flex items-center gap-3">
                {urlVideo?.map((item) => {
                  return (
                    <div
                      onClick={() => setUrlVideoType(item?.id)}
                      className={`flex items-center text-sm font-medium cursor-pointer  gap-1 py-1 ${
                        urlVideoType === item?.id
                          ? "border-[#4365a7] text-[#4365a7]"
                          : "border-gray-400 text-gray-500"
                      }`}
                    >
                      <div key={item?.id}>{item?.label}</div>
                      <input
                        type="radio"
                        checked={urlVideoType === item?.id ? true : false}
                        className=""
                      ></input>
                    </div>
                  );
                })}
              </div>
            )}

            {urlVideoType === 2 ? (
              <ChooseImage
                setDuration={setDuration}
                duration={duration}
                accept={contentType === 1 ? "audio/*,video/*" : ".pdf"}
                setSelectedImage={setSelectedImage}
                selectedImage={selectedImage}
                title={contentType === 1 ? "Video" : "Pdf"}
                defaultUrl={editData?.thumbnail}
              />
            ) : (
              <div>
                <InputField
                  register={register}
                  name="url"
                  placeholder="Enter URL"
                  className="w-full text-sm text-gray-500"
                  defaultValue=""
                  label="URL"
                />
                <p className="text-red-600 text-xs">{error?.url}</p>
              </div>
            )}
            {contentType === 1 && urlVideoType === 2 && (
              <InputField
                disabled
                placeholder={duration.toFixed(0)}
                className="w-full text-sm text-gray-500"
                defaultValue=""
                label="Video Length"
              />
            )}

            <div>
              <CustomSelect
                options={levelOptions}
                placeholder={edit ? editData?.level : "Select level"}
                className={"w-full text-sm text-gray-500"}
                labelName={"Level"}
                setSelectedField={setSelectedLevel}
              />
              <p className="text-red-600 text-xs">
                {hasSubmittedClick && !selectedValue && !edit && "Required"}
                {error?.level}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Has Note ?</p>
              <Switch
                onClick={() => setHasNote(!hasNote)}
                checked={hasNote}
                className="bg-gray-300"
              />
            </div>
            {hasNote && (
              <div className="flex flex-col gap-4">
                <div>
                  <InputField
                    register={register}
                    name="noteTitle"
                    placeholder="Enter Note Title"
                    className="w-full text-sm text-gray-500"
                    defaultValue=""
                    required
                    label="Note Title"
                  />
                  <p className="text-red-600 text-xs">{error?.noteTitle}</p>
                </div>
                <div>
                  <p className="text-[#344054] leading-5 font-medium text-sm mb-1">
                    Description
                  </p>
                  <ReactQuill
                    theme="snow"
                    className="h-[100px] mb-10"
                    value={value}
                    onChange={setValue}
                  />
                </div>
                <ChooseImage
                  accept={".pdf"}
                  setSelectedImage={setSelectedNotePdf}
                  selectedImage={selectedNotePdf}
                  title={"Pdf"}
                  defaultUrl={editData?.notePdf}
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 w-full mt-8 gap-2">
            <Button
              buttonName={`${edit ? "Reset" : "Clear"}`}
              className={"w-full "}
              danger
              handleButtonClick={(e) => {
                handleClear(e);
              }}
              icon={""}
            />
            <Button
              type="submit"
              buttonName={`${edit ? "Edit" : "Add"} Content`}
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
