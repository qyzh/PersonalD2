"use client";
import { usePathname } from "next/navigation";
const userID ='152850421'; // Hardcoded user ID
export default function Breadcrumb() {
    const title = usePathname().slice(1) || "page"; // Automatically get the page title from the URL
    return (
        <div className="
        flex
        items-center
        pl-6
        border-b border-white/10
        font-mono
        text-sm
        py-4
        whitespace-break-spaces
        ">
            <span className="text-white">user@{userID} /</span>
            <span className="text-yellow-400"> {title}.tsx</span>
        </div>
    );
}
