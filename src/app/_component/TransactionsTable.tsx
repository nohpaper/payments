"use client";
import { usePaymentStore } from "@/lib/store/store";
import { useState } from "react";
import { DataTableProps, SearchCondition } from "@/lib/types/type";
import { commaFc } from "@/lib/utils/fc";
import { LIMIT_PAGE } from "@/config";
import { useRouter } from "next/navigation";
import useUrl from "@/lib/hook/hook";
import MchtModel from "@/app/_component/MchtModel";

export default function TransactionsTable(props: DataTableProps) {
    const { status, type, merchantsList, isLoading, getPaginationList } = usePaymentStore();
    const router = useRouter();
    const { pathname, searchParams } = useUrl();
    const mchtCode = searchParams.get("mcht");

    const [orderAsc, setOrderAsc] = useState(false); //내림차순

    const search: SearchCondition = {
        start: props.sliceCount[0],
        end: props.sliceCount[1],
        isAsc: orderAsc,
        currency: props.currency ?? null,
        status: props.status ?? null,
        payType: props.payType ?? null,
    };
    const { items, totalCount } = getPaginationList(search);

    return (
        <>
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
                        <col style={{ width: "22%" }} />
                        <col style={{ width: "auto" }} />
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
                        <th className="py-[10px] text-black text-[14px] font-normal">가맹점</th>
                        <th className="pl-[10px] py-[10px] text-black text-[14px] font-normal text-left">
                            결제 금액
                        </th>
                        <th className="pl-[10px] py-[10px] text-black text-[14px] font-normal text-left">
                            결제수단
                        </th>
                        {!props.main && (
                            <th className="py-[10px] text-black text-[14px] font-normal ">
                                거래코드
                            </th>
                        )}
                        <th className="py-[10px] text-black text-[14px] font-normal rounded-r-[10px]">
                            상태
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td className="p-[10px]">Loading...</td>
                        </tr>
                    ) : items.length === 0 ? (
                        <tr>
                            <td className="p-[10px]">검색 결과가 없습니다.</td>
                        </tr>
                    ) : (
                        items?.map((el, idx) => {
                            const statusData = status.find((t) => t.code === el.status);
                            const typeData = type.find((t) => t.type === el.payType);
                            const merchantsName =
                                merchantsList.find((m) => m.mchtCode === el.mchtCode)?.mchtName ??
                                el.mchtCode;
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
                                    <td className="p-[10px] text-black text-[14px]">
                                        {!props.main ? (
                                            <button
                                                type="button"
                                                className="cursor-pointer hover:text-[#253557]  hover:disabled:text-black disabled:text-black"
                                                disabled={!merchantsName}
                                                onClick={() => {
                                                    const params = new URLSearchParams(
                                                        searchParams.toString(),
                                                    );
                                                    params.set("mcht", el.mchtCode);
                                                    router.push(
                                                        `${pathname}?${params.toString()}`,
                                                        { scroll: false },
                                                    );
                                                }}
                                            >
                                                {merchantsName}
                                            </button>
                                        ) : (
                                            merchantsName
                                        )}
                                    </td>
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
                                        {typeData?.description}
                                    </td>
                                    {!props.main && (
                                        <td className="p-[10px] text-black text-[14px]">
                                            {el.paymentCode}
                                        </td>
                                    )}
                                    <td
                                        className={`p-[10px] text-center  text-[14px] ${statusData?.code.toLowerCase()}`}
                                    >
                                        {statusData?.description}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
            {!props.main && (
                <ul className="flex justify-center gap-[6px] pt-[20px]">
                    {Array.from({ length: Math.ceil(totalCount / LIMIT_PAGE) }, (_, i) => (
                        <li
                            key={i}
                            onClick={() => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.delete("mcht");
                                params.set("page", (i + 1).toString());
                                router.push(`${pathname}?${params.toString()}`, {
                                    scroll: true,
                                });
                            }}
                            className={`px-[10px] py-[4px] cursor-pointer ${Number(props.page) === i + 1 ? "text-black" : "text-[#878787]"} hover:text-black`}
                        >
                            {i + 1}
                        </li>
                    ))}
                </ul>
            )}
            {mchtCode !== null ? <MchtModel mchtCode={mchtCode} /> : null}
        </>
    );
}
