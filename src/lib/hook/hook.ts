import { useParams, usePathname, useSearchParams } from "next/navigation";

export default function useUrl() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const params = useParams();
    return { searchParams, pathname, params };
}
