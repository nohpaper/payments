import { ResponseProps } from "@/lib/types/type";

export function commaFc(amount: number | string, currencyText: string) {
    if (amount !== null && amount !== undefined) {
        if (currencyText === "KRW") {
            return Math.round(Number(amount))
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        }
    }
}

export function getWeekdaysUntilDate(dateString: string) {
    const targetDate = new Date(dateString);
    const dayOfWeek = targetDate.getDay(); // 0(일) ~ 6(토)

    const result = [];

    // 일요일(0)이면 지난 주 월요일부터 토요일까지
    // 다른 요일이면 이번 주 월요일부터 해당 요일 전날까지
    const daysToGoBack = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // 월요일 날짜 계산
    const monday = new Date(targetDate);
    monday.setDate(targetDate.getDate() - daysToGoBack);

    // 마지막 날짜 계산 (일요일이면 토요일까지, 아니면 전날까지)
    const endDay = dayOfWeek === 0 ? 7 : dayOfWeek;

    for (let i = 0; i < endDay; i++) {
        const currentDate = new Date(monday);
        currentDate.setDate(monday.getDate() + i);

        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");

        result.push(`${currentDate.getFullYear()}-${month}-${day}`);
    }

    return result;
}

//서버 통신해서 가져온 data.message 가 success 맞는지 다시 한번 확인
export function validateApiRes<T>(res: ResponseProps<T>) {
    if (!res || res.message !== "success") {
        throw new Error("API 응답이 잘못되었습니다.");
    }
    return res.data;
}
