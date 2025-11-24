"use client";
//거래내역
// https://recruit.paysbypays.com/api/v1/payments/list

// 결제 상태 코드 (결제대기("PENDING"), 결제 성공("SUCCESS")등
//https://recruit.paysbypays.com/api/v1/common/payment-status/all

// 결제 수단 (온라인("ONLINE"), 단말기 , 모바일 )
//https://recruit.paysbypays.com/api/v1/common/paymemt-type/all

//가맹점 상태 코드 (대기("READY"), 활성,  중지, 폐기)
///common/mcht-status/all
import {
    useListDataStore,
    useMchtDataStore,
    useStatusDataStore,
    useTypeDataStore,
} from "@/assets/store";
import { useEffect, useState } from "react";
import { ResponseProps, SummaryProps } from "@/assets/type";

const res = "https://recruit.paysbypays.com/api/v1";

//임의로 today
const today = "2025-11-07";
const todaySplit = today.split("-");

//서버 통신해서 가져온 data.message 가 success 맞는지 다시 한번 확인
function validateApiRes<T>(res: ResponseProps<T>) {
    if (!res || res.message !== "success") {
        throw new Error("API 응답이 잘못되었습니다.");
    }
    return res.data;
}

export default function Home() {
    //zustand store 관련 변수
    const { data, isLoading } = useListDataStore();
    const listDataInit = useListDataStore((state) => state.init); //거래내역 data init
    const statusDataInit = useStatusDataStore((state) => state.init); //결제 상태 data init
    const typeDataInit = useTypeDataStore((state) => state.init); //결제 수단 data init
    const mchtDataInit = useMchtDataStore((state) => state.init); //가맹점 상태 data init

    //promise.all 로 데이터를 가져오고 전역 상태 관리 라이브러리 zustand store 에 데이터 추가
    const dataRes = async () => {
        const [listRes, statusRes, typeRes, mchtRes] = await Promise.all([
            fetch(`${res}/payments/list`).then((res) => res.json()),
            fetch(`${res}/common/payment-status/all`).then((res) => res.json()),
            fetch(`${res}/common/paymemt-type/all`).then((res) => res.json()),
            fetch(`${res}/common/mcht-status/all`).then((res) => res.json()),
        ]);

        listDataInit(validateApiRes(listRes));
        statusDataInit(validateApiRes(statusRes));
        typeDataInit(validateApiRes(typeRes));
        mchtDataInit(validateApiRes(mchtRes));
    };

    //요약 카드 데이터
    const [summary, setSummary] = useState<SummaryProps>({
        totalAmount: {}, //통화, 합산 금액
        totalCount: 0, //거래 건수
        successRate: 0, //성공률
        failCancelCount: [0, 0], //실패/취소 건수
    });

    //페이지 진입 시 한 번만 실행
    useEffect(() => {
        const _ignore = dataRes();
    }, []);

    //데이터 로딩 확인
    useEffect(() => {
        if (isLoading && data.length > 0) {
            //data 값이 0보다 크고 로딩이 끝났을 경우
            //오늘 날짜 데이터 찾기
            const todayDate = data.filter((o) => o.paymentAt.split("T")[0] === today);
            todayDate.map((o) => {
                console.log(o.currency);
                if (!Object.keys(summary.totalAmount).includes(o.currency)) {
                    //summary.totalAmount 객체 내부에 o.currency 이름의 key 값이 없을 경우

                    summary.totalAmount = {
                        ...summary.totalAmount,
                        [o.currency]: Number(o.amount),
                    };
                } else {
                    //o.currency 이름의 key 값이 있을 경우
                    //해당 객체의 value 에 o.amount 합산
                    summary.totalAmount[o.currency] += Number(o.amount);
                }
            });
            const summaryStatus = (statusName: string) => {
                return todayDate.filter((o) => o.status === statusName);
            };
            const summaryCurrency = (currencyName: string) => {
                return todayDate.filter((o) => o.currency === currencyName);
            };
            //성공률 계산
            const successMath = (summaryStatus("SUCCESS").length * 100) / todayDate.length;

            //최상단 요약 카드에 값 삽입
            setSummary((prev) => ({
                ...prev,
                totalCount: todayDate.length,
                successRate: Number(Number(successMath).toFixed(0)),
                failCancelCount: [
                    summaryStatus("FAILED").length,
                    summaryStatus("CANCELLED").length,
                ],
            }));

            console.log(todayDate[0].currency, summaryCurrency("KRW"));
        }
    }, [data, isLoading]);

    return (
        <div className="w-[1120px] flex flex-wrap gap-[20px] mx-auto px-[110px]">
            <div className="grid_component">
                <h5 className="text-black text-[20px]">
                    오늘{" "}
                    <span className="text-[#74818E] text-[14px]">{`${todaySplit[0]}년 ${todaySplit[1]}월 ${todaySplit[2]}일`}</span>
                </h5>
                <ul className="flex justify-between pt-[30px]">
                    <li>
                        <h6 className="text-black text-[16px]">결제 금액</h6>
                        <ul className="pt-[10px]">
                            {Object.keys(summary.totalAmount).map((amount, idx) => {
                                return (
                                    <li
                                        key={idx}
                                        className="[&:nth-child(n+2)]:pt-[4px] align-center"
                                    >
                                        <p
                                            className={`w-[48px] inline-block pt-[4px] pb-[2px] text-white text-[12px] text-center rounded-[10px]  ${amount === "KRW" ? "bg-[#6B7280]" : amount === "USD" ? "bg-[#3B82F6]" : "bg-[#ababab]"}  `}
                                        >
                                            {amount}
                                        </p>
                                        <strong className="inline-block align-middle pl-[6px] text-black text-[16px] font-normal">
                                            {Object.values(summary.totalAmount)[idx]}
                                        </strong>
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                    <li>
                        <h6 className="text-black text-[16px]">거래 건수</h6>
                        <div className="flex items-end pt-[6px]">
                            <strong className="min-w-[60px] inline-block text-black text-[35px] font-normal">
                                {summary.totalCount === 0 ? "-" : summary.totalCount}
                            </strong>
                            <p className="pb-[10px] text-black text-[16px]">건</p>
                        </div>
                    </li>
                    <li>
                        <h6 className="text-black text-[16px]">성공률</h6>
                        <div className="flex items-end pt-[6px]">
                            <strong className="min-w-[60px] inline-block text-[#22C55E] text-[35px] font-normal">
                                {summary.successRate === 0 ? "-" : summary.successRate}
                            </strong>
                            <p className="pb-[10px] text-black text-[16px]">%</p>
                        </div>
                    </li>
                    <li>
                        <h6 className="text-black text-[16px]">실패/취소 건수</h6>
                        <div className="flex items-end pt-[6px]">
                            <strong className="min-w-[45px] inline-block text-[#EF4444] text-[35px] font-normal">
                                {summary.failCancelCount[0] === 0
                                    ? "-"
                                    : summary.failCancelCount[0]}
                            </strong>
                            <p className="px-[4px] pb-[10px] text-black text-[16px]">/</p>
                            <strong className="min-w-[45px] inline-block text-[#9CA3AF] text-[35px] font-normal">
                                {summary.failCancelCount[1] === 0
                                    ? "-"
                                    : summary.failCancelCount[1]}
                            </strong>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="grid_component">
                <div className="flex"></div>
            </div>
            <div className="grid_component">c</div>
        </div>
    );
}
