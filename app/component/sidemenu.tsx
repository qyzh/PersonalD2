"user client";
import { House, ScrollText, Sword } from "lucide-react";
import { SidebarLink } from "./sidebarlink";
export function NavSide() {

    const links = [
        {
          label: "Dashboard",
          href: "/",
          icon: (
            <House className="text-neutral-700 hover:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),
        },
        {
          label: "History",
          href: "/history",
          icon: (
            <ScrollText  className="text-neutral-700 hover:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),
        },
        {
            label: "History",
            href: "/items",
            icon: (
              <Sword  className="text-neutral-700 hover:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
          },
      ];
    return (

    <nav className="fixed inset-y-0 left-0 z-[70] min-w-[49px] border-e border-white/10 bg-black text-white ">
        <div className="h-14 flex items-center justify-center">
        <a href='/profile'><svg version="1.0" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-neutral-700 hover:fill-neutral-200" viewBox="0 0 180 180"><path d="M54 1.1c-7.4.5-22.5 1.5-33.5 2.2L.5 4.5l.3 12C1 23.1 1.5 34.6 2 42c2.4 34.7 3.1 71.2 2 101.7-.7 19.5-.8 30.9-.2 31.5 1.4 1.4 23.4 1 38.2-.6l12.4-1.4 20.6 3.4c19.7 3.3 21 3.4 33 2.4 6.9-.6 14.1-1.2 16-1.5s10.9-.9 20-1.5c14.9-.8 17.4-.7 25.4 1 4.9 1.1 9.3 1.7 9.8 1.4s.8-36.1.8-87.5L179.8 4h-3.1c-1.8-.1-10.6-.8-19.7-1.6C137.2.6 73.3-.2 54 1.1M94.5 73c56.1 37.2 65 43.5 64.6 45.3-1.1 6.8-4.4 17.5-7.7 24.6l-3.7 8.1h-21.4l-4.4-4.7c-2.3-2.7-11-12-19.3-20.8s-18.4-19.6-22.5-24-11.3-12.1-16-17C43.1 62.4 19.5 36.7 19.5 36c0-1.4 7.8-7.1 9-6.6.6.2 30.3 19.8 66 43.6m45.2-38c2.8 1.6 5.4 3.3 5.7 3.8s-.2 6.6-1.2 13.5c-1.4 11-1.9 12.7-3.5 12.7s-32.8-22.8-34.1-24.9c-.3-.4 3.8-1.8 9.2-3 5.3-1.2 11.1-2.8 12.7-3.6 4.3-1.9 5.4-1.8 11.2 1.5m-88.4 92.1c9.2 8.8 16.7 16.6 16.7 17.2-.1 1.8-26.4 10.1-29.5 9.3-1.4-.4-5.1-2.7-8-5.1-3-2.4-6.4-4.9-7.5-5.5s-2-1.8-2-2.8c0-2.8 11.2-29.2 12.4-29.2.6 0 8.7 7.2 17.9 16.1"/></svg></a>
        </div>
            <div className="h-full flex flex-col items-center gap-4">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
              </div>
    </nav>
);
}
