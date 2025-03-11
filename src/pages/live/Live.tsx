import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import TopButton from "@/components/TopButton";
import { useLiveData, useLiveGroupData } from "@/hooks/useQueryData";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import AddLiveModal from "./AddLiveModal";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import DeleteModal from "@/components/DeleteModal";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import FilterSearch from "@/components/FilterSearch";

export default function Live() {
  const [selectedField, setSelectedField] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const { data, isLoading, isError } = useLiveData(
    searchText,
    selectedField,
    pageSize,
    page
  );
  const { data: liveGroupData } = useLiveGroupData();

  const liveGroupOptions = convertToSelectOptions(liveGroupData?.data);

  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        id: "id",
        header: () => <span>S.N.</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.topic,
        id: "topic",
        header: () => <span>Topic</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.email,
        id: "email",
        header: () => <span>Email</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.meetingID,
        id: "meetingID",
        header: () => <span>Meeting ID</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.start_time,
        id: "start_time",
        cell: (info) => {
          return (
            <p className="flex items-center gap-1">
              {moment(info?.row?.original?.start_time).format(
                "MMM Do YYYY, h:mm:ss a"
              )}
            </p>
          );
        },
        header: () => <span>Start time</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.duration,
        id: "duration",
        cell: (info) => {
          return <p>{info?.row?.original?.duration + " days"}</p>;
        },
        header: () => <span>Duration</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row,
        id: "action",
        cell: (info) => {
          return (
            <div className="flex gap-2 text-base justify-center">
              <AddLiveModal asChild edit editData={info?.row?.original}>
                <FiEdit2 className="text-[#4365a7] cursor-pointer" />
              </AddLiveModal>
              <DeleteModal
                asChild
                desc={"Are you sure you want to delete this live"}
                title={"Delete Live"}
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
          options={liveGroupOptions}
          inputPlaceholder={"Search Live "}
          setSearchText={setSearchText}
          selectPlaceholder={"Select Live Group"}
        />
        <AddLiveModal asChild>
          <div>
            <TopButton
              buttonName={"Add Live"}
              className={""}
              handleButtonClick={() => {}}
            />
          </div>
        </AddLiveModal>
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
          emptyMessage="Oops! No Live available right now."
        />
      </div>
    </div>
  );
}
