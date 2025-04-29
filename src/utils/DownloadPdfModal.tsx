import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { jsPDF } from "jspdf";

const DownloadPdfModal = ({ setIsModalOpen, isModalOpen, data }) => {
  const pdfRef = useRef(null);
  const handleDownload = () => {
    const content = pdfRef.current;
    const doc = new jsPDF("portrait", "px", "a3");
    doc.html(content, {
      callback: function (doc) {
        doc.save(`${data?.name}.pdf`);
      },
    });
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        className=""
        onCancel={handleOk}
        footer={[]}
        width={700}
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-h-[540px] overflow-auto  min-w-[500px] bg-[#FAFAFA]">
            <DialogTitle className="text-[#22244D] font-medium text-base">
              {edit ? "Edit" : "Add"} Risk
            </DialogTitle>
            <div>
              <div
                ref={pdfRef}
                className=" flex flex-col  px-8 py-4  overflow-auto"
              >
                <div className="flex w-full justify-between items-center pb-4 mb-4 border-b border-gray-dark2 ">
                  <img src={logo} alt="" />
                  <div className="flex flex-col items-end">
                    <p>44600</p>
                    <h1>Kathmandu, Nepal</h1>
                  </div>
                </div>
                <p className=" w-full">
                  <b>Name : </b>
                  {data?.name}
                </p>
                <div className="text-black mb-6">
                  <b>Enrolled Courses : </b>
                  <div className="flex items-center border-b border-gray-dark pb-1 justify-between">
                    <p className="w-2/6  ">Courses</p>
                    <p>Unit One</p>
                    <p>Unit Two</p>
                    <p>Unit Three</p>
                    <p>Unit Four</p>
                  </div>
                  <div className="flex flex-col  justify-between pt-1">
                    {data?.courses?.map((item) => {
                      return (
                        <div
                          key={item?.id}
                          className="  flex items-center justify-between"
                        >
                          <p className="font-semibold w-2/6">{item?.name} : </p>{" "}
                          {/* <div className="flex items-center justify-between"> */}
                          {item?.units?.map((unit) => {
                            return (
                              <div
                                className="font-medium flex items-center gap-4 text-sm"
                                key={unit?.id}
                              >
                                <div className="w-[40%] mr-2">
                                  {unit?.points ?? "0"}
                                </div>
                              </div>
                            );
                          })}
                          {/* </div> */}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <b>Remarks</b>
                  <div className="flex justify-between pb-1 mb-1 border-b border-gray-dark1">
                    <p className="w-[52%]">Title</p>
                    <p className="w-[24%]">Communication</p>
                    <p className="w-[24%] ">LogicalThinking</p>
                  </div>
                  {data?.remarks?.map((remark) => {
                    return (
                      <div className="flex justify-between" key={remark?.id}>
                        <p className="w-[52%]">{remark?.title}</p>
                        <p className="w-[24%] text-center">
                          {remark?.communication ?? "-"}
                        </p>
                        <p className="w-[24%] text-center">
                          {remark?.logicalThinking ?? "-"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-start justify-end mt-6">
                <button
                  onClick={handleDownload}
                  className="border-2 border-blue px-4 py-[2px] cursor-pointer text-white bg-blue font-semibold hover:text-blue hover:bg-white rounded"
                >
                  Download Pdf
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Modal>
    </>
  );
};
export default DownloadPdfModal;
