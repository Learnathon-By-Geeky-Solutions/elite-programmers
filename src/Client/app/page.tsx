"use client";

import "@/app/globals.css";
import {
    Link,
    Navbar,
    NavbarContent,
    NavbarItem,
} from "@heroui/react";
import Logo from "@/components/ui/TrueTestLogo";
import { useEffect } from "react";
import { getAuthToken } from "@/lib/auth";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/route";
import ThemeSwitch from "./ThemeSwitch";

export default function Component() {
    const router = useRouter();
    const { user: authenticatedUser } = useAuth();
    useEffect(() => {
        if (getAuthToken()) {
            if (authenticatedUser?.roles.includes("Admin")) {
                router.push(ROUTES.OVERVIEW);
            } else {
                router.push(ROUTES.HOME);
            }
        } else {
            router.push('/');
        }
    }, [authenticatedUser?.roles, router]);
    return (
        <div className="h-full flex flex-col justify-between">
             <div className=" w-full flex justify-between items-center h-16 px-14 pt-3">
                  <div className="bg-[#eeeef0] dark:bg-[#000000]">
                    <Logo />
                  </div>
                  <div className="flex">
                    <Navbar
                      classNames={{
                        wrapper: 'justify-end bg-[#eeeef0] dark:bg-[#000000]',
                        item: 'hidden md:flex',
                      }} >
                      <NavbarContent className=" h-11 gap-5 rounded-full bg-[#ffffff] dark:bg-[#18181b]  px-4 " justify="end">
                        <NavbarItem>
                          <Link className="text-[#3f3f46] dark:text-white" href="#">
                            About Us
                          </Link>
                        </NavbarItem>
                        <NavbarItem>
                          <Link className="text-[#3f3f46] dark:text-white" href="#">
                            Contact
                          </Link>
                        </NavbarItem>
                        <NavbarItem>
                          <Link className="text-[#3f3f46] dark:text-white" href="#">
                            Support
                          </Link>
                        </NavbarItem>
                        <NavbarItem>
                          <Link className="text-[#3f3f46] dark:text-white" href="#">
                            FAQs
                          </Link>
                        </NavbarItem>
                      </NavbarContent>
                      <NavbarContent className="h-11 gap-5 rounded-full bg-[#ffffff] px-4 dark:bg-[#18181b]" justify="end">
                       <NavbarItem><Link href='/signin' className="text-[#3f3f46] dark:text-white">Sign In</Link></NavbarItem>
                       <NavbarItem><Link href='/signup' className="text-[#3f3f46] dark:text-white">Register</Link></NavbarItem>
                        <NavbarItem className="text-[#3f3f46] dark:text-white ">
                          <ThemeSwitch />
                        </NavbarItem>
                      </NavbarContent>
                    </Navbar>
                  </div>
                </div>
            <div className="flex justify-around items-center gap-12 ">
                <div className="flex flex-col items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                       <Logo size={80} textsz={'text-6xl'}/>
                    </div>
                    <div className="flex flex-col items-center justify-center text-8xl font-bold ">
                        <p> Your Secure Platform</p>
                        <p>for Assessments</p>
                    </div>
                    <p className="text-[#71717A] light:text-black w-[650px] text-xl text-center">
                        TrueTest ensures a fair, secure environment with
                        real-time proctoring and anti-cheating features, so you
                        can focus on showcasing your skills!
                    </p>
                </div>
            </div>
            <footer className="w-full px-5 my-2">
                <div className="flex justify-between items-center text-gray-400">
                    <p>© 2025 TrueTest. All rights reserved.</p>
                    <p>Contact Us: <Link href="#">support@truetest.tech</Link></p>
                </div>
            </footer>
        </div>
    );
}
