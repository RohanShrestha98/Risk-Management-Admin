import ChooseImage from "@/components/ChooseImage"

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Button from "@/ui/Button"
import InputField from "@/ui/InputField"
import { useForm } from "react-hook-form";
import { useCategoryMutation } from "@/hooks/useMutateData";
import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import toast from "react-hot-toast";


export default function AddCourseGroupModal({ asChild, children, edit = false, editData }) {
    const [value, setValue] = useState(editData ? editData?.description : "")
    const [selectedImage, setSelectedImage] = useState()
    const [error, setError] = useState("")
    const [open, setOpen] = useState(false)


    const fieldSchema = Yup.object().shape({
        title: Yup.string()
            .required("Required")
            .max(100, "Must be 100 characters or less"),
        groupid: Yup.string()
            .required("Required")
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
            groupid: editData?.groupID,
            title: editData?.title,
        }
    });

    useEffect(() => {
        reset({
            groupid: editData?.groupID,
            title: editData?.title,
        })
        setError()
    }, [editData, reset, open]);

    const categoryMutation = useCategoryMutation()

    const onSubmitHandler = async (data) => {
        const postData = {
            ...data,
            file: selectedImage && selectedImage,
            description: value,
        }
        try {
            const response = await categoryMutation.mutateAsync([`${edit ? "patch" : "post"}`, edit ? `update/${editData?.id}` : "create/", postData])
            setOpen(false)
            reset()
            setError()
            toast.success(`Category ${edit ? "updated" : "added"} successfully`)
        } catch (err) {
            console.log("err", err)
            if (err?.response?.data?.errors?.error) {
                toast.error(err?.response?.data?.errors?.error)
            }
            setError(err?.response?.data?.errors)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={asChild}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]  min-w-[500px] bg-[#FAFAFA]">
                <DialogTitle className="text-[#22244D] font-medium text-base">{edit ? "Edit" : "Add"} Course Group</DialogTitle>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="flex flex-col gap-4">
                        <ChooseImage setSelectedImage={setSelectedImage} selectedImage={selectedImage} defaultUrl={editData?.thumbnail} />
                        <div className="grid grid-cols-2 gap-2">
                            <div className="">
                                <InputField register={register} name="groupid" placeholder="Enter Group Id" className="w-full text-sm text-gray-500" defaultValue="" required label="Course Group ID" />
                                <p className="text-red-600 text-xs">
                                    {errors?.groupid?.message ?? error?.groupID}
                                </p>
                            </div>
                            <div className="">
                                <InputField register={register} name="title" placeholder="Enter Category Name" className="w-full text-sm text-gray-500" defaultValue="" required label="Course Group Name" />
                                <p className="text-red-600 text-xs">
                                    {errors?.title?.message ?? error?.title}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[#344054] leading-5 font-medium text-sm mb-1">Description <span className="text-red-600">*</span> </p>
                            <ReactQuill theme="snow" className="h-[100px] mb-10" value={value} onChange={setValue} />
                        </div>

                    </div>
                    <div className="grid grid-cols-2 w-full mt-28 gap-2">
                        <Button buttonName={`${edit ? "Reset" : "Clear"}`} className={"w-full "} danger handleButtonClick={(e) => {
                            reset()
                            setSelectedImage()
                            setValue()
                            e.preventDefault()
                        }} icon={""} />
                        <Button type="submit" buttonName={`${edit ? "Edit" : "Add"} Category`} handleButtonClick={() => { }} className={"w-full"} icon={""} />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
