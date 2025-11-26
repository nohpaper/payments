"use client";
import { useListDataStore, useStatusDataStore, useTypeDataStore } from "@/assets/store";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TransactionsTable from "@/app/_component/TransactionsTable";
import { FilterProps } from "@/assets/type";

const LIMIT_PAGE = 15;
export default function TransactionsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.get("page");
    const loadSearchPage = search === null ? 1 : search; //페이지 진입 시 search값이 null일 경우 1로 반환
    const { data, isLoading } = useListDataStore(); //거래내역 data
    const statusData = useStatusDataStore((state) => state.data); //결제 상태
    const typeData = useTypeDataStore((state) => state.data); //결제 상태
    const [displayCount, setDisplayCount] = useState([
        LIMIT_PAGE * (Number(search) - 1),
        LIMIT_PAGE * Number(search),
    ]); //페이지에 보일 범위
    const [currentPage, setCurrentPage] = useState(loadSearchPage); //현재 페이지
    const [filterSearch, setFilterSearch] = useState<FilterProps[]>([
        { name: "currency", checked: null },
        { name: "payType", checked: null },
        { name: "status", checked: null },
    ]); //검색 필터

    const totalPage = useMemo(() => {
        if (!isLoading || !data || data.length === 0) return 1;
        return Math.ceil(data.length / LIMIT_PAGE);
    }, [data, isLoading]);

    //필터 조건 state 에 삽입/제거
    const changeFilter = (value: string, keyName: string) => {
        setFilterSearch((prev) =>
            prev.map((item) => {
                if (item.name === keyName) {
                    if (item.checked === null || item.checked !== value) {
                        return { ...item, checked: value };
                    } else {
                        return { ...item, checked: null };
                    }
                }

                return item;
            }),
        );
    };

    return (
        <div className="w-[1120px] flex flex-wrap gap-[20px] ml-[334px] px-[110px]">
            {/*필터*/}
            <div className="grid_component mt-[20px] flex flex-col gap-[6px]">
                <div className="flex">
                    <p className="min-w-[56px] text-black text-[14px]">통화</p>
                    <ul className="flex gap-[6px] pl-[4px]">
                        <li className="filter_btn">
                            <input
                                type="checkbox"
                                id="KRW"
                                name="currency"
                                value="KRW"
                                checked={
                                    filterSearch.find((f) => f.name === "currency")?.checked ===
                                    "KRW"
                                }
                                onChange={(e) => changeFilter(e.target.value, "currency")}
                            />
                            <label htmlFor="KRW">KRW</label>
                        </li>
                        <li className="filter_btn">
                            <input
                                type="checkbox"
                                id="USD"
                                name="currency"
                                value="USD"
                                checked={
                                    filterSearch.find((f) => f.name === "currency")?.checked ===
                                    "USD"
                                }
                                onChange={(e) => changeFilter(e.target.value, "currency")}
                            />
                            <label htmlFor="USD">USD</label>
                        </li>
                    </ul>
                </div>
                <div className="flex">
                    <p className="min-w-[56px] text-black text-[14px]">결제수단</p>
                    <ul className="flex gap-[6px] pl-[4px]">
                        {typeData.map((el, idx) => {
                            return (
                                <li key={idx} className="filter_btn">
                                    <input
                                        type="checkbox"
                                        id={el.type}
                                        name="payType"
                                        value={el.type}
                                        checked={
                                            filterSearch.find((f) => f.name === "payType")
                                                ?.checked === el.type
                                        }
                                        onChange={(e) => changeFilter(e.target.value, "payType")}
                                    />
                                    <label htmlFor={el.type}>{el.description}</label>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="flex">
                    <p className="min-w-[56px] text-black text-[14px]">상태</p>
                    <ul className="flex gap-[6px] pl-[4px]">
                        {statusData.map((el, idx) => {
                            return (
                                <li key={idx} className="filter_btn">
                                    <input
                                        type="checkbox"
                                        id={el.code}
                                        name="status"
                                        value={el.code}
                                        checked={
                                            filterSearch.find((f) => f.name === "status")
                                                ?.checked === el.code
                                        }
                                        onChange={(e) => changeFilter(e.target.value, "status")}
                                    />
                                    <label htmlFor={el.code}>{el.description}</label>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
            <div className="grid_component">
                <TransactionsTable
                    captionText={"전체 거래 내역"}
                    sliceCount={displayCount}
                    main={false}
                    filterSearch={filterSearch}
                />
                <ul className="flex justify-center gap-[6px] pt-[20px]">
                    {Array.from({ length: totalPage }, (_, i) => (
                        <li
                            key={i}
                            onClick={() => {
                                setCurrentPage(i + 1);
                                router.push(`transactions?page=${i + 1}`, {
                                    scroll: true,
                                });
                                setDisplayCount([LIMIT_PAGE * i, LIMIT_PAGE * (i + 1)]);
                                console.log("in:  ", i + 1);
                            }}
                            className={`px-[10px] py-[4px] cursor-pointer ${Number(currentPage) === i + 1 ? "text-black" : "text-[#878787]"} hover:text-black`}
                        >
                            {i + 1}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
