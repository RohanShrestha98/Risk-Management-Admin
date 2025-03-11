import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import TopButton from "@/components/TopButton";
import { useCourseData, useNotificationData } from "@/hooks/useQueryData";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import { ConvertHtmlToPlainText } from "@/utils/convertHtmlToPlainText";
import AddNotificationModal from "./AddNotificationModal";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import DeleteModal from "@/components/DeleteModal";
import moment from "moment";
import { FiSend } from "react-icons/fi";
import { usePublishNotificationMutation } from "@/hooks/useMutateData";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import FilterSearch from "@/components/FilterSearch";

export default function Notification() {
  const [selectedField, setSelectedField] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const [error, setError] = useState();
  const { data, isLoading, isError } = useNotificationData(
    searchText,
    selectedField,
    pageSize,
    page
  );
  const { data: courseData } = useCourseData();
  const courseOptions = convertToSelectOptions(courseData?.data);
  const publishNotificationMutation = usePublishNotificationMutation();

  const handlePublish = async (id) => {
    try {
      const response = await publishNotificationMutation.mutateAsync([
        "post",
        `${id}`,
      ]);
      toast.success("Notification published successfully");
    } catch (err) {
      toast.error("error", err?.response?.data?.errors?.error);
      setError(err?.response?.data?.errors);
    }
  };
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
        id: "title",
        cell: (info) => {
          return (
            <p className="flex items-center gap-1 line-clamp-1">
              {info?.row?.original?.title ?? "-"}
            </p>
          );
        },
        header: () => <span>Notification</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.description,
        id: "description",
        cell: (info) => {
          return (
            <p className="flex items-center gap-1">
              {info?.row?.original?.description
                ? ConvertHtmlToPlainText(
                    info?.row?.original?.description?.slice(0, 50)
                  )
                : "-"}
            </p>
          );
        },
        header: () => <span>Description</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.recipient,
        id: "recipient",
        header: () => <span>Recipient</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.notificationType,
        id: "notificationType",
        header: () => <span>Type</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.scheduledDate,
        id: "scheduledDate",
        cell: (info) => {
          return (
            <p className="flex items-center gap-1">
              {moment(info?.row?.original?.scheduledDate).format(
                "MMM Do YYYY, h:mm:ss a"
              )}
            </p>
          );
        },
        header: () => <span>Schedule Date</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row,
        id: "action",
        cell: (info) => {
          return (
            <div className="flex gap-2 text-base justify-center">
              <FiSend
                onClick={() => handlePublish(info?.row?.original?.id)}
                className="text-green-600 cursor-pointer"
              />
              <AddNotificationModal asChild edit editData={info?.row?.original}>
                <FiEdit2 className="text-[#4365a7] cursor-pointer" />
              </AddNotificationModal>
              <DeleteModal
                asChild
                desc={"Are you sure you want to delete this notification"}
                title={"Delete Notification"}
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
          inputPlaceholder={"Search Notification"}
          setSearchText={setSearchText}
          selectPlaceholder={"Select Course"}
        />
        <AddNotificationModal asChild>
          <div>
            <TopButton
              buttonName={"Add Notification"}
              className={""}
              handleButtonClick={() => {}}
            />
          </div>
        </AddNotificationModal>
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
          emptyMessage="Oops! No Notification available right now."
        />
      </div>
    </div>
  );
}
