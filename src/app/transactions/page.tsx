"use client";
import { usePaymentStore } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import TransactionsTable from "@/app/_component/TransactionsTable";
import { LIMIT_PAGE } from "@/config";
import useUrl from "@/lib/hook/hook";

export default function TransactionsPage() {
    const { status, type } = usePaymentStore();

    const router = useRouter();
    const { searchParams, pathname } = useUrl();
    const currentPage = searchParams.get("page") ?? 1; //페이지 진입 시 search값이 null일 경우 1로 반환
    const queryCurrency = searchParams.get("currency");
    const queryPayType = searchParams.get("payType");
    const queryStatus = searchParams.get("status");

    //필터 조건 확인 URL 에 삽입/제거
    const changeFilter = (value: string, keyName: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (params.get(keyName) === value) {
            params.delete(keyName);
        } else {
            params.set(keyName, value);
        }

        params.set("page", "1"); // 검색 조건이 바뀌면 페이지는 1로 가야한다.
        router.push(`${pathname}?${params.toString()}`);
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
                                checked={queryCurrency === "KRW"}
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
                                checked={queryCurrency === "USD"}
                                onChange={(e) => changeFilter(e.target.value, "currency")}
                            />
                            <label htmlFor="USD">USD</label>
                        </li>
                    </ul>
                </div>
                <div className="flex">
                    <p className="min-w-[56px] text-black text-[14px]">결제수단</p>
                    <ul className="flex gap-[6px] pl-[4px]">
                        {type.map((el, idx) => {
                            return (
                                <li key={idx} className="filter_btn">
                                    <input
                                        type="checkbox"
                                        id={el.type}
                                        name="payType"
                                        value={el.type}
                                        checked={queryPayType === el.type}
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
                        {status.map((el, idx) => {
                            return (
                                <li key={idx} className="filter_btn">
                                    <input
                                        type="checkbox"
                                        id={el.code}
                                        name="status"
                                        value={el.code}
                                        checked={queryStatus === el.code}
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
                    sliceCount={[
                        LIMIT_PAGE * (Number(currentPage) - 1),
                        LIMIT_PAGE * Number(currentPage),
                    ]}
                    main={false}
                    page={Number(currentPage)}
                    currency={queryCurrency}
                    payType={queryPayType}
                    status={queryStatus}
                />
            </div>
        </div>
    );
}
