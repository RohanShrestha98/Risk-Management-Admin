import SearchPagination from "@/components/SearchPagination";
import {
  useChapterData,
  useContentData,
  useUnitData,
} from "@/hooks/useQueryData";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import DeleteModal from "@/components/DeleteModal";
import { FaRegTrashCan, FaPlus } from "react-icons/fa6";
import Button from "@/ui/Button";
import AddChapterModal from "./AddChapterModal";
import AddContentModal from "./AddContentModal";
import chapterImage from "../../assets/chapter.jpg";
import { useSearchParams } from "react-router-dom";
import { SortableList } from "@/sortable/SortableList";
import FilterSearch from "@/components/FilterSearch";
import AddUnitModal from "../units/AddUnitModal";
import TopButton from "@/components/TopButton";
import { useChapterPositionUpdateMutation } from "@/hooks/useMutateData";
import toast from "react-hot-toast";

export default function Chapters() {
  const [selectedField, setSelectedField] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(
    searchParams.get("searchText") ?? ""
  );
  const [pageSize, setPageSize] = useState(
    searchParams.get("pageSize") ?? "10"
  );
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const [selectedChapter, setSelectedChapter] = useState();
  const [selectedContent, setSelectedContent] = useState();
  const { data, isLoading, isError } = useChapterData(
    "",
    selectedField,
    pageSize,
    page
  );
  const {
    data: contentData,
    isLoading: contentIsLoading,
    isError: contentIsError,
  } = useContentData(
    searchText,
    selectedChapter?.id ?? data?.data?.[0]?.id,
    "20",
    "1"
  );
  const { data: unitData } = useUnitData();
  const unitOptions = convertToSelectOptions(unitData?.data);
  const [dragData, setDragData] = useState([]);
  const [dragContentData, setDragContentData] = useState([]);
  const positionUpdateMutation = useChapterPositionUpdateMutation();

  useEffect(() => {
    setDragData(data?.data);
  }, [data?.data, isLoading]);

  useEffect(() => {
    setDragContentData(contentData?.data);
  }, [contentData?.data, isLoading]);

  const handleUpdateChapterPosition = async () => {
    const chapterIDs = [];
    dragData?.map((item) => {
      return chapterIDs?.push(item?.id);
    });
    const postData = {
      chapterIDs: chapterIDs,
    };
    try {
      const response = await positionUpdateMutation.mutateAsync([
        "patch",
        "",
        postData,
      ]);
      toast.success("Chapter position update successfully");
    } catch (err) {
      console.log("err", err);
      toast.error(err?.response?.data?.errors?.error);
    }
  };

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
          setSearchText={setSearchText}
          options={unitOptions}
          inputPlaceholder={"Search content"}
          selectPlaceholder={"Select Unit"}
        />
        <div className="flex items-center gap-2">
          {selectedField && (
            <Button
              buttonName={"Update Chapter Position"}
              handleButtonClick={handleUpdateChapterPosition}
            />
          )}

          <AddChapterModal asChild>
            <div>
              <Button
                icon={<FaPlus />}
                buttonName={"Add Chapter"}
                handleButtonClick={() => {}}
              />
            </div>
          </AddChapterModal>
        </div>
      </div>
      <div className="">
        <SearchPagination
          totalPage={data?.totalPage}
          setPage={setPage}
          page={page}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
        <div className="grid grid-cols-2 bg-white">
          <div
            className={`border flex flex-col gap-2 p-2 ${
              selectedField && "bg-blue-50"
            }`}
          >
            <div className="w-full  flex flex-col gap-2  h-[70vh] overflow-auto">
              {isLoading ? (
                <>Loading</>
              ) : isError ? (
                <>Error</>
              ) : data?.data ? (
                <div>
                  <SortableList
                    items={dragData ?? []}
                    onChange={setDragData}
                    renderItem={(item, index) => (
                      <SortableList.Item id={item?.id}>
                        <div
                          key={item?.id}
                          onClick={() => setSelectedChapter(item)}
                          className={`flex border  cursor-pointer justify-between items-center rounded-xl p-2 px-3 w-full ${
                            item?.id === selectedChapter?.id ||
                            (!selectedChapter &&
                              item?.id === data?.data?.[0]?.id)
                              ? "bg-blue-100"
                              : "bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {selectedField ? (
                              <SortableList.DragHandle>
                                <div className="min-w-16 w-16 h-16 min-h-16 rounded-xl bg-gray-100">
                                  <img
                                    src={chapterImage}
                                    className="h-full w-full object-cover rounded-xl"
                                    alt=""
                                  />
                                </div>
                              </SortableList.DragHandle>
                            ) : (
                              <div className="min-w-16 w-16 h-16 min-h-16 rounded-xl bg-gray-100">
                                <img
                                  src={chapterImage}
                                  className="h-full w-full object-cover rounded-xl"
                                  alt=""
                                />
                              </div>
                            )}
                            <p className="text-sm text-[#333333] font-medium line-clamp-1">
                              {index + 1 + " . "}
                              {item?.title}
                            </p>
                          </div>
                          <div className="flex gap-2 text-base justify-center">
                            <AddChapterModal asChild edit editData={item}>
                              <FiEdit2 className="text-[#4365a7] cursor-pointer" />
                            </AddChapterModal>
                            <DeleteModal
                              asChild
                              desc={
                                "Are you sure you want to delete this chapter"
                              }
                              title={"Delete Chapter"}
                              id={item?.id}
                            >
                              <FaRegTrashCan className="text-red-600 cursor-pointer" />
                            </DeleteModal>
                          </div>
                        </div>
                      </SortableList.Item>
                    )}
                  />
                </div>
              ) : (
                <>Empty</>
              )}
            </div>
          </div>
          <div className="border flex flex-col gap-2 p-2">
            <div className="flex items-center justify-between">
              <h1 className="text-[#333333] text-base font-medium">
                {selectedChapter?.title ?? data?.data?.[0]?.title}
              </h1>
              <AddContentModal
                asChild
                chapterId={selectedChapter?.id ?? data?.data?.[0]?.id}
              >
                <div>
                  <Button
                    icon={<FaPlus />}
                    buttonName={"Add Content"}
                    handleButtonClick={() => {}}
                  />
                </div>
              </AddContentModal>
            </div>
            <div className="w-full  flex flex-col gap-2  h-[70vh] overflow-auto">
              {contentIsLoading ? (
                <>Loading...</>
              ) : contentIsError ? (
                <>Error</>
              ) : contentData?.data?.length > 0 ? (
                <>
                  <SortableList
                    items={dragContentData ?? []}
                    onChange={setDragContentData}
                    renderItem={(item, index) => (
                      <SortableList.Item id={item?.id}>
                        <div
                          key={item?.id}
                          onClick={() => setSelectedContent(item)}
                          className={`flex border  cursor-pointer justify-between items-center rounded-xl p-2 px-3 w-full ${
                            (item?.id === selectedContent?.id ||
                              (!selectedContent &&
                                item?.id === data?.data?.[0]?.id)) &&
                            "bg-blue-100"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <SortableList.DragHandle>
                              <div className="max-w-16 max-h-16 w-16 h-16 rounded-xl bg-red-100">
                                <img
                                  src={chapterImage}
                                  className="h-full w-full object-cover rounded-xl"
                                  alt=""
                                />
                              </div>
                            </SortableList.DragHandle>
                            <p className="text-sm text-[#333333] font-medium line-clamp-1">
                              {index + 1 + " . "}
                              {item?.title}
                            </p>
                          </div>
                          <div className="flex gap-2 text-base justify-center">
                            <AddContentModal
                              asChild
                              edit
                              editData={item}
                              chapterId={
                                selectedChapter?.id ?? data?.data?.[0]?.id
                              }
                            >
                              <FiEdit2 className="text-[#4365a7] cursor-pointer" />
                            </AddContentModal>
                            <DeleteModal
                              asChild
                              desc={
                                "Are you sure you want to delete this course"
                              }
                              title={"Delete Course"}
                              id={item?.id}
                            >
                              <FaRegTrashCan className="text-red-600 cursor-pointer" />
                            </DeleteModal>
                          </div>
                        </div>
                      </SortableList.Item>
                    )}
                  />
                </>
              ) : (
                <>Empty</>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
