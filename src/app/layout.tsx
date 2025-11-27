import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import DataInit from "./_component/DataInit";
import Nav from "@/app/_component/Nav";

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
                    <DataInit />
                    <Nav />
                    {children}
                </div>
            </body>
        </html>
    );
}
