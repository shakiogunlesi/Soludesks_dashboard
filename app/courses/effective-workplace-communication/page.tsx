"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface Learner {
  id: string;
  name: string;
  city: string;
  email: string;
  avatar: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const LEARNERS: Learner[] = [
  { id: "1",  name: "Nithya Menon",        city: "New York", email: "nithya.menon@email.com",          avatar: "/images/Avatar1.png" },
  { id: "2",  name: "Meera Gonzalez",      city: "Toronto",  email: "meera.gonzalez@email.com",        avatar: "/images/Avatar2.png" },
  { id: "3",  name: "Monica Patel",        city: "Paris",    email: "monica.patel@email.com",          avatar: "/images/Avatar3.png" },
  { id: "4",  name: "Dinesh Kumar",        city: "Tokyo",    email: "dinesh.kumar@email.com",          avatar: "/images/Avatar4.png" },
  { id: "5",  name: "Karthik Subramanian", city: "London",   email: "karthik.subramanian@email.com",   avatar: "/images/Avatar5.png" },
  { id: "6",  name: "Monica Patel",        city: "Paris",    email: "jagathesh.narayanan@email.com",   avatar: "/images/Avatar6.png" },
  { id: "7",  name: "Jagathesh Narayanan", city: "Berlin",   email: "jagathesh.narayanan@email.com",   avatar: "/images/Avatar7.png" },
  { id: "8",  name: "Monica Patel",        city: "Paris",    email: "monica.patel@email.com",          avatar: "/images/Avatar8.png" },
  { id: "9",  name: "Nithya Menon",        city: "New York", email: "nithya.menon@email.com",          avatar: "/images/Avatar9.png" },
  { id: "10", name: "Jagathesh Narayanan", city: "Tokyo",    email: "dinesh.kumar@email.com",          avatar: "/images/Avatar10.png" },
];

// ─── Icon Components ──────────────────────────────────────────────────────────
const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6.01594 1.89214L2.4226 4.69214C1.8226 5.15881 1.33594 6.15214 1.33594 6.90547V11.8455C1.33594 13.3921 2.59594 14.6588 4.1426 14.6588H11.8626C13.4093 14.6588 14.6693 13.3921 14.6693 11.8521V6.99881C14.6693 6.19214 14.1293 5.15881 13.4693 4.69881L9.34927 1.81214C8.41594 1.15881 6.91594 1.19214 6.01594 1.89214Z" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 12H9C10.1 12 11 11.1 11 10V8C11 6.9 10.1 6 9 6H7C5.9 6 5 6.9 5 8V10C5 11.1 5.9 12 7 12Z" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6V12" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 9H11" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CoursesIcon = ({ active }: { active?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M17.9297 13.981V4.92854C17.9297 4.02854 17.1947 3.36104 16.3022 3.43604H16.2572C14.6822 3.57104 12.2897 4.37355 10.9547 5.21355L10.8272 5.29604C10.6097 5.43104 10.2497 5.43104 10.0322 5.29604L9.84469 5.18355C8.50969 4.35105 6.12469 3.55604 4.54969 3.42854C3.65719 3.35354 2.92969 4.02854 2.92969 4.92104V13.981C2.92969 14.701 3.51469 15.376 4.23469 15.466L4.45219 15.496C6.07969 15.7135 8.59219 16.5385 10.0322 17.326L10.0622 17.341C10.2647 17.4535 10.5872 17.4535 10.7822 17.341C12.2222 16.546 14.7422 15.7135 16.3772 15.496L16.6247 15.466C17.3447 15.376 17.9297 14.701 17.9297 13.981Z" stroke={active ? "#0A60E1" : "#636363"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.4248 5.54199V16.792" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.23926 7.79297H5.55176" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.80176 10.0439H5.55176" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClassesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M2.5 8.33659C2.5 5.19389 2.5 3.62255 3.47631 2.64623C4.45262 1.66992 6.02397 1.66992 9.16667 1.66992H10.8333C13.976 1.66992 15.5474 1.66992 16.5237 2.64623C17.5 3.62255 17.5 5.19389 17.5 8.33659V13.3366H2.5V8.33659Z" stroke="#636363" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M1.66992 13.3301H18.3366" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M3.33008 18.3301L5.83008 13.3301" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M16.6699 18.3301L14.1699 13.3301" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M10.8366 7.5H9.16992" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.66341 9.16341V5.83008L5.83008 6.66341" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.1634 9.16341V5.83008L13.3301 6.66341" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 16.6634V13.3301" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AssessmentsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M2.91992 15.0033V5.83659C2.91992 2.50326 3.75326 1.66992 7.08659 1.66992H12.9199C16.2533 1.66992 17.0866 2.50326 17.0866 5.83659V14.1699C17.0866 14.2866 17.0866 14.4033 17.0783 14.5199" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.29492 12.5H17.0866V15.4167C17.0866 17.025 15.7783 18.3333 14.1699 18.3333H5.83659C4.22826 18.3333 2.91992 17.025 2.91992 15.4167V14.875C2.91992 13.5667 3.98659 12.5 5.29492 12.5Z" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.66992 5.83008H13.3366" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.66992 8.75H10.8366" stroke="#636363" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CertificationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3.5498 9.18286V13.3245C3.5498 14.8412 3.5498 14.8412 4.98314 15.8079L8.9248 18.0829C9.51647 18.4245 10.4831 18.4245 11.0748 18.0829L15.0165 15.8079C16.4498 14.8412 16.4498 14.8412 16.4498 13.3245V9.18286C16.4498 7.66619 16.4498 7.66619 15.0165 6.69952L11.0748 4.42452C10.4831 4.08286 9.51647 4.08286 8.9248 4.42452L4.98314 6.69952C3.5498 7.66619 3.5498 7.66619 3.5498 9.18286Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.5837 6.35835V4.16669C14.5837 2.50002 13.7503 1.66669 12.0837 1.66669H7.91699C6.25033 1.66669 5.41699 2.50002 5.41699 4.16669V6.30002" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5245 9.15909L10.9995 9.90076C11.0745 10.0174 11.2412 10.1341 11.3662 10.1674L12.2162 10.3841C12.7412 10.5174 12.8828 10.9674 12.5412 11.3841L11.9828 12.0591C11.8995 12.1674 11.8328 12.3591 11.8412 12.4924L11.8912 13.3674C11.9245 13.9091 11.5412 14.1841 11.0412 13.9841L10.2245 13.6591C10.0995 13.6091 9.89116 13.6091 9.76616 13.6591L8.94949 13.9841C8.44949 14.1841 8.06616 13.9008 8.09949 13.3674L8.14949 12.4924C8.15782 12.3591 8.09116 12.1591 8.00782 12.0591L7.44949 11.3841C7.10782 10.9674 7.24949 10.5174 7.77449 10.3841L8.62449 10.1674C8.75783 10.1341 8.92449 10.0091 8.99116 9.90076L9.46616 9.15909C9.76616 8.70909 10.2328 8.70909 10.5245 9.15909Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.66699 10.7329V9.26621C1.66699 8.39954 2.37533 7.68287 3.25033 7.68287C4.75866 7.68287 5.37533 6.61621 4.61699 5.30787C4.18366 4.55787 4.44199 3.58287 5.20033 3.14954L6.64199 2.32454C7.30033 1.93287 8.15033 2.16621 8.54199 2.82454L8.63366 2.98287C9.38366 4.29121 10.617 4.29121 11.3753 2.98287L11.467 2.82454C11.8587 2.16621 12.7087 1.93287 13.367 2.32454L14.8087 3.14954C15.567 3.58287 15.8253 4.55787 15.392 5.30787C14.6337 6.61621 15.2503 7.68287 16.7587 7.68287C17.6253 7.68287 18.342 8.39121 18.342 9.26621V10.7329C18.342 11.5995 17.6337 12.3162 16.7587 12.3162C15.2503 12.3162 14.6337 13.3829 15.392 14.6912C15.8253 15.4495 15.567 16.4162 14.8087 16.8495L13.367 17.6745C12.7087 18.0662 11.8587 17.8329 11.467 17.1745L11.3753 17.0162C10.6253 15.7079 9.39199 15.7079 8.63366 17.0162L8.54199 17.1745C8.15033 17.8329 7.30033 18.0662 6.64199 17.6745L5.20033 16.8495C4.44199 16.4162 4.18366 15.4412 4.61699 14.6912C5.37533 13.3829 4.75866 12.3162 3.25033 12.3162C2.37533 12.3162 1.66699 11.5995 1.66699 10.7329Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = () => (
  <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M9.1665 16.6667C13.3086 16.6667 16.6665 13.3088 16.6665 9.16669C16.6665 5.02455 13.3086 1.66669 9.1665 1.66669C5.02437 1.66669 1.6665 5.02455 1.6665 9.16669C1.6665 13.3088 5.02437 16.6667 9.1665 16.6667Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.7755 17.2407C16.2172 18.574 17.2255 18.7073 18.0005 17.5407C18.7088 16.474 18.2422 15.599 16.9588 15.599C16.0088 15.5907 15.4755 16.3323 15.7755 17.2407Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M14.1667 10.8334C14.1667 11.2754 13.9911 11.6993 13.6785 12.0119C13.3659 12.3244 12.942 12.5 12.5 12.5H5.83333L2.5 15.8334V5.83337C2.5 5.39135 2.67559 4.96742 2.98816 4.65486C3.30072 4.3423 3.72464 4.16671 4.16667 4.16671H12.5C12.942 4.16671 13.3659 4.3423 13.6785 4.65486C13.9911 4.96742 14.1667 5.39135 14.1667 5.83337V10.8334Z" stroke="#636363" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// ─── User Data ────────────────────────────────────────────────────────────────
const user = {
  name: "Madison Greg",
  email: "Madison.reertr...",
  image: "/images/Avatars.png",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

// ─── Avatar with fallback ─────────────────────────────────────────────────────
function Avatar({ src, name }: { src: string; name: string }) {
  const colors = [
    "bg-violet-200 text-violet-700",
    "bg-blue-200 text-blue-700",
    "bg-amber-200 text-amber-700",
    "bg-green-200 text-green-700",
    "bg-rose-200 text-rose-700",
  ];
  const colorClass = colors[name.charCodeAt(0) % colors.length];

  if (!src) {
    return (
      <div
        className={`w-9 h-9 flex items-center justify-center rounded-full text-xs font-semibold flex-shrink-0 ${colorClass}`}
        aria-hidden="true"
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div className="relative w-9 h-9 flex-shrink-0 rounded-full overflow-hidden">
      <Image
        src={src}
        alt={name}
        fill
        className="object-cover"
        sizes="36px"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CourseDetailPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const [activePage, setActivePage] = useState(1);

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
    { label: "Courses/Materials", href: "/courses", icon: <CoursesIcon active />, active: true },
    { label: "Classes", href: "#", icon: <ClassesIcon /> },
    { label: "Assessments", href: "#", icon: <AssessmentsIcon /> },
    { label: "My Certification", href: "#", icon: <CertificationIcon /> },
    { label: "Settings", href: "#", icon: <SettingsIcon /> },
  ];

  const pages = [1, 2, 3, 4, 5];

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* ── Sidebar ── */}
      <aside
        className={[
          "fixed lg:static inset-y-0 left-0 z-40 w-[210px]",
          "bg-white border-r border-[#F0F0F0] shadow-[4px_0_10px_-4px_rgba(0,0,0,0.08)]",
          "flex flex-col transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex items-center py-5 border-b border-[#F0F0F0]">
          <Image src="/icons/logo.svg" alt="Soludesks logo" width={136} height={36} priority />
        </div>
        <nav className="flex flex-col flex-1 gap-5 px-4 py-4" aria-label="Sidebar navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={[
                "flex items-center gap-3 px-2 py-1.5 rounded-sm text-sm transition-all",
                item.active
                  ? "bg-[#EAF3FF] text-[#0A60E1] font-semibold border-l-4 border-[#0A60E1]"
                  : "text-[#636363] font-normal hover:text-[#0A60E1] hover:bg-gray-50",
              ].join(" ")}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      {/* ── Main ── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* ── Topbar ── */}
        <header className="flex flex-shrink-0 items-center justify-between px-6 py-3.5 bg-white border-b border-gray-100">
          <div className="flex flex-1 items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="relative w-full max-w-xs">
              <label htmlFor="header-search" className="sr-only">Search Soludesk</label>
              <input
                id="header-search"
                type="search"
                placeholder="Search soludesk"
                className="w-full pl-4 pr-12 py-2.5 text-base rounded-full border border-[#F0F0F0] text-[#636363] placeholder-[#636363] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
              />
              <SearchIcon />
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Chat */}
            <button className="relative p-2 text-gray-400 rounded-lg hover:bg-gray-50 hover:text-gray-600 transition-colors" aria-label="Messages">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M22 10V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H14" stroke="#0A60E1" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19.5 7C20.8807 7 22 5.88071 22 4.5C22 3.11929 20.8807 2 19.5 2C18.1193 2 17 3.11929 17 4.5C17 5.88071 18.1193 7 19.5 7Z" fill="#0A60E1" stroke="#0A60E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.9965 11H16.0054" stroke="#0A60E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11.9945 11H12.0035" stroke="#0A60E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.99451 11H8.00349" stroke="#0A60E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 rounded-lg hover:bg-gray-50 hover:text-gray-600 transition-colors" aria-label="Notifications">
              <svg width="25" height="28" viewBox="0 0 25 28" fill="none" aria-hidden="true">
                <path d="M12.0196 6.91016C8.7096 6.91016 6.0196 9.60016 6.0196 12.9102V15.8002C6.0196 16.4102 5.7596 17.3402 5.4496 17.8602L4.2996 19.7702C3.5896 20.9502 4.0796 22.2602 5.3796 22.7002C9.6896 24.1402 14.3396 24.1402 18.6496 22.7002C19.8596 22.3002 20.3896 20.8702 19.7296 19.7702L18.5796 17.8602C18.2796 17.3402 18.0196 16.4102 18.0196 15.8002V12.9102C18.0196 9.61016 15.3196 6.91016 12.0196 6.91016Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
                <path d="M13.8699 7.19945C13.5599 7.10945 13.2399 7.03945 12.9099 6.99945C11.9499 6.87945 11.0299 6.94945 10.1699 7.19945C10.4599 6.45945 11.1799 5.93945 12.0199 5.93945C12.8599 5.93945 13.5799 6.45945 13.8699 7.19945Z" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.0195 23.0605C15.0195 24.7105 13.6695 26.0605 12.0195 26.0605C11.1995 26.0605 10.4395 25.7205 9.89953 25.1805C9.35953 24.6405 9.01953 23.8805 9.01953 23.0605" stroke="#636363" strokeWidth="1.5" strokeMiterlimit="10" />
                <rect x="10" width="15" height="15" rx="7.5" fill="#FF5025" />
                <path d="M13.9056 10.1904V8.94994L17.0159 4.04989H18.0854V5.76691H17.4525L15.4917 8.86991V8.92811H19.9116V10.1904H13.9056ZM17.4816 11.5V9.81208L17.5107 9.26278V4.04989H18.9876V11.5H17.4816Z" fill="#FDFDFD" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#e84c1e] rounded-full" aria-hidden="true" />
            </button>
            {/* User */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-100 cursor-pointer group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user.image ? (
                  <Image src={user.image} alt={user.name} fill className="object-cover" sizes="48px" />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-base font-medium text-[#202020] leading-none mb-1.5">{user.name}</p>
                <p className="text-sm font-normal text-[#636363] leading-none truncate max-w-[100px]">{user.email}</p>
              </div>
              <ChevronDownIcon />
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 overflow-y-auto bg-[#F5F6FA]">
          <div className="px-6 py-6 max-w-7xl">

            {/* ── Course Header ── */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#E8E8E8] hover:bg-gray-50 transition-colors flex-shrink-0"
                  aria-label="Back to courses"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" stroke="#636363" />
                  </svg>
                </Link>
                <h1 className="text-2xl font-medium text-[#202020]">Effective Workplace Communication</h1>
                <span className="px-3 py-1 text-sm font-medium text-[#0A60E1] bg-[#EAF3FF] rounded-full">
                  Soft Skill
                </span>
              </div>
              <Link href="/courses/effective-workplace-communication/courselearning" className="w-[228px] px-6 py-3 text-base font-semibold text-white text-center bg-[#0063EF] rounded-[8px] hover:bg-blue-700 transition-colors">
                Start Learning
              </Link>
            </div>

            {/* ── Hero image ── */}
            <div className="relative w-full h-[220px] rounded-2xl overflow-hidden mb-6 bg-gray-200">
              <Image
                src="/images/course1.png"
                alt="Effective Workplace Communication course banner"
                fill
                className="object-cover"
                sizes="100vw"
                priority
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = "https://placehold.co/1200x220/a8c5f5/4a7fd4?text=Effective+Workplace+Communication";
                }}
              />
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2">
              {/* Total Applicants */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#F0F0F0]">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-green-50 flex-shrink-0">
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
                    <rect width="44" height="44" rx="8" fill="url(#grad-green)" />
                    <path d="M22 20C24.2091 20 26 18.2091 26 16C26 13.7909 24.2091 12 22 12C19.7909 12 18 13.7909 18 16C18 18.2091 19.7909 20 22 20Z" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 32C14 27.5817 17.5817 24 22 24C26.4183 24 30 27.5817 30 32" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M28 16C28.8956 16.3613 29.6678 16.9752 30.2207 17.7658C30.7736 18.5563 31.0824 19.4896 31.1097 20.4518C31.137 21.4141 30.882 22.3633 30.374 23.1834C29.866 24.0036 29.1268 24.6592 28.25 25.07" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M32 32C32 29.8783 31.2375 27.8434 29.8995 26.2695" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <defs>
                      <linearGradient id="grad-green" x1="22" y1="0" x2="22" y2="44" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#DCFCE7" />
                        <stop offset="1" stopColor="#BBF7D0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#636363]">Total Applicants</p>
                  <p className="text-2xl font-medium text-[#202020]">1223</p>
                </div>
              </div>

              {/* Active Learners */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#F0F0F0]">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-50 flex-shrink-0">
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
                    <rect width="44" height="44" rx="8" fill="url(#grad-cyan2)" />
                    <path d="M20.0495 12.5293L14.0295 16.4593C12.0995 17.7193 12.0995 20.5393 14.0295 21.7993L20.0495 25.7293C21.1295 26.4393 22.9095 26.4393 23.9895 25.7293L29.9795 21.7993C31.8995 20.5393 31.8995 17.7293 29.9795 16.4693L23.9895 12.5393C22.9095 11.8193 21.1295 11.8193 20.0495 12.5293Z" stroke="#2CCDF1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15.6301 23.08L15.6201 27.77C15.6201 29.04 16.6001 30.4 17.8001 30.8L20.9901 31.86C21.5401 32.04 22.4501 32.04 23.0101 31.86L26.2001 30.8C27.4001 30.4 28.3801 29.04 28.3801 27.77V23.13" stroke="#2CCDF1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M31.4004 25V19" stroke="#2CCDF1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <defs>
                      <linearGradient id="grad-cyan2" x1="22" y1="0" x2="22" y2="44" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#CFF4FC" />
                        <stop offset="1" stopColor="#A5F3FC" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#636363]">Active Learners</p>
                  <p className="text-2xl font-medium text-[#202020]">13</p>
                </div>
              </div>
            </div>

            {/* ── Learners Table ── */}
            <div className="bg-white rounded-xl border border-[#F0F0F0] overflow-hidden mb-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0F0F0]">
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#202020]">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#202020]">City</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#202020]">Email Address</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-[#202020]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0F0]">
                  {LEARNERS.map((learner) => (
                    <tr key={learner.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar src={learner.avatar} name={learner.name} />
                          <span className="text-sm font-normal text-[#202020]">{learner.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-[#636363]">{learner.city}</td>
                      <td className="px-6 py-3.5 text-sm text-[#636363]">{learner.email}</td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#E8E8E8] hover:bg-gray-50 transition-colors"
                          aria-label={`Message ${learner.name}`}
                        >
                          <MessageIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between">
              {/* Per page */}
              <div className="relative inline-flex items-center">
                <label htmlFor="per-page-detail" className="sr-only">Results per page</label>
                <select
                  id="per-page-detail"
                  title="Results per page"
                  className="appearance-none pl-5 pr-8 py-2.5 text-sm font-normal text-[#636363] rounded-full border border-[#E8E8E8] cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option>Show 10/page</option>
                  <option>Show 20/page</option>
                  <option>Show 50/page</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" stroke="#636363" />
                </svg>
              </div>

              {/* Page numbers */}
              <nav aria-label="Pagination" className="flex items-center gap-1.5">
                <button
                  className="px-3 py-1.5 text-base text-[#8C8C8C] hover:text-gray-700 transition-colors disabled:opacity-40"
                  onClick={() => setActivePage(Math.max(1, activePage - 1))}
                  disabled={activePage === 1}
                  aria-label="Previous page"
                >
                  Prev
                </button>

                {pages.map((p) => (
                  <button
                    key={p}
                    onClick={() => setActivePage(p)}
                    aria-label={`Page ${p}`}
                    aria-current={activePage === p ? "page" : undefined}
                    className={[
                      "w-8 h-8 rounded-full text-sm font-medium transition-all",
                      activePage === p
                        ? "bg-[#0A60E1] text-white"
                        : "border border-[#0A60E1] text-gray-500 hover:border-blue-400",
                    ].join(" ")}
                  >
                    {String(p).padStart(2, "0")}
                  </button>
                ))}

                <span className="w-8 h-8 flex items-center justify-center text-sm text-[#0A60E1]" aria-hidden="true">
                  …
                </span>

                <button
                  onClick={() => setActivePage(24)}
                  aria-label="Page 24"
                  aria-current={activePage === 24 ? "page" : undefined}
                  className={[
                    "w-8 h-8 rounded-full text-sm font-medium border transition-all",
                    activePage === 24
                      ? "bg-[#0A60E1] text-white border-[#0A60E1]"
                      : "border-[#0A60E1] text-gray-500 hover:border-blue-400",
                  ].join(" ")}
                >
                  24
                </button>

                <button
                  className="px-3 py-1.5 text-base font-medium text-[#0A60E1] hover:underline transition-colors disabled:opacity-40"
                  onClick={() => setActivePage(Math.min(24, activePage + 1))}
                  disabled={activePage === 24}
                  aria-label="Next page"
                >
                  Next
                </button>
              </nav>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}