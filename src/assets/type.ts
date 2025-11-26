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
export interface PaymentsListProps {
    amount: string;
    currency: string;
    mchtCode: string;
    payType: string;
    paymentAt: string;
    paymentCode: string;
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
export interface FilterProps {
    name: string;
    checked: string | null;
}
export interface DataTableProps {
    captionText: string;
    sliceCount: number[] | number;
    main: boolean;
    filterSearch?: FilterProps[];
    activeFilters?: FilterProps[];
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
