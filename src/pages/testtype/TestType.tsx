import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import TopButton from "@/components/TopButton";
import { useTestTypeData } from "@/hooks/useQueryData";
import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import AddTestTypeModal from "./AddTestTypeModal";
import DeleteModal from "@/components/DeleteModal";
import { useSearchParams } from "react-router-dom";

export default function TestType() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const { data, isLoading, isError } = useTestTypeData(pageSize, page);
  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        id: "id",
        header: () => <span>S.N.</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row?.Title,
        id: "subjectTitle",
        header: () => <span>Title</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row,
        id: "action",
        cell: (info) => {
          return (
            <div className="flex gap-2 text-base justify-center">
              <AddTestTypeModal asChild edit editData={info?.row?.original}>
                <FiEdit2 className="text-[#4365a7] cursor-pointer" />
              </AddTestTypeModal>
              <DeleteModal
                asChild
                desc={"Are you sure you want to delete this test type"}
                title={"Delete Test Type"}
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
      page: page,
      pageSize: pageSize,
    };
    setSearchParams(searchQuery);
  }, [page, pageSize]);

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-end items-center">
        <AddTestTypeModal asChild>
          <div>
            <TopButton
              buttonName={"Add Test Type"}
              className={""}
              handleButtonClick={() => {}}
            />
          </div>
        </AddTestTypeModal>
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
          emptyMessage="Oops! No Test Type available right now."
        />
      </div>
    </div>
  );
}
