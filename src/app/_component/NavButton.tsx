"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { DashboardIcon } from "@/app/_component/Icon";

type Menu = {
    name: string;
    href: string;
    pathname: string;
    icon: ReactNode;
};

const menus: Menu[] = [
    {
        name: "전체 거래 내역",
        href: "/transactions?page=1",
        pathname: "/transactions",
        icon: <DashboardIcon />,
    },
];

export default function NavButton() {
    const pathname = usePathname();
    return (
        <>
            {menus.map((menu) => (
                <Link
                    key={menu.name}
                    className={`flex items-center gap-[10px] mt-[10px] mx-[20px] p-[20px] text-white rounded-[20px] hover:bg-[#535B69] duration-150 ${pathname === "/transactions" && "bg-[#535B69]"}`}
                    href={menu.href}
                >
                    {menu.icon}
                    {menu.name}
                </Link>
            ))}
        </>
    );
}
