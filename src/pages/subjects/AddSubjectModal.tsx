import ChooseImage from "@/components/ChooseImage"
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
import { useSubjectMutation } from "@/hooks/useMutateData";
import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useCourseData } from "@/hooks/useQueryData";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import toast from "react-hot-toast";


export default function AddSubjectModal({ asChild, children, edit, editData }) {
    const [open, setOpen] = useState(false)
    const { data } = useCourseData("", "", "", "", open)
    const [selectedCourse, setSelectedCourse] = useState(edit ? editData?.courseID : "")
    const [hasSubmittedClick, setHasSubmittedClick] = useState(false)
    const [selectedImage, setSelectedImage] = useState()
    const [error, setError] = useState()
    const [value, setValue] = useState(edit ? editData?.description : "")

    const fieldSchema = Yup.object().shape({
        title: Yup.string()
            .required("Required")
            .max(36, "Must be 36 characters or less"),
        subjectid: Yup.string()
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
            subjectid: editData?.subjectID,
            title: editData?.title,
        }
    });

    useEffect(() => {
        reset({
            subjectid: editData?.subjectID,
            title: editData?.title,
        })
        setError()
    }, [editData, reset, open]);

    const courseOptions = convertToSelectOptions(data?.data)
    const subjectMutation = useSubjectMutation()

    const onSubmitHandler = async (data) => {
        const postData = {
            ...data,
            file: selectedImage && selectedImage,
            courseid: selectedCourse,
            description: value,
        }
        try {
            const response = await subjectMutation.mutateAsync([edit ? "patch" : "post", edit ? `update/${editData?.id}` : "create/", postData])
            setOpen(false)
            reset()
            setSelectedImage()
            setError()
            toast.success(`Subject ${edit ? "updated" : "added"} successfully`)
        } catch (err) {
            console.log("err", err)
            setError(err?.response?.data?.errors)
        }
    }

    const handleClear = (e) => {
        e.preventDefault()
        setValue("")
        setSelectedImage()
        setSelectedCourse([])
        reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={asChild}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]  min-w-[500px] bg-[#FAFAFA]">
                <DialogTitle className="text-[#22244D] font-medium text-base">{edit ? "Edit" : "Add"} Subject</DialogTitle>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="flex flex-col gap-4">
                        <ChooseImage setSelectedImage={setSelectedImage} selectedImage={selectedImage} defaultUrl={editData?.thumbnail} />
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <CustomSelect options={courseOptions} placeholder={edit ? editData?.courseTitle : "Select course"}
                                    className={"w-full text-sm text-gray-500"} labelName={"Course"} required={true} setSelectedField={setSelectedCourse} />
                                <p className="text-red-600 text-xs">
                                    {hasSubmittedClick && !selectedCourse && !edit && "Required"}
                                </p>
                            </div>
                            <div className="">
                                <InputField register={register} name="subjectid" placeholder="Enter Subject Id" className="w-full text-sm text-gray-500" defaultValue="" required label="Subject ID" />
                                <p className="text-red-600 text-xs">
                                    {errors?.subjectid?.message ?? error?.subjectID}
                                </p>
                            </div>
                        </div>
                        <div className="">
                            <InputField register={register} name="title" placeholder="Enter Subject Name" className="w-full text-sm text-gray-500" defaultValue="" required label="Subject Name" />
                            <p className="text-red-600 text-xs">
                                {errors?.title?.message ?? error?.title}
                            </p>
                        </div>
                        <div>
                            <p className="text-[#344054] leading-5 font-medium text-sm mb-1">Description <span className="text-red-600">*</span> </p>
                            <ReactQuill theme="snow" className="h-[100px] mb-10" value={value} onChange={setValue} />
                        </div>

                    </div>
                    <div className="grid grid-cols-2 w-full mt-10 gap-2">
                        <Button buttonName={`${edit ? "Reset" : "Clear"}`} className={"w-full "} danger handleButtonClick={(e) => {
                            handleClear(e)
                        }} icon={""} />
                        <Button type="submit" buttonName={`${edit ? "Edit" : "Add"} Subject`} handleButtonClick={() => setHasSubmittedClick(true)} className={"w-full"} icon={""} />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
