import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Button from "@/ui/Button";
import CustomSelect from "@/ui/CustomSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputField from "@/ui/InputField";
import { useForm } from "react-hook-form";
import { useQuizMutation } from "@/hooks/useMutateData";
import { useEffect, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { useCourseData, useQuestionBankData, useTestSeriesData, useTestTypeData } from "@/hooks/useQueryData";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";

export default function AddQuizModal({ asChild, children, edit, editData }) {
    const [open, setOpen] = useState(false)
    const [isPremium, setIsPremium] = useState(edit ? editData?.isPremium : false)
    const [isFree, setIsFree] = useState(edit ? editData?.isFree : false)
    const [isPackage, setIsPackage] = useState(edit ? editData?.isPackage : false)
    const { data } = useCourseData("", "", "", "", open)
    const { data: questionBankData } = useQuestionBankData("", "", "", "", open)
    const { data: testSeriesData } = useTestSeriesData("", "", "", "", isPackage && open)
    const [selectedCourse, setSelectedCourse] = useState(edit ? editData?.course?.id : "")
    const { data: testTypeData } = useTestTypeData("", selectedCourse, "", open)
    const [selectedTestType, setSelectedTestType] = useState(edit ? editData?.testType?.id : "")
    const [selectedQuestionBank, setSelectedQuestionBank] = useState(edit ? editData?.questionSet?.id : "")
    const [selectedTestSeries, setSelectedTestSeries] = useState(edit ? editData?.testSeries?.id : "")
    const [hasSubmittedClick, setHasSubmittedClick] = useState(false)
    const [error, setError] = useState()

    const fieldSchema = Yup.object().shape({
        title: Yup.string()
            .required("Required")
            .max(36, "Must be 36 characters or less"),
        duration: Yup.string().required("Required"),
        price: Yup.string().required("Required"),
        startTime: Yup.string().required("Required"),
        endTime: Yup.string().required("Required"),
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
            duration: editData?.duration,
            title: editData?.title,
            price: editData?.price,
            startTime: editData?.startTime?.slice(0, 16),
            endTime: editData?.endTime?.slice(0, 16),
        },
    });

    useEffect(() => {
        reset({
            duration: editData?.duration,
            title: editData?.title,
            price: editData?.price,
            startTime: editData?.startTime?.slice(0, 16),
            endTime: editData?.endTime?.slice(0, 16),
        });
        setError();
    }, [editData, reset, open]);

    const courseOptions = convertToSelectOptions(data?.data);
    const questionBankOptions = convertToSelectOptions(questionBankData?.data);
    const testTypeOptions = convertToSelectOptions(testTypeData?.data);
    const testSeriesOptions = convertToSelectOptions(testSeriesData?.data);
    const selectedValue = courseOptions?.filter(
        (item) => item?.value === selectedCourse
    );
    const quizMutation = useQuizMutation();

    useEffect(() => {
        reset({
            duration: editData?.duration,
            title: editData?.title,
            price: editData?.price,
            startTime: editData?.startTime?.slice(0, 16),
            endTime: editData?.endTime?.slice(0, 16),
        })
        setError()
    }, [editData, reset, open]);


    const onSubmitHandler = async (data) => {
        const postData = {
            ...data,
            startTime: `${data?.startTime}:00Z`,
            endTime: `${data?.endTime}:00Z`,
            courseid: selectedCourse ?? editData?.course?.id,
            questionSetID: selectedQuestionBank ?? editData?.questionSetID,
            testTypeID: selectedTestType ?? editData?.type?.id,
            testSeriesID: selectedTestSeries ?? editData?.typeSeries?.id,
            isPremium: isPremium,
            isPackage: isPackage,
            isFree: isFree,
        }
        try {
            const response = await quizMutation.mutateAsync([`${edit ? "patch" : "post"}`, edit ? `update/${editData?.id}` : "create/", postData])
            setOpen(false)
            reset()
            setError()
        } catch (err) {
            setError(err?.response?.data?.errors)
            if (err?.response?.data?.errors?.error) {
                toast.error(err?.response?.data?.errors?.error)
            }
        }
    }


    const handleClear = (e) => {
        e.preventDefault();
        setSelectedCourse([]);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={asChild}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]  min-w-[500px] bg-[#FAFAFA]">
                <DialogTitle className="text-[#22244D] font-medium text-base mt-4 flex items-center justify-between">{edit ? "Edit" : "Add"} Test
                    <div className="flex items-center justify-end gap-1">
                        <input type="checkbox" onChange={() => setIsPackage(!isPackage)} checked={isPackage} />
                        <p className="text-[#344054] font-medium text-sm ">Make as a package </p>
                    </div></DialogTitle>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <CustomSelect options={courseOptions} placeholder={`${edit ? editData?.course?.courseID : selectedCourse ? selectedValue?.[0]?.label : "Select Course"}`} className={"w-full text-sm text-gray-500"} labelName={"Course"} required={true} setSelectedField={setSelectedCourse} />
                                <p className="text-red-600 text-xs">
                                    {hasSubmittedClick && !selectedCourse && "Required"}
                                </p>
                            </div>
                            <div>
                                <CustomSelect options={testTypeOptions} placeholder={edit ? editData?.testType?.title : selectedTestType ? selectedValue?.[0]?.label : "Select Type"} className={"w-full text-sm text-gray-500"} labelName={"Test Type"} required={true} setSelectedField={setSelectedTestType} />
                                <p className="text-red-600 text-xs">
                                    {hasSubmittedClick && !selectedTestType && "Required"}
                                </p>
                            </div>
                        </div>
                        <div>
                            <InputField register={register} name="title" placeholder="Enter the title of the test" className="w-full text-sm text-gray-500" defaultValue="" required label="Test Title" />
                            <p className="text-red-600 text-xs">
                                {errors?.title?.message ?? error?.title}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                                <p className="text-[#344054] font-medium text-sm ">Is Premium ?</p>
                                <Switch onClick={() => setIsPremium(!isPremium)} checked={isPremium} className="bg-gray-300" />
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-[#344054] font-medium text-sm ">Is Free ?</p>
                                <Switch onClick={() => setIsFree(!isFree)} checked={isFree} className="bg-gray-300" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <InputField type="number" register={register} name="duration" placeholder="Enter the duration of the test" className="w-full text-sm text-gray-500" defaultValue="" required label="Duration (Minutes)" />
                                <p className="text-red-600 text-xs">
                                    {errors?.duration?.message ?? error?.duration}
                                </p>
                            </div>
                            <div>
                                <InputField type="number" register={register} name="price" placeholder="Enter the price of the test" className="w-full text-sm text-gray-500" defaultValue="" required label="Test Price" />
                                <p className="text-red-600 text-xs">
                                    {errors?.price?.message ?? error?.price}
                                </p>
                            </div>
                            <div>
                                <InputField register={register} type="datetime-local" name="startTime" className="w-full text-sm text-gray-500" defaultValue={editData?.startTime?.slice(0, 16)} required label="Start Time" />
                                <p className="text-red-600 text-xs">
                                    {errors?.startTime?.message ?? error?.startTime}
                                </p>
                            </div>
                            <div>
                                <InputField register={register} name="endTime" type="datetime-local" className="w-full text-sm text-gray-500" defaultValue={editData?.endTime?.slice(0, 16)} required label="End Time" />
                                <p className="text-red-600 text-xs">
                                    {errors?.endTime?.message ?? error?.endTime}
                                </p>
                            </div>
                            <div>
                                <CustomSelect options={questionBankOptions} placeholder={edit ? editData?.questionSet?.title : "Select Question Set"} className={"w-full text-sm text-gray-500"} labelName={"Question Set"} setSelectedField={setSelectedQuestionBank} />
                            </div>
                            {
                                isPremium && <div>
                                    <CustomSelect options={testSeriesOptions} placeholder={edit ? editData?.testSeries?.title : "Select Test Series"} className={"w-full text-sm text-gray-500"} labelName={"Test Series"} setSelectedField={setSelectedTestSeries} />
                                    <p className="text-red-600 text-xs">
                                        {error?.testSeriesID}
                                    </p>
                                </div>
                            }

                        </div>

                    </div>
                    <div className="grid grid-cols-2 w-full mt-16 gap-2">
                        <Button buttonName={`${edit ? "Reset" : "Clear"}`} className={"w-full "} danger handleButtonClick={(e) => {
                            handleClear(e)
                        }} icon={""} />
                        <Button type="submit" buttonName={`${edit ? "Edit" : "Add"} Test`} handleButtonClick={() => setHasSubmittedClick(true)} className={"w-full"} icon={""} />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
