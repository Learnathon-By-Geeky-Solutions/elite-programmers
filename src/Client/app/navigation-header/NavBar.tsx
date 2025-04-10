'use client'

import React from 'react'
import {
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Avatar,
  NavbarContent,
  NavbarItem,
  Badge,
  Navbar,
  Divider,
  Button,
} from '@heroui/react'
import { Icon } from '@iconify/react'
import NotificationsCard from '@/app/navigation-header/notifications-card'
import ThemeSwitch from '../ThemeSwitch'
import { useAuth } from '@/context/AuthProvider'

/**
 * Renders a responsive navigation bar with theme toggling, notifications, and user account actions.
 *
 * The navigation bar features:
 * - A theme switcher to toggle between light and dark modes.
 * - A notifications popover displaying alerts via a notifications card.
 * - A user dropdown that shows profile details and provides options to view the profile, adjust account settings, or log out.
 *
 * The component leverages the authentication context to retrieve the current user and the logout operation.
 *
 * @returns The JSX element representing the navigation bar.
 */
export default function Component() {
  const { user, logout } = useAuth()
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
            <Popover offset={12} placement="bottom-end">
              <PopoverTrigger className="rounded-full p-2 hover:bg-gray-200 transition-colors duration-300 cursor-pointer">
                <Icon className="text-gray-600" icon="solar:bell-linear" width={40} />
              </PopoverTrigger>
              <PopoverContent className="max-w-[90vw] p-0 sm:max-w-[380px]">
                <NotificationsCard className="w-full shadow-none" />
              </PopoverContent>
            </Popover>
          </NavbarItem>
          <NavbarItem>
            <button className="">
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
                    <Link
                      href="/myprofile"
                      className="flex items-center gap-2"
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      <Icon icon="lucide:user" className="w-5 h-5" />
                      My Profile
                    </Link>
                  </DropdownItem>

                  <DropdownItem key="settings">
                    <Link
                      href="/mysettings"
                      className={`flex items-center gap-2`}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      <Icon icon="lucide:settings" className="w-5 h-5" />
                      Account Settings
                    </Link>
                  </DropdownItem>

                  <DropdownItem key="logout">
                    <Icon icon="lucide:log-out" className="w-5 h-5" />
                    <Button onPress={logout}>Logout</Button>
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
