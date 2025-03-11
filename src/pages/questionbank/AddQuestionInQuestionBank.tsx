import FileUpload from "@/components/FileUpload"
import { Switch } from "@/components/ui/switch"
import { useQuestionMutation } from "@/hooks/useMutateData"
import { useQuestionSetDetailsData, useSubjectData } from "@/hooks/useQueryData"
import Button from "@/ui/Button"
import CustomSelect from "@/ui/CustomSelect"
import { convertToSelectOptions } from "@/utils/convertToSelectOptions"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import ReactQuill from "react-quill"
import { useLocation, useNavigate } from "react-router-dom"

export default function AddQuestionInQuestionBank({ editData }) {
    const location = useLocation()
    const navigate = useNavigate()
    const { handleSubmit, setValue, watch, reset } = useForm()
    const questionBankData = location?.state?.data
    const [selectedQuestion, setSelectedQuestion] = useState(1)
    const [previousQuestionData, setPreviousQuestionData] = useState()
    const [isPrevious, setIsPrevious] = useState(false)
    const [isMultiplePrevious, setIsMultiplePrevious] = useState(false)
    const [selectedSubject, setSelectedSubject] = useState()
    const { data: subjectData } = useSubjectData("", questionBankData?.course?.id, "20", 1)
    const { data: questionSetDetails } = useQuestionSetDetailsData(questionBankData?.id)
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [forTest, setForTest] = useState(previousQuestionData?.forTest ?? false)
    const [selectedAnswer, setSelectedAnswer] = useState("")

    const questionSetID = location?.state?.data?.id


    useEffect(() => {
        isPrevious && setPreviousQuestionData(questionSetDetails?.data?.questions?.[selectedQuestion - 1])
    }, [questionSetDetails?.data, isPrevious, isMultiplePrevious])

    useEffect(() => {
        setSelectedQuestion(questionSetDetails?.data?.questions ? questionSetDetails?.data?.questions?.length + 1 : 1)
    }, [questionSetDetails?.data])


    const [hasSubmittedClick, setHasSubmittedClick] = useState(false)
    const subjectOptions = convertToSelectOptions(subjectData?.data)
    const questionMutation = useQuestionMutation()

    const options = [
        {
            id: 1,
            label: "Option A",
        },
        {
            id: 2,
            label: "Option B",
        },
        {
            id: 3,
            label: "Option C",
        },
        {
            id: 4,
            label: "Option D",
        }
    ]
    const totalQuestionBox = []
    for (let i = 1; i <= questionBankData?.totalQuestions; i++) {
        totalQuestionBox.push({
            value: i,
        });
    }

    const onSubmitHandler = async (data) => {
        const transformObject = (inputObject) => {
            const multipleOption = [];

            for (let i = 1; i <= 4; i++) {
                const optionkey = `_${i}title`;
                const audioKey = `_${i}audio`;
                const imageKey = `_${i}image`;

                const optionMultiple = {
                    title: (inputObject[optionkey] && !editData) ? inputObject[optionkey] : (inputObject[optionkey] && editData) ? inputObject[optionkey] : editData?.options?.[i - 1]?.title === "" ? undefined : editData?.options?.[i - 1]?.title,
                    audio: (inputObject[audioKey] && !editData) ? inputObject[audioKey] : (inputObject[audioKey] && editData) ? inputObject[audioKey] : editData?.options?.[i - 1]?.audio === "" ? undefined : editData?.options?.[i - 1]?.audio,
                    image: (inputObject[imageKey] && !editData) ? inputObject[imageKey] : (inputObject[imageKey] && editData) ? inputObject[imageKey] : editData?.options?.[i - 1]?.image === "" ? undefined : editData?.options?.[i - 1]?.image,
                };
                multipleOption.push(optionMultiple);
            }
            return multipleOption;
        };

        const transformedObject = transformObject(data);
        const postData = {
            options: transformedObject,
            title: data?.title,
            description: data?.description,
            answer: selectedAnswer,
            forTest: forTest,
            questionSetID: questionSetID,
            position: selectedQuestion,
            subjectID: selectedSubject,
        }
        setIsLoading(true);
        try {
            const result = await questionMutation.mutateAsync([
                selectedQuestion < questionSetDetails?.data?.questions?.length + 1 ? "patch" : "post",
                selectedQuestion < questionSetDetails?.data?.questions?.length + 1 ? `update/${previousQuestionData?.id}` : `create`,
                postData,
            ]);
            setIsLoading(false);
            toast.success(`Question added successfully`);
            setIsPrevious(false)
            if (selectedQuestion < questionBankData?.totalQuestions) {
                setSelectedQuestion(selectedQuestion + 1)
            } else {
                navigate("/question-bank")
            }
            setError()
            reset()
        } catch (error) {
            setIsLoading(false);
            {
                error?.response?.data?.errors?.error && toast.error(error?.response?.data?.errors?.error);
            }
            setError(error?.response?.data?.errors);
        }
    };

    const answerOptions = [
        {
            label: "Option A",
            value: "a"
        },
        {
            label: "Option B",
            value: "b"
        },
        {
            label: "Option C",
            value: "c"
        },
        {
            label: "Option D",
            value: "d"
        }
    ]


    return (
        <div className="m-4 flex bg-white">
            <div className="bg-[#FAFAFA] p-4 w-2/6">
                <h1 className="font-medium text-lg text-[#333333]">Test Navigator</h1>
                <p className="font-light text-base text-[#666666] border-b pb-4">Click box below to jump questions</p>
                <div className="flex items-center gap-2 mt-4 justify-start flex-wrap">
                    {
                        totalQuestionBox?.map((item) => {
                            return (<div className={`border  cursor-pointer ${item?.value <= selectedQuestion ? "bg-[#00CA39] text-white" : "bg-white border-[#818181]"} w-9 h-9 flex rounded-[6px] items-center justify-center text-center`}>{item?.value}</div>)
                        })
                    }
                </div>
            </div>
            {
                questionSetDetails?.data?.questions?.length === questionBankData?.totalQuestions ?
                    <div className="h-[70vh] w-full font-semibold text-lg text-gray-600 flex justify-center items-center">
                        Question set can have only {questionSetDetails?.data?.questions?.length} questions
                    </div> :
                    <form onSubmit={handleSubmit(onSubmitHandler)} className="border w-4/6 p-4 ">
                        <div className="flex items-center justify-between">
                            <h1 className="font-medium text-lg text-[#333333]">Question {selectedQuestion <= questionBankData?.totalQuestions ? selectedQuestion : questionBankData?.totalQuestions ?? 1} out of {questionBankData?.totalQuestions}</h1>
                        </div>
                        <div className="flex flex-col gap-4 mt-4  h-[70vh] overflow-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <CustomSelect placeholder={questionBankData?.course?.courseID} className={"w-full text-sm text-gray-500"} labelName={"Course"} disabled />
                                    <p className="text-red-600 text-xs">
                                        {error?.courseid}
                                    </p>
                                </div>
                                <div>
                                    <CustomSelect options={subjectOptions} placeholder={"Select subject"} className={"w-full text-sm text-gray-500"} labelName={"Subject"} required={true} setSelectedField={setSelectedSubject} />
                                    <p className="text-red-600 text-xs">
                                        {hasSubmittedClick && !subjectOptions && "Required"}
                                        {error?.subjectid}
                                    </p>
                                </div>
                            </div>
                            <div className=" grid grid-cols-2 xlg:grid-cols-1 gap-4">
                                <div className="flex flex-col gap-1 mb-6">
                                    <h1 className="font-medium text-base text-[#344054]">Question <span className="text-red-600">*</span></h1>
                                    <ReactQuill value={(watch(`title`) !== "<p><br></p>" || !watch("title")) ? watch(`title`) : isPrevious && previousQuestionData?.title} theme="snow" className="h-[100px] mb-10" onChange={(e) => setValue(`title`, e)} />
                                    <p className="text-red-600 text-xs">
                                        {error?.title}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 xlg:grid-cols-1 gap-4">
                                {
                                    options?.map((item, index) => {
                                        return <div key={index} className="flex flex-col gap-2 mb-6">
                                            <div className="flex items-center justify-between">
                                                <h1 className="font-medium text-base text-[#344054]">{item?.label} <span className="text-red-600">*</span></h1>
                                                {/* <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium">is File ?</p>
                                                    <Switch onClick={(e) => {
                                                        setValue(`_${index + 1}checkbox`, e?.target?.ariaChecked)
                                                    }} />
                                                </div> */}
                                            </div>
                                            <FileUpload watch={watch} title={"audio"} accept={"audio/*"} setValue={setValue} registerName={`_${index + 1}audio`} />
                                            <FileUpload watch={watch} title={"image"} setValue={setValue} registerName={`_${index + 1}image`} />
                                            <ReactQuill value={watch(`_${index + 1}title`)} theme="snow" className="h-[100px] mb-10" onChange={(e) => setValue(`_${index + 1}title`, e)} />

                                        </div>
                                    })
                                }
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">For Test ?</p>
                                <Switch onClick={() => setForTest(!forTest)} checked={forTest} />
                            </div>
                            <div className="mb-8">
                                <CustomSelect options={answerOptions} placeholder={"Select answer"} className={"w-full text-sm text-gray-500"} labelName={"Answer"} required={true} setSelectedField={setSelectedAnswer} />
                                <p className="text-red-600 text-xs">
                                    {hasSubmittedClick && !selectedAnswer && "Required"}
                                </p>
                            </div>

                        </div>
                        <div className="flex items-center justify-end mt-2">
                            <div className="flex items-center gap-2">
                                {/* <Button type="submit" buttonName="Previous" noFill handleButtonClick={(e) => {
                            e.preventDefault()
                            setSelectedQuestion(selectedQuestion - 1)
                            setIsPrevious(true)
                            setIsMultiplePrevious(!isMultiplePrevious)
                        }} icon={""} /> */}
                                <Button loading={isLoading} buttonName="Next" className={"w-full "} handleButtonClick={() => { setHasSubmittedClick(true) }} icon={""} />
                            </div>
                        </div>
                    </form>
            }

        </div>
    )
}
