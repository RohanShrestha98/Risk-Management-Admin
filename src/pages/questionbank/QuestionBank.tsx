import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import TopButton from "@/components/TopButton";
import { useCourseData, useQuestionBankData } from "@/hooks/useQueryData";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import { LuEye } from "react-icons/lu";
import AddQuestionBankModal from "./AddQuestionBankModal";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import DeleteModal from "@/components/DeleteModal";
import { RiContactsBookUploadLine } from "react-icons/ri";
import { useNavigate, useSearchParams } from "react-router-dom";
import truncateText from "@/utils/truncateText";
import FilterSearch from "@/components/FilterSearch";

export default function QuestionBank() {
  const navigate = useNavigate();
  const [selectedField, setSelectedField] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const { data, isLoading, isError } = useQuestionBankData(
    searchText,
    selectedField,
    pageSize,
    page
  );
  const { data: courseData } = useCourseData();
  const courseOptions = convertToSelectOptions(courseData?.data);
  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        id: "id",
        header: () => <span>S.N.</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.name,
        id: "course",
        cell: (info) => {
          return (
            <div className="flex items-center gap-1">
              <p className="flex items-center gap-1 line-clamp-1">
                {truncateText(info?.row?.original?.title, 40)}
              </p>
            </div>
          );
        },
        header: () => <span>Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.description,
        id: "duration",
        cell: (info) => {
          return (
            <p className="flex items-center gap-1">
              {truncateText(info?.row?.original?.description, 40)}
            </p>
          );
        },
        header: () => <span>Description</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.totalQuestions,
        id: "totalQuestions",
        header: () => <span>Total Questions</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.marks,
        id: "marks",
        header: () => <span>Marks</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.course,
        id: "course",
        cell: (info) => {
          return (
            <div className="flex items-center gap-1">
              <p className="flex items-center gap-1 line-clamp-1">
                {info?.row?.original?.course?.courseID ?? "-"}
              </p>
            </div>
          );
        },
        header: () => <span>Course</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row,
        id: "action",
        cell: (info) => {
          return (
            <div className="flex gap-2 text-base justify-center">
              <LuEye
                onClick={() =>
                  navigate("/question-bank/preview-questions", {
                    state: {
                      data: info?.row?.original,
                    },
                  })
                }
                className="text-orange-600 text-md cursor-pointer"
              />
              <RiContactsBookUploadLine
                onClick={() =>
                  navigate("/question-bank/question", {
                    state: {
                      data: info?.row?.original,
                    },
                  })
                }
                className="text-green-600 text-md cursor-pointer"
              />
              <AddQuestionBankModal asChild edit editData={info?.row?.original}>
                <FiEdit2 className="text-[#4365a7] cursor-pointer" />
              </AddQuestionBankModal>
              <DeleteModal
                asChild
                desc={"Are you sure you want to delete this question set"}
                title={"Delete Question Set"}
                id={info?.row?.original?.id}
              >
                <FaRegTrashCan className="text-red-600 cursor-pointer" />
              </DeleteModal>
            </div>
          );
        },
        header: () => <span className="flex justify-center">Action</span>,
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  useEffect(() => {
    const searchQuery = {
      searchText: searchText,
      page: page,
      pageSize: pageSize,
    };
    setSearchParams(searchQuery);
  }, [page, pageSize, searchText]);

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <FilterSearch
          searchText={searchText}
          setSelectedField={setSelectedField}
          options={courseOptions}
          inputPlaceholder={"Search question set"}
          setSearchText={setSearchText}
          selectPlaceholder={"Select Course"}
        />
        <AddQuestionBankModal asChild>
          <div>
            <TopButton
              buttonName={"Add Question Set"}
              className={""}
              handleButtonClick={() => {}}
            />
          </div>
        </AddQuestionBankModal>
      </div>
      <div>
        <SearchPagination
          totalPage={data?.totalPage}
          setPage={setPage}
          page={page}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
        <ReactTable
          isLoading={isLoading}
          isError={isError}
          columns={columns}
          data={data?.data ?? []}
          currentPage={1}
          totalPage={1}
          emptyMessage="Oops! No Question Bank available right now."
        />
      </div>
    </div>
  );
}
