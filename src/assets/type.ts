export interface ResponseProps<
    T = CodeDescriptionProps[] | TypeDescriptionProps[] | PaymentsListProps[],
> {
    message: string;
    data: T;
    status: number;
}
interface TypeDescriptionProps {
    type: string;
    description: string;
}

interface CodeDescriptionProps {
    code: string;
    description: string;
}
interface PaymentsListProps {
    amount: string;
    currency: string;
    mchtCode: string;
    payType: string;
    paymentAt: string;
    paymentCode: string;
    status: string;
}
export interface SummaryProps {
    totalAmount: {
        [key: string]: number;
    };
    totalCount: number;
    successRate: number;
    failCancelCount: [number, number];
}

//zustand
export interface UseListDataProps {
    data: PaymentsListProps[];
    isLoading: boolean;
    init: (data: PaymentsListProps[]) => void;
}
export interface UseStatusDataProps {
    data: CodeDescriptionProps[];
    init: (data: CodeDescriptionProps[]) => void;
}
export interface UseTypeDataProps {
    data: TypeDescriptionProps[];
    init: (data: TypeDescriptionProps[]) => void;
}
export interface UseMchtDataProps {
    data: CodeDescriptionProps[];
    init: (data: CodeDescriptionProps[]) => void;
}
