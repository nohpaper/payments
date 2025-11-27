export interface ResponseProps<
    T = CodeDescriptionProps[] | TypeDescriptionProps[] | PaymentsListProps[],
> {
    message: string;
    data: T;
    status: number;
}
export interface TypeDescriptionProps {
    type: string;
    description: string;
}

export interface CodeDescriptionProps {
    code: string;
    description: string;
}
export interface PaymentsListProps {
    amount: string;
    currency: string;
    mchtCode: string;
    payType: string;
    paymentAt: string;
    paymentCode: string;
    status: string;
}
export interface merchantsListProps {
    bizType: string;
    mchtCode: string;
    mchtName: string;
    status: string;
}
export interface amountProps {
    name: string;
    amount: number[];
}
export interface SummaryProps {
    weekIdx: number;
    weekAmount: amountProps[];
    totalCount: number;
    successRate: number;
    statusCount: {
        name: string;
        dataLength: number;
    }[];
}
export interface DataTableProps {
    captionText: string;
    sliceCount: number[];
    main: boolean;
    page?: number;
    currency?: string | null;
    payType?: string | null;
    status?: string | null;
}

export interface SearchCondition {
    start: number;
    end: number;
    isAsc: boolean;
    currency: string | null;
    status: string | null;
    payType: string | null;
}
