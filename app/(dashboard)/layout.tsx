import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/journal", label: "Journal" },
];

const DashboardLayout = ({ children }) => {
  return (
    <div className="w-screen h-screen relative">
      <aside className="absolute left-0 top-0 h-full w-[200px] border-r border-black/10">
        <div className="px-6 my-4">
          <span className="text-3xl">Eunoia</span>
        </div>
        <ul>
          {links.map((link) => (
            <li key={link.href} className="px-6 py-4 text-xl border-b border-t border-black/10">
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </aside>
      <div className="ml-[200px] h-full">
        <header className="h-[60px] border-b border-black/10">
          <div className="h-full w-full px-6 flex items-center justify-end">
            <UserButton />
          </div>
        </header>
        <div className="h-[calc(100vh-70px)]">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
