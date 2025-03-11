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
import { useChapterMutation } from "@/hooks/useMutateData";
import { useEffect, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { useUnitData } from "@/hooks/useQueryData";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import toast from "react-hot-toast";

export default function AddChapterModal({ asChild, children, edit, editData }) {
    const [open, setOpen] = useState(false)
    const { data } = useUnitData("", "", "", "", open)
    const [selectedUnit, setSelectedUnit] = useState(edit ? editData?.unit?.id : "")
    const [hasSubmittedClick, setHasSubmittedClick] = useState(false)
    const [error, setError] = useState()


    const fieldSchema = Yup.object().shape({
        title: Yup.string()
            .required("Required")
            .max(100, "Must be 100 characters or less"),
        position: Yup.string()
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
            position: editData?.position,
            title: editData?.title,
        }
    });


    useEffect(() => {
        reset({
            position: editData?.position,
            title: editData?.title,
        })
        setError()
    }, [editData, reset, open]);


    const unitOptions = convertToSelectOptions(data?.data)
    const selectedValue = unitOptions?.filter((item) => item?.value == selectedUnit)
    const chapterMutation = useChapterMutation()


    const onSubmitHandler = async (data) => {
        const postData = {
            ...data,
            unitid: selectedUnit,
        }
        try {
            const response = await chapterMutation.mutateAsync([edit ? "patch" : "post", edit ? `update/${editData?.id}` : "create/", postData])
            setOpen(false)
            reset()
            setError()
            toast.success(`Chapter ${edit ? "updated" : "added"} successfully`)
        } catch (err) {
            console.log("err", err)
            setError(err?.response?.data?.errors)
        }
    }

    const handleClear = (e) => {
        e.preventDefault()
        setSelectedUnit([])
        reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={asChild}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]  min-w-[500px] bg-[#FAFAFA]">
                <DialogTitle className="text-[#22244D] font-medium text-base">{edit ? "Edit" : "Add"} Chapter</DialogTitle>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <InputField register={register} name="title" placeholder="Enter Chapter Name" className="w-full text-sm text-gray-500" defaultValue="" required label="Chapter Name" />
                                <p className="text-red-600 text-xs">
                                    {errors?.title?.message ?? error?.title}
                                </p>
                            </div>
                            <div>
                                <CustomSelect options={unitOptions} placeholder={edit ? editData?.unit?.title : selectedUnit ? selectedValue : "Select Unit"} className={"w-full text-sm text-gray-500"} labelName={"Unit"} required={true} setSelectedField={setSelectedUnit} />
                                <p className="text-red-600 text-xs">
                                    {hasSubmittedClick && !selectedUnit && !edit && "Required"}
                                </p>
                            </div>
                        </div>
                        <div className="">
                            <InputField register={register} type="number" name="position" placeholder="Enter position" className="w-full text-sm text-gray-500" defaultValue="" required label="Position" />
                            <p className="text-red-600 text-xs">
                                {errors?.position?.message ?? error?.position}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 w-full mt-28 gap-2">
                        <Button buttonName={`${edit ? "Reset" : "Clear"}`} className={"w-full "} danger handleButtonClick={(e) => {
                            handleClear(e)
                        }} icon={""} />
                        <Button type="submit" buttonName={`${edit ? "Edit" : "Add"} Chapter`} handleButtonClick={() => setHasSubmittedClick(true)} className={"w-full"} icon={""} />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
