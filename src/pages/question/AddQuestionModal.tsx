import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Button from "@/ui/Button"
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useQuestionMutation } from "@/hooks/useMutateData";
import { useEffect, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { useCourseData, useSubjectData } from "@/hooks/useQueryData";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import { Switch } from "@/components/ui/switch";
import CustomSelect from "@/ui/CustomSelect";
import ReactQuill from "react-quill";
import FileUpload from "@/components/FileUpload";
import toast from "react-hot-toast";


export default function AddQuestionModal({ asChild, children, edit, editData }) {
    const [open, setOpen] = useState(false)
    const { data } = useCourseData("", "", "", "", open)
    const [selectedCourse, setSelectedCourse] = useState(edit ? editData?.course?.id : "")
    const { data: subjectData } = useSubjectData("", selectedCourse, "", "", open)
    const [selectedSubject, setSelectedSubject] = useState(edit ? editData?.subject?.id : "")
    const [hasSubmittedClick, setHasSubmittedClick] = useState(false)
    const [forTest, setForTest] = useState(editData?.forTest ?? false)
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [selectedAnswer, setSelectedAnswer] = useState(edit ? editData?.answer : "")


    const fieldSchema = Yup.object().shape({
        title: Yup.string()
            .required("Required")
            .max(36, "Must be 36 characters or less"),
    });

    const {
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(fieldSchema),
        defaultValues: {
            title: editData?.title,
            description: editData?.description,
        }
    });

    useEffect(() => {
        reset({
            title: editData?.title,
            description: editData?.description,
        })
        setHasSubmittedClick(false)
        setError()
    }, [editData, reset, open]);

    const courseOptions = convertToSelectOptions(data?.data)
    const subjectOptions = convertToSelectOptions(subjectData?.data)
    const questionMutation = useQuestionMutation()

    const onSubmitHandler = async (data) => {
        setIsLoading(true)
        const transformObject = (inputObject) => {
            const multipleOption = [];

            for (let i = 1; i <= 4; i++) {
                const optionkey = `_${i}title`;
                const audioKey = `_${i}audio`;
                const imageKey = `_${i}image`;

                const optionMultiple = {
                    title: (inputObject[optionkey] && !editData) ? inputObject[optionkey] : (inputObject[optionkey] && editData) ? inputObject[optionkey] : editData?.options?.[i - 1]?.title === "" ? undefined : editData?.options?.[i - 1]?.title,
                    audio: (inputObject[audioKey] && !editData) ? inputObject[audioKey] : (inputObject[audioKey] && editData) ? inputObject[audioKey] : editData?.options?.[i - 1]?.audio === "" ? undefined : editData?.options?.[i - 1]?.audio,
                    image: (inputObject[imageKey] && !editData) ? inputObject[imageKey] : (inputObject[imageKey] && editData) ? inputObject[imageKey] : editData?.options?.[i - 1]?.image === "" ? undefined : editData?.options?.[i - 1]?.image,
                };
                multipleOption.push(optionMultiple);
            }
            return multipleOption;
        };

        const transformedObject = transformObject(data);
        const postData = {
            options: transformedObject ?? editData?.options,
            title: data?.title,
            description: data?.description,
            answer: selectedAnswer,
            forTest: forTest,
            subjectID: selectedSubject,
        }
        // setIsLoading(true);
        try {
            const result = await questionMutation.mutateAsync([`${edit ? "patch" : "post"}`, edit ? `update/${editData?.id}` : "create/", postData]);
            setIsLoading(false);
            toast.success(`Question ${edit ? "updated" : "added"} successfully`);
            setSelectedSubject("")
            setOpen(false)
            setError()
            reset()
        } catch (error) {
            setIsLoading(false);
            error?.response?.data?.errors?.error && toast.error(error?.response?.data?.errors?.error);
            setError(error?.response?.data?.errors);
        }
    };


    const answerOptions = [
        {
            label: "Option A",
            value: "a"
        },
        {
            label: "Option B",
            value: "b"
        },
        {
            label: "Option C",
            value: "c"
        },
        {
            label: "Option D",
            value: "d"
        }
    ]

    const options = [
        {
            id: "1",
            label: "Option A",
            registerName: "optionA"
        },
        {
            id: "2",
            label: "Option B",
            registerName: "optionB"
        },
        {
            id: "3",
            label: "Option C",
            registerName: "optionC"
        },
        {
            id: "4",
            label: "Option D",
            registerName: "optionD"
        },
    ]



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={asChild}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] lg:max-w-[425px] lg:min-w-[450px]  min-w-[700px] bg-[#FAFAFA]">
                <DialogTitle className="text-[#22244D] font-medium text-base">{edit ? "Edit" : "Add"} Question</DialogTitle>
                <form onSubmit={handleSubmit(selectedSubject && onSubmitHandler)} className="border  p-4 ">
                    <div className="flex flex-col gap-4 mt-4  h-[70vh] overflow-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <CustomSelect options={courseOptions} placeholder={edit ? editData?.course?.title : "Select a course"} className={"w-full text-sm text-gray-500"} labelName={"Course"} setSelectedField={setSelectedCourse} />
                            </div>
                            <div>
                                <CustomSelect options={subjectOptions} placeholder={edit ? editData?.subject?.title : "Select subject"} className={"w-full text-sm text-gray-500"} labelName={"Subject"} required={true} setSelectedField={setSelectedSubject} />
                                <p className="text-red-600 text-xs">
                                    {(hasSubmittedClick && !selectedSubject) ? "Required" : error?.subjectid}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 xlg:grid-cols-1 gap-4 mb-4">
                            <div className="flex flex-col gap-1">
                                <h1 className="font-medium text-base text-[#344054]">Question <span className="text-red-600">*</span></h1>
                                <ReactQuill value={watch(`title`)} theme="snow" className="h-[100px] mb-10 lg:mb-16" onChange={(e) => setValue(`title`, e)} />
                                <p className="text-red-600 text-xs">
                                    {errors?.title?.message ?? error?.title}
                                </p>
                            </div>
                        </div>
                        {
                            editData ?
                                <div className="grid grid-cols-2 xlg:grid-cols-1 gap-4">
                                    {
                                        editData?.options?.map((item, index) => {
                                            return <div key={index} className="flex flex-col gap-2 mb-6">
                                                <div className="flex items-center justify-between">
                                                    <h1 className="font-medium text-base text-[#344054]">{options?.[index]?.label} <span className="text-red-600">*</span></h1>
                                                </div>
                                                <FileUpload watch={watch} title={"audio"} accept={"audio/*"} defaultUrl={item?.audio} setValue={setValue} registerName={`_${index + 1}audio`} />
                                                <FileUpload watch={watch} title={"image"} defaultUrl={item?.image} setValue={setValue} registerName={`_${index + 1}image`} />
                                                <ReactQuill value={item?.title} theme="snow" className="h-[100px] mb-10" onChange={(e) => setValue(`_${index + 1}title`, e)} />

                                            </div>
                                        })
                                    }
                                    <p className="text-red-600 text-xs">
                                        {error?.options}
                                    </p>
                                </div> :
                                <div className="grid grid-cols-2 xlg:grid-cols-1 gap-4">
                                    {
                                        options?.map((item, index) => {
                                            return <div key={index} className="flex flex-col gap-2 mb-6">
                                                <div className="flex items-center justify-between">
                                                    <h1 className="font-medium text-base text-[#344054]">{item?.label} <span className="text-red-600">*</span></h1>
                                                    {/* <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium">is File ?</p>
                                                        <Switch onClick={(e) => {
                                                            setValue(`_${index + 1}checkbox`, e?.target?.ariaChecked)
                                                        }} />
                                                    </div> */}
                                                </div>
                                                <FileUpload watch={watch} title={"audio"} accept={"audio/*"} setValue={setValue} registerName={`_${index + 1}audio`} />
                                                <FileUpload watch={watch} title={"image"} setValue={setValue} registerName={`_${index + 1}image`} />
                                                <ReactQuill value={watch(`_${index + 1}title`)} theme="snow" className="h-[100px] mb-10" onChange={(e) => setValue(`_${index + 1}title`, e)} />
                                            </div>
                                        })
                                    }
                                    <p className="text-red-600 text-xs">
                                        {error?.options}
                                    </p>
                                </div>
                        }
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">For Test ?</p>
                            <Switch onClick={() => setForTest(!forTest)} checked={forTest} />
                        </div>

                        <div className="mb-8">
                            <CustomSelect options={answerOptions} placeholder={edit ? editData?.answer : "Select answer"} className={"w-full text-sm text-gray-500"} labelName={"Answer"} required={true} setSelectedField={setSelectedAnswer} />
                            <p className="text-red-600 text-xs">
                                {hasSubmittedClick && !selectedAnswer && !edit && "Required"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-end mt-2">
                        <Button loading={isLoading} buttonName={`${edit ? "Edit" : "Add"} Question`} className={"w-full "} handleButtonClick={() => { setHasSubmittedClick(true) }} icon={""} />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
