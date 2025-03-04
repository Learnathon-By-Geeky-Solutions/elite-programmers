"use client";

import { useDashboard } from "../context/DashboardContext";
import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import {
  Link, Dropdown, DropdownTrigger, DropdownMenu,
  DropdownItem, Popover, PopoverContent, PopoverTrigger, Avatar, Badge, Button
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import React, { useState, useEffect } from "react";
import MyExam from '../dashboard/candidate-dashboard/myexams/page';

import NotificationsCard from "./notifications-card";
import Home from '../dashboard/candidate-dashboard/home/page'
import { usePathname } from "next/navigation";

interface PageProps {
  onThemeToggle?: (theme: string) => void;
}

export default function Component({ onThemeToggle }: PageProps) {
  const { dashboardType } = useDashboard();
  const [selected, setSelected] = useState<string>("home");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  const handleThemeChange = () => {
    setIsDarkMode((prev) => !prev);
    const newTheme = !isDarkMode ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    if (onThemeToggle) {
      onThemeToggle(newTheme);
    }
  };

  const pathname = usePathname();

  return (
    <div>
        {!pathname?.includes('/auth') && !pathname?.includes('/admin') &&   <>
          <h2 className='flex absolute ml-24 text-3xl font-extrabold'>OPS</h2>
          <div className="flex gap-5 absolute justify-center items-center ml-[1060px]">
            <Button
              isIconOnly
              radius="full"
              variant="light"
              onPress={handleThemeChange}
              className="hover:bg-gray-200 transition-colors duration-300 cursor-pointer ml-7">
              <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} width={50} />
            </Button>
            <Popover offset={12} placement="bottom-end">
              <PopoverTrigger className="rounded-full p-2 hover:bg-gray-200 transition-colors duration-300 cursor-pointer">
                <Icon className="text-gray-600" icon="solar:bell-linear" width={40} />
              </PopoverTrigger>
              <PopoverContent className="max-w-[90vw] p-0 sm:max-w-[380px]">
                <NotificationsCard className="w-full shadow-none" />
              </PopoverContent>
            </Popover>

            <button className="mr-5">
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <div className="mt-1 h-8 w-8 outline-none transition-transform">
                    <Badge
                      className="border-transparent"
                      color="success"
                      content=""
                      placement="bottom-right"
                      shape="circle"
                      size="sm">
                      <Avatar size="sm" src="" alt="User Avatar" />
                    </Badge>
                  </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="user" className="h-14 gap-2">
                    <div className='flex gap-2 mb-2'>
                      <Avatar size="md" src="" alt="User Avatar" />
                      <div>
                        <p>Username</p>
                        <p>useremail@gmail.com</p>
                      </div>
                    </div>
                    <hr />
                  </DropdownItem>

                  <DropdownItem key="profile" className='text-white'>
                    <Link href="/myprofile/1" className="flex items-center gap-2">
                      <Icon icon="lucide:user" className="w-5 h-5" />
                      My Profile
                    </Link>
                  </DropdownItem>

                  <DropdownItem key="settings" className='text-white'>
                    <Link href="/settings/1" className="flex items-center gap-2">
                      <Icon icon="lucide:settings" className="w-5 h-5" />
                      Account Settings
                    </Link>
                  </DropdownItem>

                  <DropdownItem key="logout" className='text-white'>
                    <Link href="/auth/login" className="flex items-center gap-2">
                      <Icon icon="lucide:log-out" className="w-5 h-5" />
                      Logout
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </button>
          </div>
        </>
        }
      {dashboardType &&
        (<Tabs className={'flex justify-center space-x-7 mx-4'} aria-label="Options" selectedKey={selected} onSelectionChange={(key) => setSelected(key as string)}>
          {dashboardType === 'candidate' ? (
            <>
              <Tab key="home" title="Home">
                <Card>
                  <CardBody>
                    <Home />
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="My Exams" title="Attend Exam">
                <Card>
                  <CardBody>
                    <MyExam />
                  </CardBody>
                </Card>
              </Tab>
            </>
          ) : null}
        </Tabs>

        )}
    </div>
  );
}
