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
import { usePackageMutation } from "@/hooks/useMutateData";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useCourseData, useLiveData, useLiveGroupData, usePackageTypeData, useQuizData, useTestSeriesData } from "@/hooks/useQueryData";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import ReactQuill from "react-quill";


export default function AddPackageModal({ asChild, children, edit, editData }) {
    const [open, setOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState(edit ? editData?.course?.id : "")
    const [selectedPackageType, setSelectedPackageType] = useState(edit ? editData?.course?.id : "")
    const [selectedTestSeries, setSelectedTestSeries] = useState(edit ? editData?.testSeries?.id : "")
    const [selectedLiveGroup, setSelectedLiveGroup] = useState(edit ? editData?.liveGroup?.id : "")
    const [selectedTest, setSelectedTest] = useState(edit ? editData?.test?.id : "")
    const [selectedLive, setSelectedLive] = useState(edit ? editData?.live?.id : "")
    const [hasSubmittedClick, setHasSubmittedClick] = useState(false)
    const [error, setError] = useState("")
    const { data } = useCourseData("", "", "", "", open)
    const { data: packageTypeData } = usePackageTypeData("", "", open)
    const { data: testSeriesData } = useTestSeriesData("", selectedCourse, "", "", (selectedPackageType == 1 || selectedPackageType == 2 || selectedPackageType == 4 || selectedPackageType == 6) && open)
    const { data: liveGroupData } = useLiveGroupData("", selectedCourse, "", "", (selectedPackageType == 1 || selectedPackageType == 3 || selectedPackageType == 4 || selectedPackageType == 7) && open)
    const { data: testData } = useQuizData("", selectedCourse, "", "", selectedPackageType == 8 && open)
    const { data: liveData } = useLiveData("", selectedCourse, "", "", selectedPackageType == 9 && open)
    const packageTypeOptions = convertToSelectOptions(packageTypeData?.data)
    const testSeriesOptions = convertToSelectOptions(testSeriesData?.data)
    const liveGroupOptions = convertToSelectOptions(liveGroupData?.data)
    const testOptions = convertToSelectOptions(testData?.data)
    const liveOptions = convertToSelectOptions(liveData?.data)
    const [value, setValue] = useState(edit ? editData?.description : "")


    const courseOptions = convertToSelectOptions(data?.data)

    const fieldSchema = Yup.object().shape({
        title: Yup.string()
            .required("Required")
            .max(100, "Must be 100 characters or less"),
        price: Yup.string()
            .required("Required"),
        period: Yup.string()
            .required("Required"),
        discountedPrice: Yup.string()
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
            price: editData?.price,
            title: editData?.title,
            period: editData?.period,
            discountedPrice: editData?.discountedPrice,
            discount: editData?.discount,
        }
    });
    const packageMutation = usePackageMutation()

    useEffect(() => {
        reset({
            price: editData?.price,
            title: editData?.title,
            period: editData?.period,
            discountedPrice: editData?.discountedPrice,
            discount: editData?.discount,
            description: editData?.description,
        })

        setError()
    }, [editData, reset, open]);




    const onSubmitHandler = async (data) => {
        const postData = {
            ...data,
            courseID: selectedCourse,
            description: value,
            packageTypeID: selectedPackageType,
            ...(selectedPackageType == 8 ? { testID: selectedTest } : {}),
            ...(selectedPackageType == 9 ? { liveID: selectedLive } : {}),
            ...(["1", "2", "4", "6"].includes(selectedPackageType) ? { testSeriesID: selectedTestSeries } : {}),
            ...(["1", "3", "4", "7"].includes(selectedPackageType) ? { liveGroupID: selectedLiveGroup } : {}),
        }

        try {
            const response = await packageMutation.mutateAsync([edit ? "patch" : "post", edit ? `update/${editData?.id}` : "create/", postData])
            setOpen(false)
            reset()
            setValue("")
            setError()
            toast.success(`Package ${edit ? "updated" : "added"} successfully`)
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
                <DialogTitle className="text-[#22244D] font-medium text-base">{edit ? "Edit" : "Add"} Package</DialogTitle>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="flex flex-col gap-4">
                        <div>
                            <InputField register={register} name="title" placeholder="Enter Package Name" className="w-full text-sm text-gray-500" defaultValue="" required label="Package Name" />
                            <p className="text-red-600 text-xs">
                                {errors?.title?.message ?? error?.title}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <InputField type="number" register={register} name="price" placeholder="Enter price" className="w-full text-sm text-gray-500" defaultValue="" required label="Price" />
                                <p className="text-red-600 text-xs">
                                    {errors?.price?.message ?? error?.price}
                                </p>
                            </div>
                            <div>
                                <InputField type="number" register={register} name="period" placeholder="Enter period" className="w-full text-sm text-gray-500" defaultValue="" required label="Period" />
                                <p className="text-red-600 text-xs">
                                    {errors?.period?.message ?? error?.period}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <InputField type="number" register={register} name="discount" placeholder="Enter discount" className="w-full text-sm text-gray-500" defaultValue="" required label="Discount" />
                                <p className="text-red-600 text-xs">
                                    {errors?.discount?.message ?? error?.discount}
                                </p>
                            </div>
                            <div>
                                <InputField type="number" register={register} name="discountedPrice" placeholder="Enter discounted price" className="w-full text-sm text-gray-500" defaultValue="" required label="DiscountedPrice" />
                                <p className="text-red-600 text-xs">
                                    {errors?.discountedPrice?.message ?? error?.discountedPrice}
                                </p>
                            </div>
                            <div>
                                <CustomSelect options={courseOptions} placeholder={edit ? editData?.course?.courseID : selectedCourse ? selectedCourse : "Select course"} className={"w-full text-sm text-gray-500"} labelName={"Course"} required={true} setSelectedField={setSelectedCourse} />
                                <p className="text-red-600 text-xs">
                                    {hasSubmittedClick && !selectedCourse && !edit && "Required"}
                                </p>
                                <p className="text-red-600 text-xs">
                                    {error?.courseId ?? error?.courseid}
                                </p>
                            </div>
                            <div>
                                <CustomSelect options={packageTypeOptions} placeholder={edit ? editData?.course?.courseID : "Select package type"} className={"w-full text-sm text-gray-500"} labelName={"Package Type"} required={true} setSelectedField={setSelectedPackageType} />
                                <p className="text-red-600 text-xs">
                                    {hasSubmittedClick && !selectedPackageType && !edit && "Required"}
                                </p>
                                <p className="text-red-600 text-xs">
                                    {error?.packageTypeID ?? error?.packageTypeid}
                                </p>
                            </div>
                            {
                                (selectedPackageType == 1 || selectedPackageType == 2 || selectedPackageType == 4 || selectedPackageType == 6) && <div>
                                    <CustomSelect options={testSeriesOptions} placeholder={edit ? editData?.testSeries?.title : "Select test series"} className={"w-full text-sm text-gray-500"} labelName={"Test series"} required={true} setSelectedField={setSelectedTestSeries} />
                                    <p className="text-red-600 text-xs">
                                        {hasSubmittedClick && !selectedTestSeries && !edit && "Required"}
                                    </p>
                                    <p className="text-red-600 text-xs">
                                        {error?.testseriesID ?? error?.testSeriesId}
                                    </p>
                                </div>
                            }
                            {
                                (selectedPackageType == 1 || selectedPackageType == 3 || selectedPackageType == 4 || selectedPackageType == 7) && <div>
                                    <CustomSelect options={liveGroupOptions} placeholder={edit ? editData?.liveGroup?.title : "Select live group"} className={"w-full text-sm text-gray-500"} labelName={"Live Group"} required={true} setSelectedField={setSelectedLiveGroup} />
                                    <p className="text-red-600 text-xs">
                                        {hasSubmittedClick && !selectedLiveGroup && !edit && "Required"}
                                    </p>
                                    <p className="text-red-600 text-xs">
                                        {error?.liveGroupID ?? error?.liveGroupid}
                                    </p>
                                </div>
                            }
                            {
                                selectedPackageType == 8 && <div>
                                    <CustomSelect options={testOptions} placeholder={edit ? editData?.test?.title : "Select test"} className={"w-full text-sm text-gray-500"} labelName={"Test"} required={true} setSelectedField={setSelectedTest} />
                                    <p className="text-red-600 text-xs">
                                        {hasSubmittedClick && !selectedTest && !edit && "Required"}
                                    </p>
                                    <p className="text-red-600 text-xs">
                                        {error?.testID ?? error?.testid}
                                    </p>
                                </div>
                            }
                            {
                                selectedPackageType == 9 && <div>
                                    <CustomSelect options={liveOptions} placeholder={edit ? editData?.live?.title : "Select live"} className={"w-full text-sm text-gray-500"} labelName={"Live"} required={true} setSelectedField={setSelectedLive} />
                                    <p className="text-red-600 text-xs">
                                        {hasSubmittedClick && !selectedLive && !edit && "Required"}
                                    </p>
                                    <p className="text-red-600 text-xs">
                                        {error?.liveID ?? error?.liveid}
                                    </p>
                                </div>
                            }

                        </div>
                        <div>
                            <p className="text-[#344054] leading-5 font-medium text-sm mb-1">Description <span className="text-red-600">*</span> </p>
                            <ReactQuill theme="snow" className="h-[100px] mb-10" value={value} onChange={setValue} />
                            <p className="text-red-600 text-xs">
                                {error?.description}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 w-full mt-10 gap-2">
                        <Button buttonName={"Clear"} className={"w-full "} danger handleButtonClick={(e) => {
                            handleClear(e)
                        }} icon={""} />
                        <Button type="submit" buttonName={`${edit ? "Edit" : "Add"} Package`} handleButtonClick={() => setHasSubmittedClick(true)} className={"w-full"} icon={""} />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
