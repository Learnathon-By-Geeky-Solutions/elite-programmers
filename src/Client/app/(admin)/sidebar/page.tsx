"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/ui/TrueTestLogo";
import ThemeSwitch from "@/app/ThemeSwitch";
import { Avatar } from "@heroui/react";
import { PiNotepadFill } from "react-icons/pi";
import { BiSolidPlusSquare, BiSolidUserRectangle } from "react-icons/bi";
import { RiAdminFill, RiDashboardFill } from "react-icons/ri";
import { IoLogOut, IoSettingsSharp } from "react-icons/io5";
import { useAuth } from "@/context/AuthProvider";
import { MdRateReview,MdEmail } from "react-icons/md";
import LoadingModal from '@/components/ui/Modal/LoadingModal'
import { FaUserCheck } from "react-icons/fa";

const menuItems = [
    {
        key: "dashboard",
        icon: <RiDashboardFill size={30} />,
        label: "Dashboard",
        path: "/overview",
    },
    {
        key: "viewexams",
        icon: <PiNotepadFill size={30} />,
        label: "View Exams",
        path: "/view-exams",
    },
    {
        key: "createexams",
        icon: <BiSolidPlusSquare size={30} />,
        label: "Create Exams",
        path: "/exams/create",
    },
    {
        key: "invitecandidates",
        icon: <MdEmail size={30} />,
        label: "Invite Candidates",
        path: "/invite-candidates",
    },
    {
        key: "review",
        icon: <MdRateReview size={30} />,
        label: "Review Results",
        path: "/exams/results",
    },
    {
        key: "users",
        icon: <BiSolidUserRectangle size={30} />,
        label: " Manage Users",
        path: "/manage-users",
    },
    {
        key: "admins",
        icon: <RiAdminFill size={30} />,
        label: "Add Admins",
        path: "/add-admins",
    },
    {
        key: "candidate",
        icon: <FaUserCheck size={30} />,
        label: "Candidate Portal",
        path: "/home",
    }
];
const Sidebar = () => {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user, logout,profileImage} = useAuth();
    const [loading,setLoading]=useState(false)
    return (
       <>
       <LoadingModal isOpen={loading} message="Loading..."/>
        <div  className={`h-screen fixed left-0 top-0 flex flex-col flex-grow  justify-between bg-white dark:bg-[#18181b] px-2 rounded-lg `}>
            <div className={` h-full  flex flex-col justify-between ${isCollapsed ? "w-16" : "w-56"}`}>
                <div>
                    <div className="flex flex-col pt-3 pl-2">
                        <div className="flex w-full justify-between ">
                            <Link href='/overview'>{!isCollapsed && <Logo />}</Link>
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="p-2 rounded-lg">
                                <Icon
                                    icon={
                                        isCollapsed
                                            ? "lucide:chevron-right"
                                            : "lucide:chevron-left"
                                    }
                                    width={20}
                                />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3 my-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                           <Link href='/overview'> <Avatar size="sm" src={profileImage||""} alt="User Avatar" /></Link>
                        </div>
                        {!isCollapsed && (
                            <Link
                                href={`/profile`}
                                className="flex flex-col gap-1 w-full"
                            >
                                <p className="text-sm font-medium flex-wrap">
                                    {user?.username}
                                </p>
                                <p
                                    className={`text-xs text-gray-500 flex-wrap`}
                                >
                                    {user?.email}
                                </p>
                            </Link>
                        )}
                    </div>
                    <ul className="pt-3">
                        {!isCollapsed && (
                            <li className=" opacity-50">Overview</li>
                        )}
                        {menuItems.map((item) => (
                            <li
                                key={item.key}
                                className={`flex items-start gap-2 p-2 rounded-lg hover:bg-white/10
              ${
                  pathname === item.path ? "bg-[#eeeef0] dark:bg-[#27272a]" : ""
              }`}
                            >
                                {item.icon}
                                {!isCollapsed && (
                                    <Link href={item.path} className="w-full ">
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bottom-0 mt-5 ml-2 pb-5">
                    <div className="flex flex-col gap-2 ">
                        {!isCollapsed && <p className=" opacity-50">Account</p>}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                <IoSettingsSharp size={24} />
                            </div>
                            {!isCollapsed && (
                                <div className="flex">
                                    <Link href="/settings">
                                        Settings
                                    </Link>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 ml-1">
                            {isCollapsed && <ThemeSwitch withText={false} />}
                            {!isCollapsed && <ThemeSwitch withText={true} />}
                        </div>
                        <div
                            className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                <IoLogOut size={24} />
                            </div>
                            {!isCollapsed && (
                                <Link href="/">
                                    <button onClick={()=>{logout();
                                        setLoading(true);
                                    }}> Log Out </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
       </>
    );
};

export default Sidebar;
