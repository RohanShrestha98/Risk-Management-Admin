import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Button from "@/ui/Button";
import {
  useCategoryMutation,
  useChapterMutation,
  useCourseMutation,
  useUserMutation,
  useLiveGroupMutation,
  useLiveMutation,
  useNotificationMutation,
  useQuestionBankMutation,
  useQuestionMutation,
  useQuizMutation,
  useReferalCodeMutation,
  useSubjectMutation,
  useTestSeriesMutation,
  useTestTypeMutation,
  useUnitMutation,
} from "@/hooks/useMutateData";
import "react-quill/dist/quill.snow.css";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DeleteModal({ asChild, children, title, desc, id }) {
  const loaction = useLocation();
  const [open, setOpen] = useState(false);
  const pathname = loaction?.pathname?.slice(1);
  const userMutation = useUserMutation();
  const courseMutation = useCourseMutation();
  const subjectMutation = useSubjectMutation();
  const categoryMutation = useCategoryMutation();
  const instructorsMutation = useUserMutation();
  const questionBankMutation = useQuestionBankMutation();
  const questionMutation = useQuestionMutation();
  const referalCodesMutation = useReferalCodeMutation();
  const chapterMutation = useChapterMutation();
  const notificationMutation = useNotificationMutation();
  const liveGroupMutation = useLiveGroupMutation();
  const liveMutation = useLiveMutation();
  const unitMutation = useUnitMutation();
  const quizMutation = useQuizMutation();
  const testTypeMutation = useTestTypeMutation();
  const testSeriesMutation = useTestSeriesMutation();

  const deleteMutation =
    pathname === "test-series"
      ? testSeriesMutation
      : pathname === "test-type"
      ? testTypeMutation
      : pathname === "test"
      ? quizMutation
      : pathname === "units"
      ? unitMutation
      : pathname === "live"
      ? liveMutation
      : pathname === "live-group"
      ? liveGroupMutation
      : pathname === "notification"
      ? notificationMutation
      : pathname === "chapters"
      ? chapterMutation
      : pathname === "user"
      ? userMutation
      : pathname === "courses"
      ? courseMutation
      : pathname === "subjects"
      ? subjectMutation
      : pathname === "category"
      ? categoryMutation
      : pathname === "instructors"
      ? instructorsMutation
      : pathname === "question-bank"
      ? questionBankMutation
      : pathname === "question"
      ? questionMutation
      : pathname === "referal-codes"
      ? referalCodesMutation
      : courseMutation;

  const handleDelete = async () => {
    try {
      const response = await deleteMutation.mutateAsync([
        "delete",
        `delete/${id}/`,
      ]);
      setOpen(false);
      toast.success("Deleted successfully");
    } catch (err) {
      console.log("err", err);
      toast.error(err?.response?.data?.errors?.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent className="max-w-[325px]  min-w-[300px] bg-[#FAFAFA]">
        <DialogTitle className="text-[#22244D] font-medium text-base ">
          {title}
        </DialogTitle>
        <div>
          <div>{desc} ?</div>
          <div className="grid grid-cols-2 w-full mt-10 gap-2">
            <Button
              buttonName={"Cancel"}
              className={"w-full "}
              handleButtonClick={() => setOpen(false)}
              icon={""}
            />
            <Button
              type="submit"
              buttonName="Confirm"
              handleButtonClick={() => {
                handleDelete();
              }}
              className={"w-full bg-red-600 border-red-600 hover:text-red-600"}
              icon={""}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
