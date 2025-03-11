import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import TopButton from "@/components/TopButton";
import {
  useCourseData,
  useQuestionBankData,
  useQuestionData,
  useSubjectData,
} from "@/hooks/useQueryData";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import AddQuestionModal from "./AddQuestionModal";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import DeleteModal from "@/components/DeleteModal";
import { IndeterminateCheckbox } from "@/components/IndeterminateCheckBox";
import Button from "@/ui/Button";
import CustomSelect from "@/ui/CustomSelect";
import { useAssignQuestionMutation } from "@/hooks/useMutateData";
import truncateText from "@/utils/truncateText";
import { useSearchParams } from "react-router-dom";
import FilterSearch from "@/components/FilterSearch";
import toast from "react-hot-toast";

export default function Question() {
  const [selectedField, setSelectedField] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedQuestionBank, setSelectedQuestionBank] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const { data, isLoading, isError } = useQuestionData(
    searchText,
    selectedSubject,
    pageSize,
    page
  );
  const { data: courseData } = useCourseData();
  const courseOptions = convertToSelectOptions(courseData?.data);
  const { data: questionBankData } = useQuestionBankData();
  const questionBankOptions = convertToSelectOptions(questionBankData?.data);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState();
  const { data: subjectData } = useSubjectData("", selectedField);
  const subjectOptions = convertToSelectOptions(subjectData?.data);

  const assignQuestionMutation = useAssignQuestionMutation();

  const onSubmitHandler = async () => {
    const postData = {
      questionSetID: parseInt(selectedQuestionBank),
      questionIDs: selectedRows,
    };
    try {
      const result = await assignQuestionMutation.mutateAsync([
        "post",
        "",
        postData,
      ]);
      console.log("result", result);
    } catch (error) {
      error?.response?.data?.error && toast.error(error?.response?.data?.error);
      setError(error?.response?.data?.errors);
      selectedQuestionBank(null);
    }
  };

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            className={"ml-1"}
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => {
          return (
            <div className="px-1">
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler(),
                }}
              />
            </div>
          );
        },
      },
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
        accessorFn: (row) => row?.totalQuestions,
        id: "forTest",
        cell: (info) => {
          return (
            <p className="flex items-center gap-1">
              {info?.row?.original?.forTest ? "Yes" : "No"}
            </p>
          );
        },
        header: () => <span>For Test</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.course?.courseID,
        id: "course",
        cell: (info) => {
          return <p>{info?.row?.original?.course?.tile ?? "-"}</p>;
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
              <AddQuestionModal asChild edit editData={info?.row?.original}>
                <FiEdit2 className="text-[#4365a7] cursor-pointer" />
              </AddQuestionModal>
              <DeleteModal
                asChild
                desc={"Are you sure you want to delete this question"}
                title={"Delete Question"}
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
          setSelectedSubject={setSelectedSubject}
          subjectOptions={subjectOptions}
          options={courseOptions}
          inputPlaceholder={"Search question"}
          setSearchText={setSearchText}
          selectPlaceholder={"Select Course"}
        />
        <div className="flex gap-2">
          {selectedRows?.length ? (
            <>
              <CustomSelect
                className={"w-[220px]"}
                options={questionBankOptions}
                label={""}
                placeholder={"Select a question set"}
                setSelectedField={setSelectedQuestionBank}
              />
            </>
          ) : (
            <></>
          )}
          {selectedQuestionBank && selectedRows?.length ? (
            <Button
              buttonName={"Assign to Question Set"}
              className={"w-full "}
              handleButtonClick={() => onSubmitHandler()}
              icon={""}
            />
          ) : (
            <AddQuestionModal asChild>
              <div>
                <TopButton
                  buttonName={"Add Question"}
                  className={""}
                  handleButtonClick={() => {}}
                />
              </div>
            </AddQuestionModal>
          )}
        </div>
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
          setSelectedRows={setSelectedRows}
          data={data?.data ?? []}
          currentPage={1}
          totalPage={1}
          emptyMessage="Oops! No Questions available right now."
        />
      </div>
    </div>
  );
}
