"use client"
import { Link, Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle } from '@heroui/react'
import '../styles/globals.css'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useEffect, useState } from 'react';


export default function Component() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setIsDarkMode(savedTheme === "dark");
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const handleThemeChange = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);

    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <>
      <Navbar height="60px">
        <NavbarBrand>
          <NavbarMenuToggle className="mr-2 h-4 sm:hidden" />
          <p className="font-extrabold text-3xl">OPS</p>
        </NavbarBrand>
        <NavbarContent justify="start">
          <NavbarItem className='ml-16'>
            <Link href="/">Home</Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button isIconOnly radius="full" variant="light" onPress={handleThemeChange}>
              <Icon icon={isDarkMode ? "solar:moon-linear" : "solar:sun-linear"} width={24} />
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Link href="/auth/login">
              <Button color="primary" variant="shadow">Login</Button>
            </Link>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="flex justify-center items-center w-full gap-10 mt-20 text-xl">
        <div className={"flex flex-col gap-5 ml-7"}>
          <h2 className={"text-5xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent"}>
            Online Proctoring System
          </h2>
          <p className={"text-white text-sm border-4 border-double rounded-r-full bg-blue-800 p-3"}>
            A digital method of monitoring exams that ensures test integrity and prevents cheating, conducted via online software that enables students to sit for tests from any location.
          </p>
        </div>
        <img src="https://i.ibb.co/B5Cy5jDx/Online-Proctoring-Software-info-l1-ezgif-com-resize-removebg-preview-removebg-preview.png"
          alt="ops"
          width={700}
          height={500}
        />
      </div>
    </>
  );
}
