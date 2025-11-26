"use client";
import { useListDataStore, useStatusDataStore } from "@/assets/store";
import { useEffect, useState } from "react";
import { SummaryProps } from "@/assets/type";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { amountData, options, statusChartData } from "@/assets/chart";
import TransactionsTable from "@/app/_component/TransactionsTable";
import { commaFc, getWeekdaysUntilDate } from "@/assets/fc";

//임의로 today
const today = "2025-11-10";
const todaySplit = today.split("-");

//차트
//일별 거래 금액 추이(7일)
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
//금일 결제 상태
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
    //zustand store 관련 변수
    const { data, isLoading } = useListDataStore();
    const statusData = useStatusDataStore((state) => state.data); //결제 상태 data

    //데이터 계산
    const [summary, setSummary] = useState<SummaryProps>({
        weekIdx: new Date(today).getDay(),
        weekAmount: [
            {
                name: "KRW",
                amount: [0, 0, 0, 0, 0, 0, 0],
            },
            {
                name: "USD",
                amount: [0, 0, 0, 0, 0, 0, 0],
            },
        ],
        totalCount: 0, //거래 건수
        successRate: 0, //결제 완료
        statusCount: [],
    });

    const findStatusCount = (name: string) => {
        return summary.statusCount.find((d) => d.name === name);
    };

    //데이터 로딩 확인
    useEffect(() => {
        if (isLoading && data.length > 0) {
            //data 값이 0보다 크고 로딩이 끝났을 경우
            //오늘 날짜 데이터 찾기
            const todayDate = data.filter((o) => o.paymentAt.split("T")[0] === today);
            if (summary.weekIdx === null) return;
            //summary.weekIdx 가 1인 경우(월요일)

            //월요일부터 오늘까지의 각 data
            const week = getWeekdaysUntilDate(today);

            for (let i = 0; i < week.length; i++) {
                const weekFilter = data.filter((o) => o.paymentAt.split("T")[0] === week[i]);

                weekFilter.map((o) => {
                    const existingCurrency = summary.weekAmount.find((a) => a.name === o.currency);
                    if (existingCurrency) {
                        existingCurrency.amount[i] += Number(o.amount);
                    }
                });
            }

            const summaryStatus = (statusName: string) => {
                return todayDate.filter((o) => o.status === statusName);
            };
            //결제 완료 계산
            const successMath = (summaryStatus("SUCCESS").length * 100) / todayDate.length;

            //최상단 요약 카드에 값 삽입
            setSummary((prev) => {
                const statusDataArr = statusData.map((d) => ({
                    name: d.code,
                    dataLength: summaryStatus(d.code).length,
                }));
                return {
                    ...prev,
                    totalCount: todayDate.length,
                    successRate: Number(Number(successMath).toFixed(0)),
                    statusCount: statusDataArr,
                };
            });
        }
    }, [data, isLoading]);

    return (
        <div className="w-[1120px] flex flex-wrap gap-[20px] ml-[334px] px-[110px]">
            <div className="grid_component mt-[20px]">
                <h5 className="text-black text-[20px]">
                    오늘{" "}
                    <span className="text-[#74818E] text-[14px]">{`${todaySplit[0]}년 ${todaySplit[1]}월 ${todaySplit[2]}일`}</span>
                </h5>
                <ul className="flex justify-between pt-[30px]">
                    <li>
                        <h6 className="text-black text-[16px]">결제 금액</h6>
                        <ul className="pt-[10px]">
                            {summary.weekAmount.map((o, idx) => {
                                return (
                                    <li
                                        key={idx}
                                        className="[&:nth-child(n+2)]:pt-[4px] align-center"
                                    >
                                        <p
                                            className={`w-[48px] inline-block pt-[4px] pb-[2px] text-white text-[12px] text-center rounded-[10px]  ${o.name === "KRW" ? "bg-[#6B7280]" : o.name === "USD" ? "bg-[#3B82F6]" : "bg-[#ababab]"}  `}
                                        >
                                            {o.name}
                                        </p>
                                        <strong className="inline-block align-middle pl-[6px] text-black text-[16px] font-normal">
                                            {o.name === "KRW"
                                                ? commaFc(o.amount[summary.weekIdx - 1], "KRW")
                                                : commaFc(o.amount[summary.weekIdx - 1], "USD")}
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
                        <h6 className="text-black text-[16px]">결제 완료</h6>
                        <div className="flex items-end pt-[6px]">
                            <strong className="min-w-[60px] inline-block text-[#22C55E] text-[35px] font-normal">
                                {summary.successRate === 0 ? "-" : summary.successRate}
                            </strong>
                            <p className="pb-[10px] text-black text-[16px]">%</p>
                        </div>
                    </li>
                    <li>
                        <h6 className="text-black text-[16px]">결제 실패/환불 건수</h6>
                        <div className="flex items-end pt-[6px]">
                            <strong className="min-w-[45px] inline-block text-[#EF4444] text-[35px] font-normal">
                                {/*FAILED*/}
                                {findStatusCount("FAILED")
                                    ? findStatusCount("FAILED")?.dataLength
                                    : "-"}
                            </strong>
                            <p className="px-[4px] pb-[10px] text-black text-[16px]">/</p>
                            <strong className="min-w-[45px] inline-block text-[#9CA3AF] text-[35px] font-normal">
                                {/*CANCELLED*/}
                                {findStatusCount("CANCELLED")
                                    ? findStatusCount("CANCELLED")?.dataLength
                                    : "-"}
                            </strong>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="grid_component">
                <div className="flex justify-center gap-[20px]">
                    <Line
                        options={options("일별 거래 금액 추이(7일)")}
                        data={amountData(summary.weekAmount, summary.weekIdx)}
                        height={300}
                    />
                    <Doughnut
                        options={options("금일 결제 상태")}
                        data={statusChartData(
                            statusData.map((d) => d.description),
                            summary.statusCount.map((d) => d.dataLength),
                        )}
                        height={300}
                    />
                </div>
            </div>
            <div className="grid_component">
                <TransactionsTable
                    captionText={"최근 거래 내역(5건)"}
                    sliceCount={-5}
                    main={true}
                />
            </div>
        </div>
    );
}
