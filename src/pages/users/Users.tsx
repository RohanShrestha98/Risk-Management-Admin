import { useEffect, useState } from "react";
import { useReportData, useRiskData } from "@/hooks/useQueryData";
import { useSearchParams } from "react-router-dom";
import { FiFileText } from "react-icons/fi";

export default function Users() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const [selectedFile, setSelectedFile] = useState([]);
  const { data, isLoading, isError } = useRiskData(
    searchText,
    selectedFile?.id,
    pageSize,
    page
  );
  // const rowType = {
  //     row : string,
  // }

  useEffect(() => {
    const searchQuery = {
      searchText: searchText,
      page: page,
      pageSize: pageSize,
    };
    setSearchParams(searchQuery);
  }, [page, pageSize, searchText]);

  return (
    <div className="flex p-4 gap-4 ">
      <div className="p-4 w-1/2 border bg-white flex gap-3 justify-between px-5 flex-wrap ">
        {data?.data?.map((item, index) => {
          return (
            <div
              key={index}
              className="min-w-[100px] flex flex-col gap-2 items-center text-sm max-w-[100px] border rounded-xl border-gray-400 cursor-pointer bg-gray-100 py-12 hover:bg-slate-200"
              onClick={() => setSelectedFile(item)}
            >
              <div className=" text-gray-600 text-[20px]">
                <FiFileText />
              </div>
              {item?.title}
            </div>
          );
        })}
      </div>
      <div className="w-1/2 bg-white border p-4">
        {!selectedFile ? (
          <div className="">
            <div className="flex justify-between mb-6 gap-4">
              <p className="text-lg font-medium"> {data?.data?.[0]?.title}</p>
              <div className="text-sm">
                <p>
                  <span className="font-semibold">Action : </span>
                  {data?.data?.[0]?.action}
                </p>
                <p>
                  <span className="font-semibold">Status : </span>
                  {data?.data?.[0]?.status}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <p className="text-sm">
                <span className="font-semibold">Created by : </span>{" "}
                {data?.data?.[0]?.createdby}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Threat level :</span>{" "}
                {data?.data?.[0]?.threatlevel}
              </p>
            </div>

            <div className="text-sm flex gap-2">
              <p className="font-semibold">Assignees : </p>
              <div className="flex gap-2">
                {data?.data?.[0]?.assignees?.map((item) => {
                  <p>{item?.username}</p>;
                })}
              </div>
            </div>
            <p className="text-sm">
              <span className="font-semibold">Risk :</span>{" "}
              {data?.data?.[0]?.risk}
            </p>
            <p className="text-sm font-semibold mt-4">Description</p>
            <p className="text-sm">risk : {data?.data?.[0]?.description}</p>
          </div>
        ) : (
          <div className="">
            <div className="flex justify-between mb-6 gap-4">
              <p className="text-lg font-medium"> {selectedFile?.title}</p>
              <div className="text-sm">
                <p>
                  <span className="font-semibold">Action : </span>
                  {selectedFile?.action}
                </p>
                <p>
                  <span className="font-semibold">Status : </span>
                  {selectedFile?.status}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <p className="text-sm">
                <span className="font-semibold">Created by : </span>{" "}
                {selectedFile?.createdby}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Threat level :</span>{" "}
                {selectedFile?.threatlevel}
              </p>
            </div>

            <div className="text-sm flex gap-2">
              <p className="font-semibold">Assignees : </p>
              <div className="flex gap-2">
                {selectedFile?.assignees?.map((item) => {
                  <p>{item?.username}</p>;
                })}
              </div>
            </div>
            <p className="text-sm">
              <span className="font-semibold">Risk :</span> {selectedFile?.risk}
            </p>
            <p className="text-sm font-semibold mt-4">Description</p>
            <p className="text-sm">risk : {selectedFile?.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
