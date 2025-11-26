import { amountProps } from "@/assets/type";

//공통 옵션
export const options = (title: string) => ({
    responsive: false,
    plugins: {
        legend: {
            position: "top" as const,
        },
        title: {
            display: true,
            text: title,
        },
    },
});

//line chart "일별 거래 금액 추이(7일)"
const labels = ["월", "화", "수", "목", "금", "토", "일"];
export const amountData = (amount: amountProps[], idx: number | null) => {
    //amount.find((o) => o.name === "KRW").amount
    //if (idx === null) return;
    const data = (name: string) => {
        return amount.find((o: amountProps) => o.name === name)?.amount ?? Array(7).fill(0);
    };
    return {
        labels,
        datasets: [
            {
                label: "USD",
                data: idx !== null ? data("USD").slice(0, idx) : data("USD"),
                borderColor: "#3B82F6",
                backgroundColor: "#3B82F6",
            },
            {
                label: "KRW",
                data: idx !== null ? data("KRW").slice(0, idx) : data("KRW"),
                borderColor: "#6B7280",
                backgroundColor: "#6B7280",
            },
        ],
    };
};
export const chartOptions = () => ({
    responsive: true,
});

//doughnut chart "금일 결제 상태"
export const statusChartData = (labels: string[], dataArr: number[]) => ({
    labels: labels,
    datasets: [
        {
            label: "",
            data: dataArr,
            backgroundColor: [
                "rgba(156, 163, 175, 0.2)", //결제 취소
                "rgba(34, 197, 94, 0.2)", //결제 완료
                "rgba(239, 68, 68, 0.2)", //결제 취소
                "rgba(245, 158, 11, 0.2)", //결제 대기
            ],
            borderColor: ["#9CA3AF", "#22C55E", "#EF4444", "#F59E0B"],
            borderWidth: 1,
        },
    ],
});

/*statusData.map((d) => d.description)
summary.statusCount.map((d) => d.dataLength)*/
