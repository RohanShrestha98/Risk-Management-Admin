import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Button from "@/ui/Button"
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputField from "@/ui/InputField"
import { useForm } from "react-hook-form";
import { useTestSeriesMutation, useTestTypeMutation } from "@/hooks/useMutateData";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import CustomSelect from "@/ui/CustomSelect";
import { useCourseData } from "@/hooks/useQueryData";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import { Switch } from "@/components/ui/switch";


export default function AddTestSeriesModal({ asChild, children, edit, editData }) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState()
    const [value, setValue] = useState(edit ? editData?.description : "")
    const [hasSubmittedClick, setHasSubmittedClick] = useState(false)
    const [isPackage, setIsPackage] = useState(edit ? editData?.isPremium : false)
    const [selectedCourse, setSelectedCourse] = useState(edit ? editData?.course?.id : "")
    const { data } = useCourseData("", "", "", "", open)
    const courseOptions = convertToSelectOptions(data?.data)

    const fieldSchema = Yup.object().shape({
        title: Yup.string()
            .required("Required")
            .max(36, "Must be 36 characters or less"),
        noOfTests: Yup.string()
            .required("Required"),
        startDate: Yup.string()
            .required("Required")
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
            noOfTests: editData?.noOfTests,
            startDate: editData?.startDate?.slice(0, 16),
        }
    });

    useEffect(() => {
        reset({
            title: editData?.title,
            noOfTests: editData?.noOfTests,
            startDate: editData?.startDate?.slice(0, 16),
        })
        setError()
        setValue("")
    }, [editData, reset, open]);

    const testSeriesMutation = useTestSeriesMutation()

    const onSubmitHandler = async (data) => {
        const postData = {
            ...data,
            description: value,
            isPackage: isPackage,
            startDate: `${data?.startDate}:00Z`,
            courseid: selectedCourse,
        }
        try {
            const response = await testSeriesMutation.mutateAsync([edit ? "patch" : "post", edit ? `update/${editData?.id}` : "create/", postData])
            setOpen(false)
            reset()
            setError()
            toast.success(`Test series ${edit ? "updated" : "added"} successfully`)
        } catch (err) {
            console.log("err", err)
            setError(err?.response?.data?.errors)
        }
    }

    const handleClear = (e) => {
        e.preventDefault()
        reset()
        setValue("")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={asChild}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]  min-w-[500px] bg-[#FAFAFA]">
                <DialogTitle className="text-[#22244D] font-medium text-base mt-4  flex justify-between items-center">{edit ? "Edit" : "Add"} Test Series
                    <div className="flex items-center justify-end gap-1">
                        <input type="checkbox" onChange={() => setIsPackage(!isPackage)} checked={isPackage} />
                        <p className="text-[#344054] font-medium text-sm ">Make as a package </p>
                    </div>
                </DialogTitle>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="">
                        <InputField register={register} name="title" placeholder="Enter Test Series Name" className="w-full text-sm text-gray-500" defaultValue="" required label="Test Series Name" />
                        <p className="text-red-600 text-xs">
                            {errors?.title?.message ?? error?.title}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="">
                            <InputField register={register} type="number" name="noOfTests" placeholder="Enter no of tests" className="w-full text-sm text-gray-500" defaultValue="" required label="Number of test" />
                            <p className="text-red-600 text-xs">
                                {errors?.noOfTests?.message ?? error?.noOfTests}
                            </p>
                        </div>
                        <div>
                            <CustomSelect options={courseOptions} placeholder={edit ? editData?.course?.courseID : "Select course"}
                                className={"w-full text-sm text-gray-500"} labelName={"Course"} required={true} setSelectedField={setSelectedCourse} />
                            <p className="text-red-600 text-xs">
                                {hasSubmittedClick && !selectedCourse && !edit && "Required"}
                            </p>
                        </div>
                        <div>
                            <InputField register={register} type="datetime-local" name="startDate" className="w-full text-sm text-gray-500" defaultValue="" required label="Start Date" />
                            <p className="text-red-600 text-xs">
                                {errors?.startDate?.message ?? error?.startDate}
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[#344054] leading-5 font-medium text-sm mb-1">Description <span className="text-red-600">*</span> </p>
                        <ReactQuill theme="snow" className="h-[100px] mb-10" value={value} onChange={setValue} />
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

                    <div className="grid grid-cols-2 w-full mt-6 gap-2">
                        <Button buttonName={"Clear"} className={"w-full "} danger handleButtonClick={(e) => {
                            handleClear(e)
                        }} icon={""} />
                        <Button type="submit" buttonName={`${edit ? "Edit" : "Add"} Test Series`} handleButtonClick={() => { setHasSubmittedClick(true) }} className={"w-full"} icon={""} />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
