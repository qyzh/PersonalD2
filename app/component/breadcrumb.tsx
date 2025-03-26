"use client";
import { usePathname } from "next/navigation";
import { getProfileID } from "../profile/profiledata";
import { useEffect, useState, memo } from "react";

const Breadcrumb = memo(function Breadcrumb() {
    const pathname = usePathname();
    const [userId, setUserId] = useState<string>("");
    const title = pathname.slice(1) || "page";

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await getProfileID();
            setUserId(id);
        };
        fetchUserId();
    }, []);

    return (
        <div className="flex items-center pl-6 border-b border-white/10 font-mono text-sm py-4 whitespace-break-spaces">
            <span className="text-white">user@{userId} /</span>
            <span className="text-yellow-400"> {title}.tsx</span>
        </div>
    );
});

export default Breadcrumb;
