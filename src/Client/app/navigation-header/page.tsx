"use client";
import Cookies from 'js-cookie';
import { useDashboard } from "../DashboardContext";
import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import {
  Link, Dropdown, DropdownTrigger, DropdownMenu,
  DropdownItem, Popover, PopoverContent, PopoverTrigger, Avatar, Badge, Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle, Button
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import React, { useState } from "react";
import Candidate from '../admin_dashboard/candidate-management/page'
import Exam from '../admin_dashboard/exam-management/page'
import Live from '../admin_dashboard/live-monitoring/page'
import Reviewer from '../admin_dashboard/reviewer-management/page'
import AttendExam from '../candidate_dashboard/attend-exam/page'
import ExamSchedule from '../candidate_dashboard/exam-schedule/page'
import ViewResult from '../candidate_dashboard/view-result/page'
import Review from '../reviewer_dashboard/review-list/page'
import NotificationsCard from "./notifications-card";
import GoTo from '../goto'
import { useAuth } from "../hook/useAuth";
import { useRouter } from "next/navigation";
import { FaMoon } from 'react-icons/fa';
interface PageProps {
  onThemeToggle?: (theme: string) => void | undefined;
}

export default function Component({ onThemeToggle }: PageProps) {
  const { dashboardType } = useDashboard();
  type User = {
    email: string;
    username: string;
  };

  const user: User | null = useAuth();
  console.log(user);
  const [selected, setSelected] = useState<string>("home");
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const handleThemeChange = () => {
    setIsDarkMode((prev) => !prev);
    const newTheme = !isDarkMode ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    if (onThemeToggle) {
      onThemeToggle(newTheme);
    }
  };
  const logout = () => {
    Cookies.remove('authToken');
    localStorage.removeItem("user");
    router.push('/login');
  };
  return (
    <>
      {dashboardType ? <>
       <h2 className='flex absolute ml-24 text-3xl font-extrabold'>OPS</h2>
        <div className="flex gap-5 absolute justify-center items-center ml-[1060px]">
          <Button
            isIconOnly
            radius="full"
            variant="light"
            onPress={handleThemeChange}
            className="hover:bg-gray-200 transition-colors duration-300 cursor-pointer ml-7">
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} width={30} />
          </Button>

          <Link href="/settings/1"
            className="rounded-full p-2 hover:bg-gray-200 transition-colors duration-300 cursor-pointer">
            <Icon className="text-gray-600" icon="solar:settings-linear" width={24} />
          </Link>

          <Popover offset={12} placement="bottom-end">
            <PopoverTrigger className="rounded-full p-2 hover:bg-gray-200 transition-colors duration-300 cursor-pointer">
              <Icon className="text-gray-600" icon="solar:bell-linear" width={35} />
            </PopoverTrigger>
            <PopoverContent className="max-w-[90vw] p-0 sm:max-w-[380px]">
              <NotificationsCard className="w-full shadow-none" />
            </PopoverContent>
          </Popover>
          <button className={'mr-5'}>
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
                    <Avatar size="sm" src="" />
                 </Badge>
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as <br /> {user}</p>
                </DropdownItem>
                <DropdownItem key="settings"><Link href="/myprofile/1">My Profile</Link></DropdownItem>
                <DropdownItem key="logout" color="danger" onPress={() => logout()} className="bg-red-500 text-white px-3 py-2 rounded">
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </button>
        </div>
        <Tabs className={'flex justify-center space-x-7'} aria-label="Options" selectedKey={selected} onSelectionChange={(key) => setSelected(key as string)}>

          {dashboardType === 'admin' ?
            <>
              <Tab key="home" title="Home" >
                <Card className={"w-[200px] mt-24 ml-44 "}>
                  <CardBody >
                    <GoTo dashboardType={'candidate'} />
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="candidate" title="Candidate">
                <Card className="w-full">
                  <CardBody>
                    <Candidate />
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="exam" title="Exam">
                <Card className="w-full">
                  <CardBody>
                    <Exam />
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="reviewer" title="Reviewer">
                <Card className="w-full">
                  <CardBody>
                    <Reviewer />
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="live" title="Live">
                <Card className="w-full">
                  <CardBody>
                    <Live />
                  </CardBody>
                </Card>
              </Tab>
            </>
            : dashboardType === 'candidate' ? < >
              <Tab key="home" title="Home">
                <Card className={"w-[200px] mt-24 ml-44 "}>
                  <CardBody >
                    <GoTo dashboardType={'reviewer'} />
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="attend-exam" title="Attend Exam">
                <Card>
                  <CardBody>
                    <AttendExam />
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="exam-schedule" title="Exam Schedule">
                <Card>
                  <CardBody>
                    <ExamSchedule />
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="viewresult" title="View Result">
                <Card>
                  <CardBody>
                    <ViewResult />
                  </CardBody>
                </Card>
              </Tab>
            </>
              : dashboardType === 'reviewer' ? <>
                <Tab key="home" title="Home" className='ml-7'/>
                <Tab key="reviewer" title="Review">
                  <Card className="w-full ">
                    <CardBody>
                      <Review />
                    </CardBody>
                  </Card>
                </Tab>
              </>
                : ""
          }
        </Tabs>
      </>
        :
        <Navbar
          classNames={{
            base: "shadow lg:backdrop-filter-none",
            item: "data-[active=true]:text-primary",
            wrapper: "px-4",
          }}
          height="60px">
          <NavbarBrand>
            <NavbarMenuToggle className="mr-2 h-6 sm:hidden" />
            <p className="font-extrabold text-3xl">OPS</p>
          </NavbarBrand>

          <NavbarContent
            className="ml-4 hidden h-12 w-full max-w-fit gap-6 rounded-full bg-content2 px-4 dark:bg-content1 sm:flex"
            justify="start">
            <NavbarItem>
              <Link aria-current="page" className="flex gap-2 text-center" href={dashboardType ? `/${dashboardType}_dashboard` : `/`}>
                Home
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              <Button
                isIconOnly
                radius="full"
                variant="light"
                onPress={handleThemeChange} >
                <Icon
                  className="text-default-500"
                  icon={isDarkMode ? "solar:moon-linear" : "solar:sun-linear"}
                  width={24} />
              </Button>
            </NavbarItem>
            <NavbarItem className="hidden lg:flex">
              <Link href="/login">
                <Button color="primary" variant="shadow">
                  Login
                </Button>
              </Link>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      }
    </>
  )
}