'use client'
import React, { useEffect, useState } from "react";
import { Tabs, Tab, Card, CardBody, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import Candidate from '../users-management/page';
import Exams from '../view-exams/page';
import Admin from '../admin-management/page';
import InviteCandidates from '../invite-candidates/page';
import CreateExams from '../create-exams/page';
import Home from '../home/page';
import ModerateExam from '../moderate-exam/page'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import Logo from '../../../components/ui/logo/page'

export default function Component() {
  // console.log(typeof onThemeToggle);
  const [selected, setSelected] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const handleThemeChange = () => {
    setIsDarkMode((prev) => !prev);
    const newTheme = !isDarkMode ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    // if (onThemeToggle) {
    //   onThemeToggle.(newTheme);
    // }
  };

  return (
    <div className="flex">
    <div className={`flex flex-col justify-between h-screen ${isCollapsed ? "w-20" : "w-64"} transition-all duration-300 dark:bg-gray-900 border-r border-white/10`}>
        <div>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {!isCollapsed && (
            <div className="flex items-center gap-1">
            <Logo/>
            {!isCollapsed && <span className="font-bold text-xl">OPS</span>}
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/10 rounded-lg"
          >
            <Icon icon={isCollapsed ? "lucide:chevron-right" : "lucide:chevron-left"} width={20} />
          </button>
        </div>
        <Tabs
          aria-label="Navigation"
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key.toString())}
          className=""
          variant="light"
          isVertical
          classNames={{
            tab: "flex items-center justify-start h-10 rounded-lg hover:bg-white/10 data-[selected=true]:bg-primary/20 data-[selected=true]:text-primary",
            tabList: "flex flex-col ",
            cursor: "bg-transparent",
          }}
        >
          <Tab
            key="dashboard"
            title={
              <div className="flex items-center gap-3">
                <Icon icon="lucide:layout-dashboard" width={20} />
                {!isCollapsed && <span>Dashboard</span>}
              </div>
            }
          >
          </Tab>
          <Tab 
            key="viewexams"
            title={
              <div className="flex items-center gap-3">
                <Icon icon="lucide:book-open" width={20} />
                {!isCollapsed && <span>View Exams</span>}
              </div>
            }>
          </Tab>
          <Tab
            key="createexams"
            title={
              <div className="flex items-center gap-3">
                <Icon icon="lucide:plus-circle" width={20} />
                {!isCollapsed && <span>Create Exams</span>}
              </div>
            }>
          </Tab>
          <Tab
            key="invitecandidates"
            title={
              <div className="flex items-center gap-3">
                <Icon icon="lucide:users" width={20} />
                {!isCollapsed && <span>Invite Candidates</span>}
              </div>
            }>
          </Tab>

          <Tab
            key="moderateexam"
            title={
              <div className="flex items-center gap-3">
                <Icon icon="lucide:shield" width={20} />
                {!isCollapsed && <span>Moderate Exams</span>}
              </div>
            }
          >
          </Tab>

          <Tab
            key="users"
            title={
              <div className="flex items-center gap-3">
                <Icon icon="lucide:user" width={20} />
                {!isCollapsed && <span>Users Management</span>}
              </div>
            }>
          </Tab>
          <Tab
            key="admins"
            title={
              <div className="flex items-center gap-3">
                <Icon icon="lucide:settings" width={20} />
                {!isCollapsed && <span>Admin Management</span>}
              </div>
            }>
          </Tab>
        </Tabs>
        </div>
        <div>
        <hr />
        <div className="border-t border-white/10 px-2 py-4 mb-5">
          <div className="flex flex-col gap-1 ">
           <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center ">
              <Icon icon="lucide:user" className="text-primary" width={16} />
            </div>
            {!isCollapsed && (
             <Link href="/myprofile/1" className="text-black dark:text-white"> <div>
             <p className="text-sm ">Administrator</p>
             <p className="text-xs">admin@truetest.com</p>
           </div></Link>
            )}
           </div>
              <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Icon icon="lucide:settings" className="text-primary" width={16} />
            </div>
             {!isCollapsed && (
              <div>
                <Link href="/settings/1" className="text-black dark:text-white"> 
                 <p className="text-sm ">settings</p></Link>
              </div>
            )}</div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} width={30} />
            </div>
             {!isCollapsed && (<>
                 <button onClick={handleThemeChange} className="text-sm  text-black dark:text-white">Theme</button>
            </>)}</div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Icon icon="lucide:log-out" className="text-primary" width={16} />
            </div>
             {!isCollapsed && (
              <div>
                 <Link href="/auth/login" className="text-black dark:text-white"> 
                 <p className="text-sm ">log out</p></Link>
              </div>
            )}</div>
          </div>
        </div>
        </div>

        </div>

      <div className="flex-1 overflow-auto">
        <Card className="dark:bg-gray-900 border-none h-screen ">
          <CardBody>
            {selected === "dashboard" && <Home />}
            {selected === "viewexams" && <Exams />}
            {selected === "createexams" && <CreateExams />}
            {selected === "invitecandidates" && <InviteCandidates />}
            {selected === "moderateexam" && <ModerateExam />}
            {selected === "users" && <Candidate />}
            {selected === "admins" && <Admin />}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}