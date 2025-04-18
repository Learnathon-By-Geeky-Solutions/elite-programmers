'use client'

import React from 'react'
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
} from '@heroui/react'
import { Icon } from '@iconify/react'
import ThemeSwitch from '../ThemeSwitch'
import { useAuth } from '@/context/AuthProvider'
import { useRouter } from 'next/navigation'

export default function Component() {
  const { user, logout } = useAuth()
  const router=useRouter()
  return (
    <div>
      <Navbar
        classNames={{
          wrapper: 'w-full justify-end bg-[#eeeef0] dark:bg-[#000000]',
          item: 'hidden md:flex',
        }}
      >
        <NavbarContent className="h-11 gap-3 rounded-full bg-[#ffffff] px-4 dark:bg-[#18181b]" justify="end">
          <NavbarItem>
            <ThemeSwitch />
          </NavbarItem>
          <NavbarItem>
            <button type="button">
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <div className="mt-1 h-8 w-8 outline-none transition-transform">
                    <Badge
                      className="border-transparent"
                      color="success"
                      content=""
                      placement="bottom-right"
                      shape="circle"
                      size="sm"
                    >
                      <Avatar size="sm" src="" alt="User Avatar" />
                    </Badge>
                  </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="user" className="h-14 gap-2">
                    <div className="flex gap-2 my-4">
                      <Avatar size="md" src="" alt="User Avatar" />
                      <div>
                        <p>{user?.username}</p>
                        <p>{user?.email}</p>
                      </div>
                    </div>
                    <Divider className="mb-5" />
                  </DropdownItem>
                  <DropdownItem key="profile">
                    <button onClick={()=>router.push('/myprofile')}
                      className="flex items-center gap-2"
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      <Icon icon="lucide:user" className="w-5 h-5" />
                      My Profile
                    </button>
                  </DropdownItem>

                  <DropdownItem key="settings">
                      <button onClick={()=>router.push("/mysettings")}
                      className={`flex items-center gap-2`}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      <Icon icon="lucide:settings" className="w-5 h-5" />
                      Account Settings
                    </button>
                  </DropdownItem>

                  <DropdownItem key="logout" onPress={logout}>
                    <div className="flex gap-2"><Icon icon="lucide:log-out" className="w-5 h-5" />
                    <p>Logout</p></div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  )
}
