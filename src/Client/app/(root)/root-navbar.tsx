"use client";

import React, { useState } from "react";
import "@/app/globals.css";
import Logo from "@/components/ui/TrueTestLogo";
import { Avatar, Badge, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Navbar, NavbarContent, NavbarItem } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthProvider'
import ThemeSwitch from '../ThemeSwitch'
import { Icon } from '@iconify/react/dist/iconify.js'
import LoadingModal from '@/components/ui/Modal/LoadingModal'

export default function RootNavBar() {
    const router = useRouter();
      const { user, logout ,profileImage} = useAuth();
         const [loading,setLoading]=useState(false)
    return (
        <>
        <LoadingModal isOpen={loading} message="Loading..."/> 
        <div className="flex w-full justify-between items-center bg-[#eeeef0] dark:bg-[#000000] h-16 px-14 pt-3">
           <Link href="/home"> <div className="bg-[#eeeef0] dark:bg-[#000000] ">
                <Logo />
            </div></Link>
            <div className="flex">
                <Navbar
                    classNames={{
                        wrapper: "bg-[#eeeef0] dark:bg-[#000000]",
                        item: "hidden md:flex",
                    }}
                >
                    <NavbarContent
                        className="h-11 gap-5 rounded-full bg-[#ffffff] px-4 dark:bg-[#18181b]"
                        justify="end"
                    >
                        <NavbarItem
                            style={{ cursor: "pointer" }}
                            onClick={() => router.push("/home")}
                        >
                            Home
                        </NavbarItem>
                        <NavbarItem
                            style={{ cursor: "pointer" }}
                            onClick={() => router.push("/my-exams")}
                        >
                            My Exams
                        </NavbarItem>
                        {
                            user?.roles.includes("Admin") && <NavbarItem
                            style={{ cursor: "pointer" }}
                            onClick={() => router.push("/overview")} >
                            Admin Panel
                        </NavbarItem>
                        }
                    </NavbarContent>
                               <NavbarContent
                                    className="h-11 gap-4 rounded-full bg-[#ffffff] px-4 dark:bg-[#18181b]">
                                    <NavbarItem>
                                        <ThemeSwitch />
                                    </NavbarItem>
                                    <NavbarItem>
                                        <button type="button" >
                                            <Dropdown placement="bottom-end" >
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
                                                <DropdownMenu className='p-6'
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
                                                    <DropdownItem key="profile" textValue="My Profile" className='p-2'>
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
                                                    <DropdownItem key="settings" textValue="Account Settings"  className='p-2'>
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
                                                    <DropdownItem key="logout" onPress={()=>{logout();setLoading(true)}}  className='p-2' textValue="Logout">
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
        </div>
        </>
    );
}
