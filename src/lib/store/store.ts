import { create } from "zustand";
import {
    PaymentsListProps,
    CodeDescriptionProps,
    TypeDescriptionProps,
    SearchCondition,
    SummaryProps,
    merchantsListProps,
} from "@/lib/types/type";
import { validateApiRes } from "@/lib/utils/fc";
import onFetch from "@/lib/api/api";
import { TODAY } from "@/config";
interface UsePaymentStore {
    list: PaymentsListProps[];
    merchantsList: merchantsListProps[];
    status: CodeDescriptionProps[];
    type: TypeDescriptionProps[];
    mcht: CodeDescriptionProps[];
    mchtModal: Record<string, never>;
    summary: SummaryProps;
    isLoading: boolean;
    error: string | null;
    initData: () => Promise<void>;
    getPaginationList: (search: SearchCondition) => {
        items: PaymentsListProps[];
        totalCount: number;
    };
    updateDashBoard: (today: string, week: string[]) => void;
    mchtModalOpen: (mchtCode: string | null) => void;
}

export const usePaymentStore = create<UsePaymentStore>((set, get) => ({
    list: [],
    merchantsList: [],
    status: [],
    type: [],
    mcht: [],
    mchtModal: {},
    summary: {
        weekIdx: new Date(TODAY).getDay() === 0 ? 7 : new Date(TODAY).getDay(),
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
    },
    isLoading: false,
    error: null,
    initData: async () => {
        set({ isLoading: true });
        try {
            const [listRes, statusRes, typeRes, mchtRes, merchantsListRes] = await Promise.all([
                onFetch("/payments/list"),
                onFetch("/common/payment-status/all"),
                onFetch("/common/paymemt-type/all"),
                onFetch("/common/mcht-status/all"),
                onFetch("/merchants/list"),
            ]);
            set({
                list: validateApiRes(listRes),
                status: validateApiRes(statusRes),
                type: validateApiRes(typeRes),
                mcht: validateApiRes(mchtRes),
                merchantsList: validateApiRes(merchantsListRes),
                error: null,
            });
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message });
            } else {
                set({ error: "알 수 없는 오류 발생" });
            }
        } finally {
            set({ isLoading: false });
        }
    },
    getPaginationList: ({ start, end, isAsc, currency, status, payType }) => {
        const { list } = get();

        const totalList = list
            .sort((a, b) => {
                if (isAsc) {
                    return new Date(a.paymentAt).getTime() - new Date(b.paymentAt).getTime();
                }

                return new Date(b.paymentAt).getTime() - new Date(a.paymentAt).getTime();
            })
            .filter((item) => !currency || item.currency === currency)
            .filter((item) => !status || item.status === status)
            .filter((item) => !payType || item.payType === payType);

        const totalCount = totalList.length;
        const items = totalList.slice(start, end);
        return { items, totalCount };
    },
    updateDashBoard: (today, week) =>
        set((state) => {
            const { list, status, summary } = get();

            //날짜별 데이터 그룹
            const dateGroupMap = new Map();
            list.forEach((item) => {
                const date = item.paymentAt.split("T")[0];
                if (!dateGroupMap.has(date)) {
                    dateGroupMap.set(date, []);
                }
                dateGroupMap.get(date).push(item);
            });

            const todayData = dateGroupMap.get(today) || [];

            //월요일부터 오늘까지의 데이터 필터링 및 값
            week.forEach((date, index) => {
                const weekData = dateGroupMap.get(date) || [];

                weekData.map((o: PaymentsListProps) => {
                    const existingCurrency = summary.weekAmount.find((a) => a.name === o.currency);
                    if (existingCurrency) {
                        existingCurrency.amount[index] += Number(o.amount);
                    }
                });
            });

            const summaryStatus = (statusName: string) => {
                return todayData.filter((o: PaymentsListProps) => o.status === statusName);
            };

            //결제 완료율 계산
            const successCount = summaryStatus("SUCCESS").length;
            const successMath =
                todayData.length === 0 ? 0 : Math.round((successCount * 100) / todayData.length);

            const statusArr = status.map((d) => ({
                name: d.code,
                dataLength: summaryStatus(d.code).length,
            }));

            const updatedData = {
                totalCount: todayData.length,
                successRate: Math.round(Number(successMath)),
                statusCount: statusArr,
            };

            return {
                summary: { ...state.summary, ...updatedData },
            };
        }),
    mchtModalOpen: async (mchtCode) => {
        try {
            const mchtRes = await onFetch(`/merchants/details/${mchtCode}`);
            set({
                mchtModal: validateApiRes(mchtRes),
            });
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message });
            } else {
                set({ error: "알 수 없는 오류" });
            }
        }
    },
}));
