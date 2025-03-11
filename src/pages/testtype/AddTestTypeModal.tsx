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
import { useTestTypeMutation } from "@/hooks/useMutateData";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


export default function AddTestTypeModal({ asChild, children, edit, editData }) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState()

    const fieldSchema = Yup.object().shape({
        title: Yup.string()
            .required("Required")
            .max(36, "Must be 36 characters or less"),
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
            title: editData?.Title,
        }
    });

    useEffect(() => {
        reset({
            title: editData?.Title,
        })
        setError()
    }, [editData, reset, open]);

    const testTypeMutation = useTestTypeMutation()

    const onSubmitHandler = async (data) => {

        try {
            const response = await testTypeMutation.mutateAsync([edit ? "patch" : "post", edit ? `update/${editData?.id}` : "create/", data])
            setOpen(false)
            reset()
            setError()
            toast.success(`Test type ${edit ? "updated" : "added"} successfully`)
        } catch (err) {
            console.log("err", err)
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
                <DialogTitle className="text-[#22244D] font-medium text-base">{edit ? "Edit" : "Add"} Test Type</DialogTitle>
                <form onSubmit={handleSubmit(onSubmitHandler)}>

                    <div className="">
                        <InputField register={register} name="title" placeholder="Enter Test Type Name" className="w-full text-sm text-gray-500" defaultValue="" required label="Test Type Name" />
                        <p className="text-red-600 text-xs">
                            {errors?.title?.message ?? error?.title}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 w-full mt-28 gap-2">
                        <Button buttonName={"Clear"} className={"w-full "} danger handleButtonClick={(e) => {
                            handleClear(e)
                        }} icon={""} />
                        <Button type="submit" buttonName={`${edit ? "Edit" : "Add"} Test Type`} handleButtonClick={() => { }} className={"w-full"} icon={""} />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
