import { useEffect } from "react";
import { usePaymentStore } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import useUrl from "@/lib/hook/hook";

interface MechtModelProps {
    mchtCode: string | null;
}
export default function MchtModel(props: MechtModelProps) {
    const { mchtModalOpen, mcht, mchtModal } = usePaymentStore();
    const router = useRouter();
    const { searchParams, pathname } = useUrl();

    //가맹점 상태
    const mchtStatus = mcht.find((m) => m.code === mchtModal.status);

    //팝업 open 시 서버 통신
    useEffect(() => {
        mchtModalOpen(props.mchtCode);
    }, [props.mchtCode]);
    return (
        <div className="w-[300px] fixed top-1/2 left-1/2 -translate-1/2 px-[40px] py-[20px] rounded-[20px] bg-white shadow-[2px_2px_10px_rgba(0,0,0,.2)]">
            <div className="relative">
                <span
                    className={`inline-block px-[10px] py-[3px] rounded-[20px] text-black ${mchtStatus?.code.toLowerCase()}`}
                >
                    {mchtStatus?.description}
                </span>
                <h5 className="pt-[10px] text-black text-[20px]">{mchtModal.mchtName}</h5>
                <p className="pt-[2px] text-[#6B6B6B] text-[14px]">{mchtModal.mchtCode}</p>
                <button
                    className="w-[30px] h-[30px] absolute top-0 right-[-20px] cursor-pointer text-black text-[20px]"
                    onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.delete("mcht");
                        router.push(`${pathname}?${params.toString()}`);
                    }}
                >
                    ×
                </button>
            </div>
            <div className="pt-[40px]">
                <dl>
                    <dt className="text-[#B4B4B4] text-[12px]">연락처</dt>
                    <dd className="pt-[2px] text-black text-[16px]">{mchtModal.phone}</dd>
                </dl>
                <dl className="pt-[10px]">
                    <dt className="text-[#B4B4B4] text-[12px]">이메일</dt>
                    <dd className="pt-[2px] text-black text-[16px]">{mchtModal.email}</dd>
                </dl>
                <dl className="pt-[10px]">
                    <dt className="text-[#B4B4B4] text-[12px]">주소</dt>
                    <dd className="pt-[2px] text-black text-[16px]">{mchtModal.address}</dd>
                </dl>
            </div>
            <div className="pt-[40px]">
                <div className="flex justify-between">
                    <dl>
                        <dt className="text-[#B4B4B4] text-[12px]">사업자등록번호</dt>
                        <dd className="pt-[2px] text-black text-[16px]">{mchtModal.bizNo}</dd>
                    </dl>
                    <dl>
                        <dt className="text-[#B4B4B4] text-[12px]">업종</dt>
                        <dd className="pt-[2px] text-black text-[16px]">{mchtModal.bizType}</dd>
                    </dl>
                </div>
                <dl className="pt-[10px]">
                    <dt className="text-[#B4B4B4] text-[12px]">등록일</dt>
                    <dd className="pt-[2px] text-black text-[16px]">{mchtModal.registeredAt}</dd>
                </dl>
                <dl className="pt-[10px]">
                    <dt className="text-[#B4B4B4] text-[12px]">최근 수정일</dt>
                    <dd className="pt-[2px] text-black text-[16px]">{mchtModal.updatedAt}</dd>
                </dl>
            </div>
        </div>
    );
}
