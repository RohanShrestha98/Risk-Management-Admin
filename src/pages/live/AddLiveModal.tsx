import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Button from "@/ui/Button"
import CustomSelect from "@/ui/CustomSelect"
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputField from "@/ui/InputField"
import { useForm } from "react-hook-form";
import { useLiveMutation } from "@/hooks/useMutateData";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useCourseData, useLiveGroupData, useSubjectData } from "@/hooks/useQueryData";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import moment from "moment";
import { Switch } from "@/components/ui/switch";


export default function AddLiveModal({ asChild, children, edit, editData }) {
    const [open, setOpen] = useState(false)
    const [selectedLiveGroup, setSelectedLiveGroup] = useState(edit ? editData?.liveGroup?.id : "")
    const [selectedType, setSelectedType] = useState(edit ? editData?.type : "")
    const [selectedEmail, setSelectedEmail] = useState(edit ? editData?.email : "")
    const [hasSubmittedClick, setHasSubmittedClick] = useState(false)
    const [error, setError] = useState("")
    const [isLive, setIsLive] = useState(editData?.isLive)
    const [isPackage, setIsPackage] = useState(editData?.isPackage)
    const [isFree, setIsFree] = useState(editData?.isFree)
    const { data } = useLiveGroupData("", "", "", "", open)
    const { data: courseData } = useCourseData("", "", "", "", open)
    const [selectedCourse, setSelectedCourse] = useState(edit ? editData?.course?.id : "")
    const { data: subjectData } = useSubjectData("", selectedCourse, "", "", open)
    const [selectedSubject, setSelectedSubject] = useState(edit ? editData?.subject?.id : "")

    const liveGroupOptions = convertToSelectOptions(data?.data)
    const courseOptions = convertToSelectOptions(courseData?.data)
    const subjectOptions = convertToSelectOptions(subjectData?.data)

    const typeOptions = [
        {
            label: "Scheduled meeting",
            value: 2,
        },
        {
            label: "Recurring meeting",
            value: 8,
        }
    ]
    const emailOptions = [
        {
            label: "xyz@gmail.com",
            value: "xyz@gmail.com"
        },
        {
            label: "abc@gmail.com",
            value: "abc@gmail.com"
        }
    ]

    const fieldSchema = Yup.object().shape({
        topic: Yup.string()
            .required("Required")
            .max(100, "Must be 100 characters or less"),
        start_time: Yup.string()
            .required("Required"),
        endDateTime: Yup.string()
            .required("Required"),
        duration: Yup.string()
            .required("Required"),
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
            start_time: editData?.start_time?.slice(0, 16),
            topic: editData?.topic,
            duration: editData?.duration,
            endDateTime: editData?.endDateTime?.slice(0, 16),
        }
    });

    useEffect(() => {
        reset({
            start_time: editData?.start_time?.slice(0, 16),
            topic: editData?.topic,
            duration: editData?.duration,
            email: editData?.email,
            endDateTime: editData?.endDateTime?.slice(0, 16),
        })
        setError()
    }, [editData, reset, open]);


    const liveMutation = useLiveMutation()



    const onSubmitHandler = async (data) => {
        const postData = {
            ...data,
            duration: parseInt(data?.duration),
            type: parseInt(selectedType),
            email: selectedEmail,
            courseid: parseInt(selectedCourse),
            subjectid: parseInt(selectedSubject),
            livegroupid: parseInt(selectedLiveGroup),
            start_time: moment(data?.start_time).format(),
            endDateTime: moment(data?.endDateTime).format(),
            meetingID: editData?.meetingID,
            isPackage: isPackage,
            isLive: isLive,
            isFree: isFree,
        }
        try {
            const response = await liveMutation.mutateAsync([edit ? "patch" : "post", edit ? `update/${editData?.id}` : "create/", postData])
            setOpen(false)
            reset()
            setError()
            toast.success(`Live ${edit ? "updated" : "added"} successfully`)
        } catch (err) {
            console.log("err", err)
            {
                err?.response?.data?.errors?.error && toast.error(err?.response?.data?.errors?.error)
            }
            setError(err?.response?.data?.errors)
        }
    }

    const handleClear = (e) => {
        e.preventDefault()
        reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={asChild}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]  min-w-[500px] bg-[#FAFAFA]">
                <DialogTitle className="text-[#22244D] font-medium text-base flex items-center justify-between mt-4">{edit ? "Edit" : "Add"} Live
                    <div className="flex items-center justify-end gap-1">
                        <input type="checkbox" onChange={() => setIsPackage(!isPackage)} checked={isPackage} />
                        <p className="text-[#344054] font-medium text-sm ">Make as a package </p>
                    </div></DialogTitle>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-2">
                            <CustomSelect options={courseOptions} placeholder={edit ? editData?.course?.courseID : "Select course"} className={"w-full text-sm text-gray-500"} labelName={"Course"} setSelectedField={setSelectedCourse} />
                            <div>
                                <CustomSelect options={subjectOptions} placeholder={edit ? editData?.subject?.title : "Select subject"} className={"w-full text-sm text-gray-500"} labelName={"Subject"} required={true} setSelectedField={setSelectedSubject} />
                                <p className="text-red-600 text-xs">
                                    {hasSubmittedClick && !selectedSubject && !edit && "Required"}
                                </p>
                            </div>
                        </div>
                        <div>
                            <InputField register={register} name="topic" placeholder="Enter live topic" className="w-full text-sm text-gray-500" defaultValue="" required label="Live Topic" />
                            <p className="text-red-600 text-xs">
                                {errors?.topic?.message ?? error?.topic}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <CustomSelect options={liveGroupOptions} placeholder={edit ? editData?.liveGroup?.title : "Select live group"} className={"w-full text-sm text-gray-500"} labelName={"Live Group"} required={true} setSelectedField={setSelectedLiveGroup} />
                                <p className="text-red-600 text-xs">
                                    {hasSubmittedClick && !selectedLiveGroup && !edit && "Required"}
                                </p>
                            </div>
                            <div>
                                <CustomSelect options={typeOptions} placeholder={edit ? editData?.type : selectedType ? selectedType : "Select type"} className={"w-full text-sm text-gray-500"} labelName={"Type"} required={true} setSelectedField={setSelectedType} />
                                <p className="text-red-600 text-xs">
                                    {hasSubmittedClick && !selectedType && !edit && "Required"}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <InputField type="datetime-local" register={register} name="start_time" className="w-full text-sm text-gray-500" defaultValue="" required label="Start Time" />
                                <p className="text-red-600 text-xs">
                                    {errors?.start_time?.message ?? error?.start_time}
                                </p>
                            </div>
                            <div>
                                <InputField type="datetime-local" register={register} name="endDateTime" className="w-full text-sm text-gray-500" defaultValue="" required label="End time" />
                                <p className="text-red-600 text-xs">
                                    {errors?.endDateTime?.message ?? error?.endDateTime}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">Is live ?</p>
                                <Switch onClick={() => setIsLive(!isLive)} checked={isLive} className="bg-gray-300" />
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">Is Free ?</p>
                                <Switch onClick={() => setIsFree(!isFree)} checked={isFree} className="bg-gray-300" />
                            </div>

                        </div>
                        <div >
                            <InputField type="number" register={register} name="duration" placeholder="Enter duration" className="w-full text-sm text-gray-500" defaultValue="" required label="Duration" />
                            <p className="text-red-600 text-xs">
                                {errors?.duration?.message ?? error?.duration}
                            </p>
                        </div>
                        <div>
                            <CustomSelect options={emailOptions} placeholder={edit ? editData?.email : "Select email"} className={"w-full text-sm text-gray-500"} labelName={"Email"} required={true} setSelectedField={setSelectedEmail} />
                            <p className="text-red-600 text-xs">
                                {hasSubmittedClick && !selectedEmail && !edit && "Required"}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 w-full mt-10 gap-2">
                        <Button buttonName={edit ? "Reset" : "Clear"} className={"w-full "} danger handleButtonClick={(e) => {
                            handleClear(e)
                        }} icon={""} />
                        <Button type="submit" buttonName={`${edit ? "Edit" : "Add"} Live`} handleButtonClick={() => setHasSubmittedClick(true)} className={"w-full"} icon={""} />
                    </div>
                </form>
            </DialogContent>
        </Dialog >
    )
}
