import { useQuestionSetDetailsData } from "@/hooks/useQueryData"
import Button from "@/ui/Button"
import { ConvertHtmlToPlainText } from "@/utils/convertHtmlToPlainText"
import { useState } from "react"
import { useLocation } from "react-router-dom"

export default function PreviewQuestionBank() {
    const location = useLocation()
    const questionBankData = location?.state?.data
    const [selectedQuestion, setSelectedQuestion] = useState(1)
    const { data: questionSetDetails } = useQuestionSetDetailsData(questionBankData?.id)
    const activeQuestion = questionSetDetails?.data?.questions?.[selectedQuestion - 1]


    const answerOptions = [
        {
            label: "Option A",
            value: "A"
        },
        {
            label: "Option B",
            value: "B"
        },
        {
            label: "Option C",
            value: "C"
        },
        {
            label: "Option D",
            value: "D"
        }
    ]



    return (
        <div className="m-4 flex bg-white">
            <div className="bg-[#FAFAFA] p-4 w-2/6">
                <h1 className="font-medium text-lg text-[#333333]">Test Navigator</h1>
                <p className="font-light text-base text-[#666666] border-b pb-4">Click box below to jump questions</p>
                <div className="flex items-center gap-2 mt-4 justify-start flex-wrap">
                    {
                        questionSetDetails?.data?.questions?.map((item, index) => {
                            return (<div onClick={() => setSelectedQuestion(index + 1)} className={`border  cursor-pointer ${index + 1 <= selectedQuestion ? "bg-[#00CA39] text-white" : "bg-white border-[#818181]"} w-9 h-9 flex rounded-[6px] items-center justify-center text-center`}>{index + 1}</div>)
                        })
                    }
                </div>
            </div>
            <div className="border w-4/6 p-4 h-[80vh] flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between">
                        <h1 className="font-medium text-lg text-[#333333]">Question {selectedQuestion <= questionBankData?.totalQuestions ? selectedQuestion : questionBankData?.totalQuestions ?? 1} out of {questionBankData?.totalQuestions}</h1>

                        <p className="text-green-800 bg-green-50 font-medium text-sm px-4 py-1 rounded-full">{activeQuestion?.subject?.title}</p>
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                        <h1 className="font-semibold text-gray-700">{ConvertHtmlToPlainText(activeQuestion?.title)}</h1>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            {
                                activeQuestion?.options?.map((item, index) => {
                                    6
                                    return <div key={item} className="flex flex-col gap-1 text-sm">
                                        <div className=" text-gray-500">{answerOptions?.[index]?.label}</div>
                                        <div className={`border flex flex-col gap-1 py-2 px-3 rounded-[8px] ${answerOptions?.[index]?.value === activeQuestion?.answer && "border-green-600"}`}>{ConvertHtmlToPlainText(item?.title)}
                                            {
                                                item?.image && <img className="w-[140px] h-[140px] object-cover" src={item?.image} alt="" />
                                            }
                                            {
                                                item?.audio && <audio className="bg-white mt-2 w-full h-10" controls>
                                                    <source src={item?.audio} />
                                                </audio>
                                            }
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end mt-2">
                    <div className="flex items-center gap-2">
                        <Button buttonName="Previous" noFill className={"w-full "} handleButtonClick={() => { selectedQuestion > 1 && setSelectedQuestion(selectedQuestion - 1) }} icon={""} />
                        <Button buttonName="Next" className={"w-full "} handleButtonClick={() => { selectedQuestion < questionSetDetails?.data?.questions?.length && setSelectedQuestion(selectedQuestion + 1) }} icon={""} />
                    </div>
                </div>
            </div>

        </div>
    )
}
