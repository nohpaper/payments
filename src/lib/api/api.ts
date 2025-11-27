import { apiBaseUrl } from "@/config";

export default async function onFetch(path: string, requestInit?: RequestInit) {
    const url = `${apiBaseUrl}${path}`;
    return await fetch(url, { ...requestInit, method: requestInit?.method || "GET" }).then((res) =>
        res.json(),
    );
}
