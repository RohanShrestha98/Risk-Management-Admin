import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import { useCourseData, useFeedbackData } from "@/hooks/useQueryData";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import { useSearchParams } from "react-router-dom";
import FilterSearch from "@/components/FilterSearch";

export default function Feedbacks() {
    const [selectedField, setSelectedField] = useState("")
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchText, setSearchText] = useState(searchParams.get('searchText') ?? "")
    const [pageSize, setPageSize] = useState(searchParams.get('pageSize') ?? "10")
    const [page, setPage] = useState(searchParams.get('page') ?? 1)
    const { data, isLoading, isError } = useFeedbackData(searchText, selectedField, pageSize, page)
    const { data: courseData } = useCourseData()
    const courseOptions = convertToSelectOptions(courseData?.data)

    const columns = useMemo(
        () => [
            {
                accessorFn: row => row?.code,
                id: "code",
                header: () => <span>Referal code</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row?.courseTitle,
                id: "course",
                header: () => <span>Course Name</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row?.courseID,
                id: "destination",
                header: () => <span>Course ID</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row?.discountPercent,
                id: "discountPercent",
                header: () => <span>Discount %</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row?.haslimit,
                id: "haslimit",
                cell: info => {
                    return (
                        <p className="flex items-center gap-1">
                            {info?.row?.original?.hasLimit ? "Yes" : "No"}
                        </p>
                    )
                },
                header: () => <span>Has limit</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row?.limit,
                id: "limit",
                header: () => <span>Use Limit</span>,
                footer: props => props.column.id,
            },
        ],
        [],
    );


    useEffect(() => {
        const searchQuery = {
            searchText: searchText,
            page: page,
            pageSize: pageSize,
        }
        setSearchParams(searchQuery);
    }, [page, pageSize, searchText])

    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <FilterSearch searchText={searchText} setSelectedField={setSelectedField} options={courseOptions} inputPlaceholder={"Search feedbacks"} setSearchText={setSearchText} selectPlaceholder={"Select Course"} />
            </div>
            <div>
                <SearchPagination totalPage={data?.totalPage} setPage={setPage} page={page} pageSize={pageSize} setPageSize={setPageSize} />
                <ReactTable
                    isLoading={isLoading}
                    isError={isError}
                    columns={columns}
                    data={data?.data ?? []}
                    currentPage={1}
                    totalPage={1}
                    emptyMessage = 'Oops! No Feedback available right now.'
                />
            </div>
        </div>
    )
}
