
import Link, { LinkProps } from "next/link";
interface Links {
    label: string;
    href: string;
    icon: React.JSX.Element | React.ReactNode;
  }

export const SidebarLink = ({
    link,
    ...props
  }: {
    link: Links;
    className?: string;
    props?: LinkProps;
  }) => {
    return (
      <Link
        href={link.href}
        className={`flex items-center`}
        {...props}
      >
        {link.icon}
      </Link>
    );
  };
