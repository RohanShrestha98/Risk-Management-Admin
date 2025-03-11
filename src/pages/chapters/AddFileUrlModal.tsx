import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react";
import { useFileUrlData } from "@/hooks/useQueryData";


export default function AddFileUrlModal({ asChild, children, edit }) {
    const [open, setOpen] = useState(false)
    const { data } = useFileUrlData()

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={asChild}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]  min-w-[500px] bg-[#FAFAFA]">
                <DialogTitle className="text-[#22244D] font-medium text-base">{edit ? "Edit" : "Add"} Content</DialogTitle>
                <div>
                    {
                        data?.data?.map((item) => {
                            return <div key={item?.id}>
                                <p>{item?.title}</p>
                            </div>
                        })
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}
