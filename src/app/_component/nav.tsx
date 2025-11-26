"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
    const pathname = usePathname();
    return (
        <nav className="w-[334px] min-h-[100vh] fixed bg-[#303642]">
            <Link href={"/"} className="flex items-center gap-[10px] p-[40px] text-white">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path
                        d="M12 29.3337V16.0003H20V29.3337M4 12.0003L16 2.66699L28 12.0003V26.667C28 27.3742 27.719 28.0525 27.219 28.5526C26.7189 29.0527 26.0406 29.3337 25.3333 29.3337H6.66667C5.95942 29.3337 5.28115 29.0527 4.78105 28.5526C4.28095 28.0525 4 27.3742 4 26.667V12.0003Z"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                HOME
            </Link>
            <p className="pt-[30px] pl-[20px] text-[16px] text-white">거래 내역</p>
            <Link
                href={"/transactions?page=1"}
                className={`flex items-center gap-[10px] mt-[10px] mx-[20px] p-[20px] text-white rounded-[20px] hover:bg-[#535B69] duration-150 ${pathname === "/transactions" && "bg-[#535B69]"}`}
            >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path
                        d="M13.3333 4H4V13.3333H13.3333V4Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M28 4H18.6667V13.3333H28V4Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M28 18.6667H18.6667V28H28V18.6667Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M13.3333 18.6667H4V28H13.3333V18.6667Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                전체 거래 내역
            </Link>
        </nav>
    );
}
