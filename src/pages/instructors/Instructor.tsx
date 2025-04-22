import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import AddInstructorModal from "./AddInstructorModal";
import TopButton from "@/components/TopButton";
import {
  useCourseData,
  useSubjectData,
  useUserData,
} from "@/hooks/useQueryData";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import DeleteModal from "@/components/DeleteModal";
import { useSearchParams } from "react-router-dom";
import FilterSearch from "@/components/FilterSearch";

export default function Instructor() {
  const [selectedField, setSelectedField] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const { data, isLoading, isError } = useUserData(
    searchText,
    selectedField,
    pageSize,
    page,
    selectedSubject
  );
  const { data: courseData } = useCourseData();
  const courseOptions = convertToSelectOptions(courseData?.data);
  const { data: subjectData } = useSubjectData("", selectedField);
  const subjectOptions = convertToSelectOptions(subjectData?.data);

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
        id: "name",
        cell: (info) => {
          return (
            <div className="flex items-center gap-1">
              {info?.row?.original?.image ? (
                <img
                  className="h-8 w-8 object-cover rounded-full"
                  src={info?.row?.original?.image}
                  alt=""
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-100"></div>
              )}
              <p className="flex items-center gap-1">
                {info?.row?.original?.firstName + " "}
                {info?.row?.original?.middleName + " "}
                {info?.row?.original?.lastName}
              </p>
            </div>
          );
        },
        // info.getValue(),
        header: () => <span>Instructor Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.email,
        id: "email",
        header: () => <span>Email</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.phone,
        id: "phone",
        cell: (info) => info.getValue(),
        header: () => <span>Phone</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.subject?.title,
        id: "Subject",
        // info.getValue(),
        header: () => <span>Subject</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.course?.courseID,
        id: "Course",
        header: () => <span>Course</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row,
        id: "action",
        cell: (info) => {
          return (
            <div className="flex gap-2 text-base justify-center">
              <AddInstructorModal asChild edit editData={info?.row?.original}>
                <FiEdit2 className="text-[#4365a7] cursor-pointer" />
              </AddInstructorModal>
              <DeleteModal
                asChild
                desc={"Are you sure you want to delete this instructor"}
                title={"Delete Instructor"}
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
          options={courseOptions}
          subjectOptions={subjectOptions}
          inputPlaceholder={"Search Instructor"}
          setSearchText={setSearchText}
          selectPlaceholder={"Select Course"}
        />
        <AddInstructorModal asChild>
          <div>
            <TopButton
              buttonName={"Add Instructor"}
              className={""}
              handleButtonClick={""}
            />
          </div>
        </AddInstructorModal>
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
          emptyMessage="Oops! No Instructor available right now."
        />
      </div>
    </div>
  );
}
