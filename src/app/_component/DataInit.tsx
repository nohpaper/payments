"use client";
import { useEffect } from "react";
import { ResponseProps } from "@/assets/type";
import {
    useListDataStore,
    useMchtDataStore,
    useStatusDataStore,
    useTypeDataStore,
} from "@/assets/store";

const res = "https://recruit.paysbypays.com/api/v1";
//서버 통신해서 가져온 data.message 가 success 맞는지 다시 한번 확인
function validateApiRes<T>(res: ResponseProps<T>) {
    if (!res || res.message !== "success") {
        throw new Error("API 응답이 잘못되었습니다.");
    }
    return res.data;
}

export default function DataInit() {
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

    //페이지 진입 시 한 번만 실행
    useEffect(() => {
        const _ignore = dataRes();
    }, []);
    return null;
}
