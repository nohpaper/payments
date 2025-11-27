"use client";
import { useEffect } from "react";
import { usePaymentStore } from "@/lib/store/store";

export default function DataInit() {
    const paymentInit = usePaymentStore((state) => state.initData); //거래내역 data init

    //페이지 진입 시 한 번만 실행
    useEffect(() => {
        paymentInit();
    }, [paymentInit]);
    return null;
}
