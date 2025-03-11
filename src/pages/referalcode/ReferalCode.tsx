import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import TopButton from "@/components/TopButton";
import { useCourseData, useReferalCodeData } from "@/hooks/useQueryData";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import AddReferalCodeModal from "./AddReferalCodeModal";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import DeleteModal from "@/components/DeleteModal";
import { useSearchParams } from "react-router-dom";
import FilterSearch from "@/components/FilterSearch";

export default function ReferalCode() {
  const [selectedField, setSelectedField] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const { data, isLoading, isError } = useReferalCodeData(
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
        accessorFn: (row) => row?.code,
        id: "code",
        header: () => <span>Referal code</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.course?.courseID,
        id: "destination",
        header: () => <span>Course ID</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.discount,
        id: "discountPercent",
        header: () => <span>Discount %</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.haslimit,
        id: "haslimit",
        cell: (info) => {
          return (
            <p className="flex items-center gap-1">
              {info?.row?.original?.hasLimit ? "Yes" : "No"}
            </p>
          );
        },
        header: () => <span>Has limit</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.limit,
        id: "limit",
        header: () => <span>Use Limit</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row,
        id: "action",
        cell: (info) => {
          return (
            <div className="flex gap-2 text-base justify-center">
              <AddReferalCodeModal asChild edit editData={info?.row?.original}>
                <FiEdit2 className="text-[#4365a7] cursor-pointer" />
              </AddReferalCodeModal>
              <DeleteModal
                asChild
                desc={"Are you sure you want to delete this referal code"}
                title={"Delete Referal Code"}
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
          inputPlaceholder={"Search referal code"}
          setSearchText={setSearchText}
          selectPlaceholder={"Select Course"}
        />
        <AddReferalCodeModal asChild>
          <div>
            <TopButton
              buttonName={"Add Code"}
              className={""}
              handleButtonClick={() => {}}
            />
          </div>
        </AddReferalCodeModal>
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
          emptyMessage="Oops! No Referral Code available right now."
        />
      </div>
    </div>
  );
}
