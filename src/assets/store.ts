import { create } from "zustand";
import {
    UseListDataProps,
    UseStatusDataProps,
    UseTypeDataProps,
    UseMchtDataProps,
} from "@/assets/type";

//거래내역
export const useListDataStore = create<UseListDataProps>((set) => ({
    data: [],
    isLoading: false,
    init: (data) =>
        set((state) => {
            state.data.push(...data);
            console.log(data);
            return { data: state.data, isLoading: true };
        }),
}));

//결제 상태
export const useStatusDataStore = create<UseStatusDataProps>((set) => ({
    data: [],
    init: (data) =>
        set((state) => {
            state.data.push(...data);
            return { data: state.data };
        }),
}));

//결제 수단
export const useTypeDataStore = create<UseTypeDataProps>((set) => ({
    data: [],
    init: (data) =>
        set((state) => {
            state.data.push(...data);
            return { data: state.data };
        }),
}));

//가맹점 상태
export const useMchtDataStore = create<UseMchtDataProps>((set) => ({
    data: [],
    init: (data) =>
        set((state) => {
            state.data.push(...data);
            return { data: [...data] };
        }),
}));
