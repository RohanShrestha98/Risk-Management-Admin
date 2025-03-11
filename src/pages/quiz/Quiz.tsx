import SearchPagination from "@/components/SearchPagination";
import {
  useCourseData,
  useLeaderBoardQuizData,
  useQuizData,
} from "@/hooks/useQueryData";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import { useEffect, useMemo, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import DeleteModal from "@/components/DeleteModal";
import { FaRegTrashCan } from "react-icons/fa6";
import Button from "@/ui/Button";
import AddQuizModal from "./AddQuizModal";
import { IoMdTime } from "react-icons/io";
import moment from "moment";
import { LuDownload } from "react-icons/lu";
import { FiUpload } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import FilterSearch from "@/components/FilterSearch";
import { ReactTable } from "@/components/Table";

import { FiArrowDown } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import ViewQuizModal from "./ViewQuizModal";
import { Switch } from "@/components/ui/switch";
import { useTestUpdateStatusMutation } from "@/hooks/useMutateData";
import toast from "react-hot-toast";

export default function Quiz() {
  const [selectedField, setSelectedField] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );

  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const [selectedQuiz, setSelectedQuiz] = useState();
  const { data, isLoading, isError } = useQuizData(
    "",
    selectedField,
    pageSize,
    page
  );
  const { data: studentData } = useLeaderBoardQuizData(
    selectedQuiz?.id ?? data?.data?.[0]?.id
  );
  const { data: courseData } = useCourseData();
  const courseOptions = convertToSelectOptions(courseData?.data);

  const testUpdateStatus = useTestUpdateStatusMutation();

  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        id: "id",
        header: () => (
          <span className="flex items-center gap-1">
            Rank
            <FiArrowDown />
          </span>
        ),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.name,
        id: "name",
        cell: (info) => {
          return (
            <p>
              {info?.row?.original?.name === ""
                ? "-"
                : info?.row?.original?.name}
            </p>
          );
        },
        header: () => <span>Student</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.attempted,
        id: "attempted",
        header: () => <span>Attempted</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.wrong,
        id: "wrong",
        header: () => <span>Wrong</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.correct,
        id: "correct",
        header: () => <span>Correct</span>,
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  const handleIsPublic = async (id) => {
    try {
      const response = await testUpdateStatus.mutateAsync(["patch", id, ""]);
      toast.success("Test status updated");
    } catch (error) {
      error?.response?.data?.errors?.error &&
        toast.error(error?.response?.data?.errors?.error);
    }
  };

  useEffect(() => {
    const searchQuery = {
      searchText: searchText,
      page: page,
      pageSize: pageSize,
    };
    setSearchParams(searchQuery);
  }, [page, pageSize, searchText]);

  return (
    <div className="m-4">
      <div className="flex items-center justify-between mb-4">
        <FilterSearch
          searchText={searchText}
          setSelectedField={setSelectedField}
          options={courseOptions}
          input={false}
          selectPlaceholder={"Select Course"}
        />
        <AddQuizModal asChild>
          <div>
            <Button
              icon={<FaPlus />}
              buttonName={"Add Test"}
              handleButtonClick={() => {}}
            />
          </div>
        </AddQuizModal>
      </div>
      <div className="bg-white">
        <SearchPagination
          totalPage={data?.totalPage}
          setPage={setPage}
          page={page}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
        <div className="grid grid-cols-2">
          <div className="border flex flex-col gap-2 p-2">
            <div className="w-full  flex flex-col gap-2  h-[70vh] overflow-auto">
              {data?.data ? (
                data?.data?.map((item, index) => {
                  const startTime = moment(item?.startTime).format(
                    "MMM Do YYYY, h:mm:ss a"
                  );
                  const endTime = moment(item?.endTime).format(
                    "MMM Do YYYY, h:mm:ss a"
                  );
                  return (
                    <div
                      key={item?.id}
                      onClick={() => setSelectedQuiz(item)}
                      className={` border flex flex-col gap-1 cursor-pointer rounded-xl  p-4 w-full ${
                        (item?.id === selectedQuiz?.id ||
                          (!selectedQuiz &&
                            item?.id === data?.data?.[0]?.id)) &&
                        "bg-blue-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-[#333333] font-medium line-clamp-1">
                          {index + 1 + " . "}
                          {item?.title}
                        </p>
                        <div className="flex items-center gap-2 toggle">
                          <Switch
                            isToggle
                            onClick={() => handleIsPublic(item?.id)}
                            checked={item?.isPublic}
                            className="bg-gray-300"
                          />
                          <p
                            className={`text-[12px] px-3 py-[2px] ${
                              item?.isDraft
                                ? "text-gray-500 border-gray-500 bg-gray-100"
                                : "text-white bg-green-600 "
                            }  border rounded-full`}
                          >
                            {item?.isDraft ? "Draft" : "Active"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex text-[12px] text-gray-500 items-center gap-1">
                          <IoMdTime />
                          <p>{item?.duration / 60} hour</p>
                        </div>
                        <div className="flex text-[12px] text-gray-500 items-center gap-1">
                          <IoMdTime />
                          <p>{item?.marks} marks</p>
                        </div>
                        <div className="flex text-[12px] text-gray-500 items-center gap-1">
                          <IoMdTime />
                          <p>{item?.totalQuestions} questions</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex text-[12px] text-gray-500 items-center gap-3">
                          <p>Start: {startTime}</p>
                          <p>End: {endTime}</p>
                        </div>
                        <div className="flex gap-2 justify-center  text-sm">
                          <ViewQuizModal asChild testId={item?.id}>
                            <FiEye className="text-[#4D4D4D] cursor-pointer" />
                          </ViewQuizModal>
                          <AddQuizModal asChild edit editData={item}>
                            <FiEdit2 className="text-[#4365a7] cursor-pointer" />
                          </AddQuizModal>
                          <DeleteModal
                            asChild
                            desc={"Are you sure you want to delete this test"}
                            title={"Delete Test"}
                            id={item?.id}
                          >
                            <FaRegTrashCan className="text-red-600 cursor-pointer" />
                          </DeleteModal>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : isLoading ? (
                <>Loading</>
              ) : isError ? (
                <>Error</>
              ) : (
                <>Empty</>
              )}
            </div>
          </div>
          <div className="w-full border border-l-0 ">
            <div className=" bg-[#F0F5FE] flex items-center justify-between p-4 font-medium">
              <p>{selectedQuiz?.title ?? data?.data?.[0]?.title}</p>
              <button className="flex items-center gap-2 px-4 py-1 rounded-full border text-[#4365a7] border-[#4365a7] hover:text-white hover:bg-[#4365a7]">
                <LuDownload /> Import
              </button>
            </div>
            <div className="flex items-center py-3 px-4 justify-between">
              <p className="font-medium">Student List</p>
              <button className="flex items-center gap-2 px-4 py-1 rounded-full border text-[#4365a7] border-[#4365a7] hover:text-white hover:bg-[#4365a7]">
                <FiUpload /> Export list
              </button>
            </div>
            <div>
              <ReactTable
                isLoading={isLoading}
                isError={isError}
                columns={columns}
                data={studentData?.data?.users ?? []}
                currentPage={1}
                totalPage={1}
                emptyMessage="Oops! No students available right now."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
