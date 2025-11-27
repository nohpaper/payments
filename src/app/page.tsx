"use client";
import { usePaymentStore } from "@/lib/store/store";
import { useCallback, useEffect, useMemo } from "react";

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
import { amountData, options, statusChartData } from "@/lib/chart/chart";
import TransactionsTable from "@/app/_component/TransactionsTable";
import { commaFc, getWeekdaysUntilDate } from "@/lib/utils/fc";
import { TODAY } from "@/config";

//오늘 날짜 쪼개기
const todaySplit = TODAY.split("-");

//차트
//일별 거래 금액 추이(7일)
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
//금일 결제 상태
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
    //zustand store 관련 변수
    const { list, status, summary, isLoading, updateDashBoard } = usePaymentStore();

    //차트 캐싱
    const doughnutChartData = useMemo(
        () =>
            statusChartData(
                status.map((d) => d.description),
                summary.statusCount.map((d) => d.dataLength),
            ),
        [status, summary.statusCount],
    );
    const lineOptions = useMemo(() => options("일별 거래 금액 추이(7일)"), []);
    const doughnutOptions = useMemo(() => options("금일 결제 상태"), []);

    //summary 에서 결제 상태 관련 찾기
    const findStatusCount = useCallback(
        (name: string) => summary.statusCount.find((d) => d.name === name),
        [summary.statusCount],
    );

    //주간 날짜 배열
    const weekDates = useMemo(() => getWeekdaysUntilDate(TODAY), [TODAY]);

    //데이터 로딩 확인
    useEffect(() => {
        if (!isLoading && list.length > 0) {
            updateDashBoard(TODAY, weekDates);
        }
    }, [list, isLoading]);

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
                        options={lineOptions}
                        data={amountData(summary.weekAmount, summary.weekIdx)}
                        height={300}
                    />
                    <Doughnut options={doughnutOptions} data={doughnutChartData} height={300} />
                </div>
            </div>
            <div className="grid_component">
                <TransactionsTable
                    captionText={"최근 거래 내역(5건)"}
                    sliceCount={[0, 5]}
                    main={true}
                />
            </div>
        </div>
    );
}
