import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useViewQuizData } from "@/hooks/useQueryData";
import { useState } from "react";

export default function ViewQuizModal({ asChild, children, testId }) {
  //   const [selectedField, setSelectedField] = useState("");
  const [open, setOpen] = useState(false);
  const { data } = useViewQuizData(testId);
  return (
    <Dialog>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] min-w-[500px] bg-[#FAFAFA]">
        <DialogTitle className="text-[#22244D] font-medium text-base">
          View Test
        </DialogTitle>
        <div className="flex flex-col gap-4">
          <div>
            <p>{data?.data?.title}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
