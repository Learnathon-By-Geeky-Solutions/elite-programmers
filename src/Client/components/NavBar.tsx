"use client";

import React, { useState } from "react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Avatar,
    NavbarContent,
    NavbarItem,
    Badge,
    Navbar,
    Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import ThemeSwitch from "../app/ThemeSwitch";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import LoadingModal from './ui/Modal/LoadingModal'

export default function Component() {
    const { user, logout ,profileImage} = useAuth();
    const router = useRouter();
    const [loading,setLoading]=useState(false)
    return (
        <div>
            <LoadingModal isOpen={loading} message="Loading..."/> 
            <Navbar  classNames={{  wrapper: " bg-[#eeeef0] dark:bg-[#000000]",
                    item: "hidden md:flex", }} >
                <NavbarContent
                    className="h-11 gap-1 rounded-full bg-[#ffffff] px-4 dark:bg-[#18181b]"
                    // justify="end"
                    >
                    <NavbarItem>
                        <ThemeSwitch />
                    </NavbarItem>
                    <NavbarItem>
                        <button type="button" className='p-4'>
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <div className="mt-1  outline-none transition-transform">
                                        <Badge
                                            className="border-transparent"
                                            color="success"
                                            content=""
                                            placement="bottom-right"
                                            shape="circle"
                                            size="sm" >
                                            <Avatar
                                                size="sm"
                                                src={profileImage || ""}
                                                alt="User Avatar"
                                            />
                                        </Badge>
                                    </div>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Profile Actions" 
                                    variant="flat" >
                                    <DropdownItem
                                        key="user" textValue="User Profile"
                                        className="h-14 gap-2"  >
                                        <div className="flex gap-2 my-4">
                                            <Avatar
                                                size="md"
                                                src={profileImage ||""}
                                                alt="User Avatar" />
                                            <div>
                                                <p>{user?.username}</p>
                                                <p>{user?.email}</p>
                                            </div>
                                        </div>
                                        <Divider className="mb-5" />
                                    </DropdownItem>
                                    <DropdownItem key="profile" textValue="My Profile">
                                        <button
                                            onClick={() =>
                                                router.push("/myprofile")  }
                                            className="flex items-center gap-2"
                                            style={{
                                                color: "inherit",
                                                textDecoration: "none", }}>
                                            <Icon
                                                icon="lucide:user"
                                                className="w-5 h-5" />
                                            My Profile
                                        </button>
                                    </DropdownItem>
                                    <DropdownItem key="settings" textValue="Account Settings">
                                        <button
                                            onClick={() =>
                                                router.push("/mysettings")
                                            }
                                            className={`flex items-center gap-2`}
                                            style={{
                                                color: "inherit",
                                                textDecoration: "none",  }}  >
                                            <Icon
                                                icon="lucide:settings"
                                                className="w-5 h-5" />
                                            Account Settings
                                        </button>
                                    </DropdownItem>
                                    <DropdownItem key="logout" onPress={()=>{logout();setLoading(true)}} textValue="Logout">
                                        <div className="flex gap-2">
                                            <Icon
                                                icon="lucide:log-out"
                                                className="w-5 h-5"  />
                                            <p>Logout</p>
                                        </div>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </div>
    );
}
