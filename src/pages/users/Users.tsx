import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import { useCourseData, useReportData } from "@/hooks/useQueryData";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import { FaPlus } from "react-icons/fa6";
import AddManualPaymentModal from "./AddManualPaymentModal";
import { useSearchParams } from "react-router-dom";

export default function Users() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const [selectedField, setSelectedField] = useState("");
  const { data, isLoading, isError } = useReportData(
    searchText,
    selectedField,
    pageSize,
    page
  );
  const { data: courseData } = useCourseData();
  const courseOptions = convertToSelectOptions(courseData?.data);
  // const rowType = {
  //     row : string,
  // }

  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        id: "id",
        header: () => <span>S.N.</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.firstName,
        id: "firstName",
        cell: (info) => {
          return (
            <div className="flex items-center gap-1">
              {" "}
              <p className="flex items-center gap-1">
                {info?.row?.original?.firstName === ""
                  ? "-"
                  : info?.row?.original?.firstName + " "}
                {info?.row?.original?.middleName + " "}
                {info?.row?.original?.lastName}
              </p>
            </div>
          );
        },
        // info.getValue(),
        header: () => <span>Student Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.email,
        id: "email",
        cell: (info) => {
          return (
            <p>
              {info?.row?.original?.email === ""
                ? "-"
                : info?.row?.original?.email}
            </p>
          );
        },
        header: () => <span>Email</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.phone,
        id: "phone",
        cell: (info) => {
          return (
            <p>
              {info?.row?.original?.phoneNumber === ""
                ? "-"
                : info?.row?.original?.phoneNumber}
            </p>
          );
        },
        header: () => <span>Phone Number</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.isVerified,
        id: "isVerified",
        cell: (info) => {
          return (
            <p
              className={`inline-block text-xs px-4 cursor-default rounded-full py-[2px] font-medium ${
                info?.row?.original?.isVerified
                  ? "text-white bg-[#027A48]"
                  : "text-white bg-red-500"
              }`}
            >
              {info?.row?.original?.isVerified ? "Verified" : "Not verified"}
            </p>
          );
        },
        // info.getValue(),
        header: () => <span>Verified</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.role?.title,
        id: "role",
        header: () => <span>Verified</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row,
        id: "action",
        cell: (info) => {
          return (
            <div className="flex gap-2  justify-center">
              <AddManualPaymentModal
                asChild
                edit
                editData={info?.row?.original}
              >
                <div className="border border-[#4365a7] text-xs font-medium flex items-center gap-1 px-4 py-1 rounded-full cursor-pointer text-[#4365a7] hover:bg-[#4365a7] hover:text-white">
                  <FaPlus /> Add Payment
                </div>
              </AddManualPaymentModal>
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
          emptyMessage="Oops! No Report available right now."
        />
      </div>
    </div>
  );
}
