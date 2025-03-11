import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import TopButton from "@/components/TopButton";
import { useCourseData, usePackageData } from "@/hooks/useQueryData";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import { ConvertHtmlToPlainText } from "@/utils/convertHtmlToPlainText";
import AddPackageModal from "./AddPackageModal";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import DeleteModal from "@/components/DeleteModal";
import { useSearchParams } from "react-router-dom";
import FilterSearch from "@/components/FilterSearch";

export default function Package() {
  const [selectedField, setSelectedField] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const { data, isLoading, isError } = usePackageData(
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
        accessorFn: (row) => row?.title,
        id: "title",
        header: () => <span>Package Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.course?.courseID,
        id: "course",
        header: () => <span>Course Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.period,
        id: "period",
        cell: (info) => {
          return (
            <p className="flex items-center gap-1">
              {info?.row?.original?.period + " days"}
            </p>
          );
        },
        header: () => <span>Period</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.price,
        id: "price",
        header: () => <span>Amount</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.description,
        id: "duration",
        cell: (info) => {
          return (
            <p className="flex items-center gap-1">
              {ConvertHtmlToPlainText(
                info?.row?.original?.description?.slice(0, 50)
              )}
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
              <AddPackageModal asChild edit editData={info?.row?.original}>
                <FiEdit2 className="text-[#4365a7] cursor-pointer" />
              </AddPackageModal>
              <DeleteModal
                asChild
                desc={"Are you sure you want to delete this package"}
                title={"Delete Package"}
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
          inputPlaceholder={"Search package"}
          setSearchText={setSearchText}
          selectPlaceholder={"Select Course"}
        />
        <AddPackageModal asChild>
          <div>
            <TopButton
              buttonName={"Add Package"}
              className={""}
              handleButtonClick={() => {}}
            />
          </div>
        </AddPackageModal>
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
          emptyMessage="Oops! No Packages available right now."
        />
      </div>
    </div>
  );
}
