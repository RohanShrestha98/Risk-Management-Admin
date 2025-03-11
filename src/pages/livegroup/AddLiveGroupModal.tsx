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
import { useLiveGroupMutation } from "@/hooks/useMutateData";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useCourseData } from "@/hooks/useQueryData";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import ReactQuill from "react-quill";


export default function AddLiveGroupModal({ asChild, children, edit, editData }) {
    const [open, setOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState(edit ? editData?.course?.id : "")
    const [hasSubmittedClick, setHasSubmittedClick] = useState(false)
    const [error, setError] = useState("")
    const { data } = useCourseData("", "", "", "", open)
    const [value, setValue] = useState(edit ? editData?.description : "")
    const [isPackage, setIsPackage] = useState(edit ? editData?.isPackage : false)


    const courseOptions = convertToSelectOptions(data?.data)

    const fieldSchema = Yup.object().shape({
        title: Yup.string()
            .required("Required")
            .max(100, "Must be 100 characters or less"),
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
        }
    });

    useEffect(() => {
        reset({
            participantLimit: editData?.participantLimit,
            title: editData?.title,
            amount: editData?.amount,
        })
        setError()
    }, [editData, reset, open]);


    const liveGroupMutation = useLiveGroupMutation()



    const onSubmitHandler = async (data) => {
        const postData = {
            ...data,
            isPackage: isPackage,
            courseid: selectedCourse,
            description: value && value,
        }
        try {
            const response = await liveGroupMutation.mutateAsync([edit ? "patch" : "post", edit ? `update/${editData?.id}` : "create/", postData])
            setOpen(false)
            reset()
            setValue("")
            setError()
            toast.success(`Live Group ${edit ? "updated" : "added"} successfully`)
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
                <DialogTitle className="text-[#22244D] font-medium text-base mt-4 flex justify-between items-center">{edit ? "Edit" : "Add"} Live Group
                    <div className="flex items-center justify-end gap-1">
                        <input type="checkbox" onChange={() => setIsPackage(!isPackage)} checked={isPackage} />
                        <p className="text-[#344054] font-medium text-sm ">Make as a package </p>
                    </div>
                </DialogTitle>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="flex flex-col gap-4">
                        <div>
                            <InputField register={register} name="title" placeholder="Enter Live Group Name" className="w-full text-sm text-gray-500" defaultValue="" required label="Live Group Name" />
                            <p className="text-red-600 text-xs">
                                {errors?.title?.message ?? error?.title}
                            </p>
                        </div>
                        <div>
                            <CustomSelect options={courseOptions} placeholder={edit ? editData?.course?.courseID : selectedCourse ? selectedCourse : "Select course"} className={"w-full text-sm text-gray-500"} labelName={"Course"} required={true} setSelectedField={setSelectedCourse} />
                            <p className="text-red-600 text-xs">
                                {hasSubmittedClick && !selectedCourse && !edit && "Required"}
                            </p>
                        </div>


                        <div>
                            <p className="text-[#344054] leading-5 font-medium text-sm mb-1">Description <span className="text-red-600">*</span> </p>
                            <ReactQuill theme="snow" className="h-[100px] mb-10" value={value} onChange={setValue} />
                            <p className="text-red-600 text-xs">
                                {error?.description}
                            </p>
                        </div>

                        {
                            isPackage &&
                            <div>
                                <p className="text-[#22244D] font-medium text-base border-b-[1px] pb-2 ">Package details</p>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div>
                                        <InputField type="number" register={register} name="price" placeholder="Enter the price of the package" className="w-full text-sm text-gray-500" defaultValue="" label="Price" />
                                        <p className="text-red-600 text-xs">
                                            {error?.price}
                                        </p>
                                    </div>
                                    <div>
                                        <InputField type="number" register={register} name="period" placeholder="Enter the period of the package" className="w-full text-sm text-gray-500" defaultValue="" label="Period" />
                                        <p className="text-red-600 text-xs">
                                            {error?.period}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="grid grid-cols-2 w-full mt-10 gap-2">
                        <Button buttonName={"Clear"} className={"w-full "} danger handleButtonClick={(e) => {
                            handleClear(e)
                        }} icon={""} />
                        <Button type="submit" buttonName={`${edit ? "Edit" : "Add"} Live Group`} handleButtonClick={() => setHasSubmittedClick(true)} className={"w-full"} icon={""} />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
