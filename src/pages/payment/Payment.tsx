import SearchPagination from "@/components/SearchPagination";
import { ReactTable } from "../../components/Table";
import { useEffect, useMemo, useState } from "react";
import { useCourseData, usePaymentData } from "@/hooks/useQueryData";
import { convertToSelectOptions } from "@/utils/convertToSelectOptions";
import moment from "moment";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { useSearchParams } from "react-router-dom";
import FilterSearch from "@/components/FilterSearch";

export default function Payment() {
    const [selectedField, setSelectedField] = useState("")
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchText, setSearchText] = useState(searchParams.get('searchText') ?? "")
    const [pageSize, setPageSize] = useState(searchParams.get('pageSize') ?? "10")
    const [page, setPage] = useState(searchParams.get('page') ?? 1)
    const { data, isLoading, isError } = usePaymentData(searchText, selectedField, pageSize, page)
    const { data: courseData } = useCourseData()
    const courseOptions = convertToSelectOptions(courseData?.data)

    const columns = useMemo(
        () => [
            {
                accessorFn: (row, index) => index + 1,
                id: "id",
                header: () => <span>S.N.</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row?.user?.name,
                id: "name",
                header: () => <span>User name</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row?.package,
                id: "package",
                header: () => <span>Package</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row?.amount,
                id: "amount",
                cell: info => {
                    return (
                        <p>
                            Rs {info?.row?.original?.amount}
                        </p>
                    )
                },
                header: () => <span>Amount</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row?.discount,
                id: "discount",
                cell: info => {
                    return (
                        <p>
                            Rs {info?.row?.original?.discount}
                        </p>
                    )
                },
                header: () => <span>Discount </span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row?.subscriptionPeriod,
                id: "subscriptionPeriod",
                cell: info => {
                    return (
                        <p>
                            {info?.row?.original?.subscriptionPeriod} days
                        </p>
                    )
                },
                header: () => <span>Subscription Period </span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row?.status,
                id: "haslimit",
                cell: info => {
                    return (
                        <p className={`text-white text-center rounded-full py-1 px-1 font-semibold ${info?.row?.original?.status === "success" ? "bg-green-500 " : "bg-red-500"}`}>
                            {capitalizeFirstLetter(info?.row?.original?.status)}
                        </p>
                    )
                },
                header: () => <span>Status</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row?.merchantType,
                id: "haslimit",
                cell: info => {
                    return (
                        <p className="flex items-center gap-1">
                            {info?.row?.original?.merchantType}
                        </p>
                    )
                },
                header: () => <span>Payment Type</span>,
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row?.paymentDate,
                id: "paymentDate",
                cell: info => {
                    return (
                        <p className="flex items-center gap-1">
                            {moment(info?.row?.original?.paymentDate).format("MMM Do YYYY, h:mm:ss a")}
                        </p>
                    )
                },
                header: () => <span>Payment Date</span>,
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
                <FilterSearch searchText={searchText} setSelectedField={setSelectedField} options={courseOptions} inputPlaceholder={"Search payment logs"} setSearchText={setSearchText} selectPlaceholder={"Select Course"} />
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
                />
            </div>
        </div>
    )
}
