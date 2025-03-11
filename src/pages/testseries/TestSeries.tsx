import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import TopButton from "@/components/TopButton";
import { useCourseData, useTestSeriesData } from "@/hooks/useQueryData";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import AddTestSeriesModal from "./AddTestSeriesModal";
import DeleteModal from "@/components/DeleteModal";
import moment from "moment";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import truncateText from "@/utils/truncateText";
import { useSearchParams } from "react-router-dom";
import FilterSearch from "@/components/FilterSearch";

export default function TestSeries() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const [selectedField, setSelectedField] = useState("");
  const { data, isLoading, isError } = useTestSeriesData(
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
        id: "subjectTitle",
        header: () => <span>Title</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.description,
        id: "description",
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
        accessorFn: (row) => row?.noOfTests,
        id: "noOfTests",
        header: () => <span>No of tests</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.startDate,
        id: "startDate",
        cell: (info) => {
          return (
            <p className="flex items-center gap-1">
              {moment(info?.row?.original?.startDate).format(
                "MMM Do YYYY, h:mm:ss a"
              )}
            </p>
          );
        },
        header: () => <span>Start date</span>,
        footer: (props) => props.column.id,
      },

      {
        accessorFn: (row) => row,
        id: "action",
        cell: (info) => {
          return (
            <div className="flex gap-2 text-base justify-center">
              <AddTestSeriesModal asChild edit editData={info?.row?.original}>
                <FiEdit2 className="text-[#4365a7] cursor-pointer" />
              </AddTestSeriesModal>
              <DeleteModal
                asChild
                desc={"Are you sure you want to delete this test series"}
                title={"Delete Test Series"}
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
          inputPlaceholder={"Search test series"}
          setSearchText={setSearchText}
          selectPlaceholder={"Select Course"}
        />
        <AddTestSeriesModal asChild>
          <div>
            <TopButton
              buttonName={"Add Test Series"}
              className={""}
              handleButtonClick={() => {}}
            />
          </div>
        </AddTestSeriesModal>
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
          emptyMessage="Oops! No Test Series available right now."
        />
      </div>
    </div>
  );
}
