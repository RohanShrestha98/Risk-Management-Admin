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
import { useQuestionBankMutation } from "@/hooks/useMutateData";
import { useEffect, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { useCourseData } from "@/hooks/useQueryData";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import ReactQuill from "react-quill";
import toast from "react-hot-toast";


export default function AddQuestionBankModal({ asChild, children, edit, editData }) {
    const [open, setOpen] = useState(false)
    const { data } = useCourseData("", "", "", "", open)
    const [selectedCourse, setSelectedCourse] = useState(edit ? editData?.courseGroup?.id : "")
    const [error, setError] = useState();
    const [hasSubmittedClick, setHasSubmittedClick] = useState(false)
    const [selectedImage, setSelectedImage] = useState()
    const [value, setValue] = useState(edit ? editData?.description : "")


    const fieldSchema = Yup.object().shape({
        title: Yup.string()
            .required("Required")
            .max(36, "Must be 36 characters or less"),
        marks: Yup.string()
            .required("Required"),
        totalQuestions: Yup.string()
            .required("Required"),
    });

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(fieldSchema),
        defaultValues: {
            title: editData?.title,
            marks: editData?.marks,
            totalQuestions: editData?.totalQuestions,
        }
    });

    useEffect(() => {
        reset({
            title: editData?.title,
            marks: editData?.marks,
            totalQuestions: editData?.totalQuestions,
        })
        setError()
    }, [editData, reset, open]);


    const courseOptions = convertToSelectOptions(data?.data)
    const questionBankMutation = useQuestionBankMutation()

    const onSubmitHandler = async (data) => {
        const postData = {
            ...data,
            description: value && value,
            courseid: selectedCourse ?? editData?.course?.id,
            file: selectedImage && selectedImage,
        }
        try {
            const response = await questionBankMutation.mutateAsync([edit ? "patch" : "post", edit ? `update/${editData?.id}` : "create/", postData])
            setOpen(false)
            reset()
            toast.success(`Question set ${edit ? "updated" : "added"} successfully`)
            setError()
        } catch (err) {
            console.log("err", err)
            setError(err?.response?.data?.errors)
        }
    }

    const handleClear = (e) => {
        e.preventDefault()
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
                <DialogTitle className="text-[#22244D] font-medium text-base">{edit ? "Edit" : "Add"} Question Set</DialogTitle>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="flex flex-col gap-4">
                        <div>
                            <InputField register={register} name="title" placeholder="Write question set name" className="w-full text-sm text-gray-500" defaultValue="" required label="Question Set name" />
                            <p className="text-red-600 text-xs">
                                {errors?.title?.message ?? error?.title}
                            </p>
                        </div>
                        <div>
                            {/* <InputField register={register} name="description" placeholder="Enter question description" className="w-full text-sm text-gray-500" defaultValue="" required label="Description" /> */}
                            <p className="text-[#344054] leading-5 font-medium text-sm mb-1">Description <span className="text-red-600">*</span> </p>
                            <ReactQuill theme="snow" className="h-[100px] mb-10" value={value} onChange={setValue} />
                            <p className="text-red-600 text-xs">
                                {error?.description}
                            </p>

                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <InputField register={register} type={"number"} disabled={edit} name="totalQuestions" placeholder="Enter the total number of questions" className="w-full text-sm text-gray-500" defaultValue="" required label="Total Questions" />
                                <p className="text-red-600 text-xs">
                                    {errors?.totalQuestions?.message ?? error?.totalQuestions}
                                </p>
                            </div>
                            <div>
                                <InputField register={register} type={"number"} name="marks" placeholder="Enter total marks" className="w-full text-sm text-gray-500" defaultValue="" required label="Marks" />
                                <p className="text-red-600 text-xs">
                                    {errors?.marks?.message ?? error?.marks}
                                </p>
                            </div>
                            <div>
                                <CustomSelect options={courseOptions}
                                    placeholder={edit ? editData?.course?.courseID : "Select course"}
                                    className={"w-full text-sm text-gray-500"} labelName={"Course"}
                                    required={true} setSelectedField={setSelectedCourse} />

                                <p className="text-red-600 text-xs">
                                    {!edit && hasSubmittedClick && !selectedCourse && "Required"}
                                </p>
                            </div>
                            <ChooseImage setSelectedImage={setSelectedImage} title={"File"} selectedImage={selectedImage} defaultUrl={editData?.thumbnail} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 w-full mt-20 gap-2">
                        <Button buttonName={`${edit ? "Reset" : "Clear"}`} className={"w-full "} danger handleButtonClick={(e) => {
                            handleClear(e)
                        }} icon={""} />
                        <Button type="submit" buttonName={`${edit ? "Edit" : "Add"} Question Set`} handleButtonClick={() => setHasSubmittedClick(true)} className={"w-full"} icon={""} />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
