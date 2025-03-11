import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import TopButton from "@/components/TopButton";
import { useCourseGroupData } from "@/hooks/useQueryData";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import AddCourseGroupModal from "./AddCourseGroupModal";
import DeleteModal from "@/components/DeleteModal";
import truncateText from "@/utils/truncateText";
import { useSearchParams } from "react-router-dom";
import FilterSearch from "@/components/FilterSearch";

export default function CourseGroup() {
  const [selectedField, setSelectedField] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const { data, isLoading, isError } = useCourseGroupData(
    searchText,
    selectedField,
    pageSize,
    page
  );
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
              {info?.row?.original?.thumbnail ? (
                <img
                  className="h-8 w-8 object-cover rounded-full"
                  src={info?.row?.original?.thumbnail}
                  alt=""
                />
              ) : (
                <div className="min-h-8 min-w-8 rounded-full bg-gray-100"></div>
              )}
              <p className="flex items-center gap-1">
                {truncateText(info?.row?.original?.title, 40)}
              </p>
            </div>
          );
        },
        header: () => <span>Course Group Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.groupID,
        id: "destination",
        header: () => <span>Course Group ID</span>,
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
        accessorFn: (row) => row,
        id: "action",
        cell: (info) => {
          return (
            <div className="flex gap-2 text-base justify-center">
              <AddCourseGroupModal asChild edit editData={info?.row?.original}>
                <FiEdit2 className="text-[#4365a7] cursor-pointer" />
              </AddCourseGroupModal>
              <DeleteModal
                asChild
                desc={"Are you sure you want to delete this category"}
                title={"Delete Category"}
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
          inputPlaceholder={"Search Course Group"}
          setSearchText={setSearchText}
          select={false}
          selectPlaceholder={"Select Course"}
        />
        <AddCourseGroupModal asChild>
          <div>
            <TopButton
              buttonName={"Add Course Group"}
              className={""}
              handleButtonClick={() => {}}
            />
          </div>
        </AddCourseGroupModal>
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
          emptyMessage="Oops! No Course Group available right now."
        />
      </div>
    </div>
  );
}
