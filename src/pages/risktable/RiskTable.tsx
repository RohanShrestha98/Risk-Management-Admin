import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import TopButton from "@/components/TopButton";
import { useRiskData } from "@/hooks/useQueryData";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import AddCourseModal from "./AddRiskTableModal";
import DeleteModal from "@/components/DeleteModal";
import truncateText from "@/utils/truncateText";
import { useSearchParams } from "react-router-dom";
import { useCourseUpdateStatusMutation } from "@/hooks/useMutateData";
import toast from "react-hot-toast";
import AddRiskTableModal from "./AddRiskTableModal";

export default function RiskTable() {
  const [selectedField, setSelectedField] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const { data, isLoading, isError } = useRiskData(
    searchText,
    selectedField,
    pageSize,
    page
  );

  const courseUpdateStatus = useCourseUpdateStatusMutation();

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
        accessorFn: (row) => row?.threatLevel,
        id: "threatLevel",
        header: () => <span>Threat Level</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.risk,
        id: "risk",
        header: () => <span>Risk</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.action,
        id: "action",
        header: () => <span>Action</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.createdBy,
        id: "createdBy",
        header: () => <span>createdBy</span>,
        cell: (info) => {
          return (
            <div className="flex gap-2 text-base justify-center">
              {info?.row?.original?.createdBy?.username}
            </div>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.status,
        id: "status",
        header: () => <span>Status</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row,
        id: "action",
        cell: (info) => {
          console.log("info", info);
          return (
            <div className="flex gap-2 text-base justify-center">
              <AddCourseModal asChild edit editData={info?.row?.original}>
                <FiEdit2 className="text-[#4365a7] cursor-pointer" />
              </AddCourseModal>
              <DeleteModal
                asChild
                desc={"Are you sure you want to delete this action"}
                title={"Delete Action"}
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
      <div className="flex justify-end items-center">
        <AddRiskTableModal asChild>
          <div>
            <TopButton
              buttonName={"Add Risk"}
              className={""}
              handleButtonClick={() => {}}
            />
          </div>
        </AddRiskTableModal>
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
          emptyMessage="Oops! No Action available right now."
        />
      </div>
    </div>
  );
}
