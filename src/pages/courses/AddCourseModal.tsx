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
import { useCourseMutation } from "@/hooks/useMutateData";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useCourseGroupData } from "@/hooks/useQueryData";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import toast from "react-hot-toast";


export default function AddCourseModal({ asChild, children, edit, editData }) {
    const [open, setOpen] = useState(false)
    const { data } = useCourseGroupData("", "", "", "", open)
    const [selectedCategory, setSelectedCategory] = useState(edit ? editData?.courseGroup?.id : "")
    const [hasSubmittedClick, setHasSubmittedClick] = useState(false)
    const [selectedImage, setSelectedImage] = useState()
    const [value, setValue] = useState(edit ? editData?.description : "")
    const [error, setError] = useState("")
    const [isAvailable, setIsAvailable] = useState(edit ? editData?.available : true)

    const fieldSchema = Yup.object().shape({
        title: Yup.string()
            .required("Required")
            .max(50, "Must be 36 characters or less"),
        courseid: Yup.string()
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
            courseid: editData?.courseID,
            title: editData?.title,
        }
    });

    useEffect(() => {
        reset({
            courseid: editData?.courseID,
            title: editData?.title,
        })
        setError()
    }, [editData, reset, open]);


    const categoryOptions = convertToSelectOptions(data?.data)
    const courseMutation = useCourseMutation()

    const onSubmitHandler = async (data) => {
        const postData = {
            ...data,
            file: selectedImage && selectedImage,
            available: isAvailable,
            coursegroupid: selectedCategory,
            description: value,
        }
        try {
            const response = await courseMutation.mutateAsync([edit ? "patch" : "post", edit ? `update/${editData?.id}` : "create/", postData])
            setOpen(false)
            reset()
            setError()
            toast.success(`Course ${edit ? "updated" : "added"} successfully`)
        } catch (err) {
            console.log("err", err)
            setError(err?.response?.data?.errors)
        }
    }

    const handleClear = (e) => {
        e.preventDefault()
        setValue("")
        setSelectedImage("")
        reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={asChild}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]  min-w-[500px] bg-[#FAFAFA]">
                <DialogTitle className="text-[#22244D] font-medium text-base">{edit ? "Edit" : "Add"} Course</DialogTitle>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="flex flex-col gap-4">
                        <ChooseImage setSelectedImage={setSelectedImage} selectedImage={selectedImage} defaultUrl={editData?.thumbnail} />
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <CustomSelect options={categoryOptions} placeholder={edit ? editData?.courseGroup?.title : "Select course group"} className={"w-full text-sm text-gray-500"} labelName={"Course Group"} required={true} setSelectedField={setSelectedCategory} />
                                <p className="text-red-600 text-xs">
                                    {hasSubmittedClick && !selectedCategory && "Required"}
                                </p>
                            </div>
                            <div>
                                <InputField register={register} name="courseid" placeholder="Enter Course ID" className="w-full text-sm text-gray-500" defaultValue="" required label="Course ID" />
                                <p className="text-red-600 text-xs">
                                    {errors?.courseid?.message ?? error?.courseID}
                                </p>
                            </div>
                        </div>
                        <div className="">
                            <InputField register={register} name="title" placeholder="Enter Course Name" className="w-full text-sm text-gray-500" defaultValue="" required label="Course Name" />
                            <p className="text-red-600 text-xs">
                                {errors?.title?.message ?? error?.title}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">Is Available ?</p>
                            <Switch onClick={() => setIsAvailable(!isAvailable)} checked={isAvailable} className="bg-gray-300" />
                        </div>
                        <div>
                            <p className="text-[#344054] leading-5 font-medium text-sm mb-1">Description <span className="text-red-600">*</span> </p>
                            <ReactQuill theme="snow" className="h-[110px] mb-10" value={value} onChange={setValue} />
                        </div>


                    </div>
                    <div className="grid grid-cols-2 w-full mt-10 gap-2">
                        <Button buttonName={"Clear"} className={"w-full "} danger handleButtonClick={(e) => {
                            handleClear(e)
                        }} icon={""} />
                        <Button type="submit" buttonName={`${edit ? "Edit" : "Add"} Course`} handleButtonClick={() => setHasSubmittedClick(true)} className={"w-full"} icon={""} />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
