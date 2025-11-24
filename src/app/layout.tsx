import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const NotoSans = Noto_Sans({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: "PG",
    description: "PG 대시보드 페이지",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className={`${NotoSans} antialiased `}>
                <div className="flex items-start">
                    <nav className="w-[334px] min-h-[100vh] bg-[#303642]">
                        <Link href={"/"} className="text-white">
                            HOME
                        </Link>
                    </nav>
                    {children}
                </div>
            </body>
        </html>
    );
}
