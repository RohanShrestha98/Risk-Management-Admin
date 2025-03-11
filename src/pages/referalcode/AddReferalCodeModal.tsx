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
import { useReferalCodeMutation } from "@/hooks/useMutateData";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import 'react-quill/dist/quill.snow.css';
import { useCourseData } from "@/hooks/useQueryData";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import toast from "react-hot-toast";


export default function AddReferalCodeModal({ asChild, children, edit, editData }) {
    const [open, setOpen] = useState(false)
    const { data } = useCourseData()
    const [selectedCourse, setSelectedCourse] = useState(edit ? editData?.course?.id : "")
    const [selectedDiscountType, setSelectedDiscountType] = useState(edit ? editData?.discountType : "")
    const [selectedType, setSelectedType] = useState(edit ? editData?.type : "")
    const [hasSubmittedClick, setHasSubmittedClick] = useState(false)
    const [hasLimit, setHasLimit] = useState(edit ? editData?.hasLimit : true)
    const [selectedImage, setSelectedImage] = useState()
    const [error, setError] = useState()


    const fieldSchema = Yup.object().shape({
        code: Yup.string()
            .required("Required")
            .max(36, "Must be 36 characters or less"),
        title: Yup.string()
            .required("Required")
            .max(36, "Must be 36 characters or less"),
        expirydate: Yup.string()
            .required("Required"),
        discount: Yup.string()
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
            code: editData?.code,
            title: editData?.title,
            discount: editData?.discount,
            expirydate: editData?.expiryDate.slice(0, 16),
            limit: editData?.limit,
        }
    });

    useEffect(() => {
        reset({
            code: editData?.code,
            title: editData?.title,
            discount: editData?.discount,
            expirydate: editData?.expiryDate.slice(0, 16),
            limit: editData?.limit,
        })
        setError()
    }, [editData, reset, open]);


    const courseOptions = convertToSelectOptions(data?.data)
    const referalMutation = useReferalCodeMutation()
    const discounttypeOptions = [
        { label: "Percentage", value: "percentage" },
        { label: "Flat", value: "flat" }
    ]
    const typeOptions = [
        { label: "General", value: "general" },
        { label: "Course", value: "course" }
    ]

    const onSubmitHandler = async (data) => {
        const postData = {
            ...data,
            expirydate: `${data?.expirydate}:00Z`,
            file: selectedImage && selectedImage,
            discounttype: selectedDiscountType && selectedDiscountType,
            type: selectedType && selectedType,
            hasLimit: hasLimit,
            courseId: selectedCourse,
        }
        try {
            const response = await referalMutation.mutateAsync([edit ? "patch" : "post", edit ? `update/${editData?.id}` : "create/", postData])
            setOpen(false)
            reset()
            toast.success(`Referal code ${edit ? "updated" : "added"} successfully`)
        } catch (err) {
            console.log("err", err)
            {
                err?.response?.data?.errors?.error && toast.error(err?.response?.data?.errors?.error, [2])
            }
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
                <DialogTitle className="text-[#22244D] font-medium text-base">{edit ? "Edit" : "Add"} Code</DialogTitle>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="flex flex-col gap-4">

                        <div>
                            <InputField register={register} name="title" placeholder="Enter Referral Name" className="w-full text-sm text-gray-500" defaultValue="" required label="Referral Name" />
                            <p className="text-red-600 text-xs">
                                {errors?.title?.message ?? error?.title}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <InputField register={register} name="code" placeholder="Enter Referral Code" className="w-full text-sm text-gray-500" defaultValue="" required label="Referral Code" />
                                <p className="text-red-600 text-xs">
                                    {errors?.code?.message ?? error?.code}
                                </p>
                            </div>
                            <div>
                                <InputField type="datetime-local" register={register} name="expirydate" className="w-full text-sm text-gray-500" defaultValue="" required label="Expiry Date" />
                                <p className="text-red-600 text-xs">
                                    {errors?.expirydate?.message ?? error?.expirydate}
                                </p>
                            </div>
                            <div>
                                <CustomSelect options={discounttypeOptions} placeholder={edit ? editData?.discountType : "Select discount type"} className={"w-full text-sm text-gray-500"} labelName={"Discount Type"} required={true} setSelectedField={setSelectedDiscountType} />
                                <p className="text-red-600 text-xs">
                                    {hasSubmittedClick && !selectedDiscountType && !edit && "Required"}
                                </p>
                                <p className="text-red-600 text-xs">
                                    {error?.discounttype}
                                </p>
                            </div>
                            <div>
                                <InputField register={register} name="discount" type="number" placeholder={selectedDiscountType === "percentage" ? "Enter discount percentage" : "Enter flat discount"} className="w-full text-sm text-gray-500" defaultValue="" required label={selectedDiscountType === "percentage" ? "Discount Percent" : "Flat Discount"} />
                                <p className="text-red-600 text-xs">
                                    {errors?.discount?.message ?? error?.discount}
                                </p>
                            </div>
                            <div>
                                <CustomSelect options={typeOptions} placeholder={edit ? editData?.type : "Select type"} className={"w-full text-sm text-gray-500"} labelName={"Type"} required={true} setSelectedField={setSelectedType} />
                                <p className="text-red-600 text-xs">
                                    {hasSubmittedClick && !selectedType && !edit && "Required"}
                                </p>
                                <p className="text-red-600 text-xs">
                                    {error?.type}
                                </p>
                            </div>
                            {
                                selectedType === "course" && <div>
                                    <CustomSelect options={courseOptions} placeholder={edit ? editData?.course?.courseID : "Select course"} className={"w-full text-sm text-gray-500"} labelName={"Course"} required={true} setSelectedField={setSelectedCourse} />
                                    <p className="text-red-600 text-xs">
                                        {hasSubmittedClick && !selectedCourse && !edit && "Required"}
                                    </p>
                                </div>
                            }

                            <div>
                                <InputField register={register} name="userId" placeholder="Enter User ID" className="w-full text-sm text-gray-500" defaultValue="" label="User ID" />
                                <p className="text-red-600 text-xs">
                                    {error?.userId}
                                </p>
                            </div>


                        </div>

                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">Has Limit ?</p>
                            <Switch onClick={() => setHasLimit(!hasLimit)} checked={hasLimit} className="bg-gray-300" />
                        </div>
                        {
                            hasLimit && <div>
                                <InputField register={register} type="number" name="limit" placeholder="Enter limit" className="w-full text-sm text-gray-500" defaultValue="" label="Limit" />
                                <p className="text-red-600 text-xs">
                                    {error?.limit}
                                </p>
                            </div>
                        }

                    </div>
                    <div className="grid grid-cols-2 w-full mt-20 gap-2">
                        <Button buttonName={`${edit ? "Reset" : "Clear"}`} className={"w-full "} danger handleButtonClick={(e) => {
                            handleClear(e)
                        }} icon={""} />
                        <Button type="submit" buttonName={`${edit ? "Edit" : "Add"} Code`} handleButtonClick={() => setHasSubmittedClick(true)} className={"w-full"} icon={""} />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
