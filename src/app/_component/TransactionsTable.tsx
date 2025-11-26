import { useListDataStore, useStatusDataStore, useTypeDataStore } from "@/assets/store";
import { useMemo, useState } from "react";
import { DataTableProps, PaymentsListProps } from "@/assets/type";
import { commaFc } from "@/assets/fc";

export default function TransactionsTable(props: DataTableProps) {
    const { data, isLoading } = useListDataStore(); //거래내역 data
    const statusData = useStatusDataStore((state) => state.data); //결제 상태 data
    const typeData = useTypeDataStore((state) => state.data); //결제 수단 data
    const [orderAsc, setOrderAsc] = useState(true); //오름차순

    const transactionsData = [...data];
    if (orderAsc) {
        //오름차순 1일~ 10일
        transactionsData.sort(
            (a, b) => new Date(a.paymentAt).getTime() - new Date(b.paymentAt).getTime(),
        );
    } else {
        //내림차순 10일~1일 (오늘 날짜와 가까운 순서)
        transactionsData.sort(
            (a, b) => new Date(b.paymentAt).getTime() - new Date(a.paymentAt).getTime(),
        );
    }

    //한 화면에 보이는 데이터
    let sliceData;

    //필터 조건 활성화 확인
    const activeFilters =
        props.filterSearch !== undefined && props.filterSearch.filter((f) => f.checked !== null);

    //필터 조건 확인
    const filteredData = useMemo(() => {
        return transactionsData.filter((item) => {
            if (props.filterSearch === undefined) return;
            return props.filterSearch
                .filter((f) => f.checked !== null)
                .every((f) => item[f.name as keyof PaymentsListProps] === f.checked);
        });
    }, [props.filterSearch]);

    if (Array.isArray(props.sliceCount)) {
        //props.sliceCount 값이 배열일 때
        if (activeFilters) {
            if (activeFilters.length > 0) {
                sliceData = filteredData.slice(props.sliceCount[0], props.sliceCount[1]);
                console.log(props.activeFilters, filteredData);
            } else {
                sliceData = transactionsData.slice(props.sliceCount[0], props.sliceCount[1]);
            }
        }
    } else {
        //배열이 아닐 때
        sliceData = data.slice(props.sliceCount);
    }

    return (
        <table className="w-full">
            <caption className="pb-[10px] text-black text-left text-[16px]">
                {props.captionText}
            </caption>
            {!props.main ? (
                <colgroup>
                    <col style={{ width: "22%" }} />
                    <col style={{ width: "auto" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "auto" }} />
                </colgroup>
            ) : (
                <colgroup>
                    <col style={{ width: "30%" }} />
                    <col style={{ width: "auto" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "auto" }} />
                </colgroup>
            )}
            <thead>
                <tr className="box-content overflow-hidden bg-[#EEEFF0]">
                    <th className="py-[10px] text-black text-[14px] font-normal rounded-l-[10px]">
                        결제 일시
                        {!props.main && (
                            <button
                                type="button"
                                className="align-middle cursor-pointer"
                                onClick={() => setOrderAsc(!orderAsc)}
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path
                                        d="M3 6L7 2L11 6H3Z"
                                        fill={`${orderAsc ? "#1D1B20" : "#A0A8AF"}`}
                                    />
                                    <path
                                        d="M11 8L7 12L3 8L11 8Z"
                                        fill={`${orderAsc ? "#A0A8AF" : "#1D1B20"}`}
                                    />
                                </svg>
                            </button>
                        )}
                    </th>
                    {!props.main && (
                        <th className="pl-[10px] py-[10px] text-black text-[14px] font-normal text-left">
                            가맹점
                        </th>
                    )}
                    <th className="pl-[10px] py-[10px] text-black text-[14px] font-normal text-left">
                        결제 금액
                    </th>
                    <th className="pl-[10px] py-[10px] text-black text-[14px] font-normal text-left">
                        결제수단
                    </th>
                    {!props.main && (
                        <th className="py-[10px] text-black text-[14px] font-normal ">거래코드</th>
                    )}
                    <th className="py-[10px] text-black text-[14px] font-normal rounded-r-[10px]">
                        상태
                    </th>
                </tr>
            </thead>
            <tbody>
                {!isLoading ? (
                    <tr>
                        <td className="p-[10px]">Loading...</td>
                    </tr>
                ) : (
                    sliceData?.map((el, idx) => {
                        const status = statusData.find((t) => t.code === el.status);
                        const type = typeData.find((t) => t.type === el.payType);
                        const amountCurrency = [
                            {
                                name: "KRW",
                                currency: "₩",
                            },
                            {
                                name: "USD",
                                currency: "$",
                            },
                        ];
                        return (
                            <tr key={idx}>
                                <td className="p-[10px] text-black text-[14px]">
                                    {el.paymentAt.replace("T", " ")}
                                </td>
                                {!props.main && (
                                    <td className="p-[10px] text-black text-[14px]">
                                        {el.mchtCode}
                                    </td>
                                )}
                                <td className="p-[10px] text-black text-[14px]">
                                    {
                                        amountCurrency.find((item) => item.name === el.currency)
                                            ?.currency
                                    }{" "}
                                    {el.currency === "KRW"
                                        ? commaFc(el.amount, "KRW")
                                        : commaFc(el.amount, "USD")}
                                </td>
                                <td className="p-[10px] text-black text-[14px]">
                                    {type?.description}
                                </td>
                                {!props.main && (
                                    <td className="p-[10px] text-black text-[14px]">
                                        {el.paymentCode}
                                    </td>
                                )}
                                <td
                                    className={`p-[10px] text-center  text-[14px] ${status?.code.toLowerCase()}`}
                                >
                                    {status?.description}
                                </td>
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
    );
}
