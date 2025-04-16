'use client'

import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useState } from 'react'
import Logo from '@/components/ui/logo/page'
import ThemeSwitch from '@/app/ThemeSwitch'
import { Avatar, Button } from '@heroui/react'
import { PiNotepadFill } from 'react-icons/pi'
import { BiSolidPlusSquare, BiSolidUserRectangle } from 'react-icons/bi'
import { MdEmail } from 'react-icons/md'
import { RiAdminFill, RiDashboardFill } from 'react-icons/ri'
import { IoLogOut, IoSettingsSharp } from 'react-icons/io5'
import { useAuth } from '@/context/AuthProvider'

const menuItems = [
  { key: 'dashboard', icon: <RiDashboardFill size={30} />, label: 'Dashboard', path: '/overview' },
  { key: 'viewexams', icon: <PiNotepadFill size={30} />, label: 'View Exams', path: '/view-exams' },
  { key: 'createexams', icon: <BiSolidPlusSquare size={30} />, label: 'Create Exams', path: '/exams/create' },
  { key: 'invitecandidates', icon: <MdEmail size={30} />, label: 'Invite Candidates', path: '/invite-candidates' },
  { key: 'users', icon: <BiSolidUserRectangle size={30} />, label: ' Manage Users', path: '/manage-users' },
  { key: 'admins', icon: <RiAdminFill size={30} />, label: 'Add Admins', path: '/add-admins' },
]
const Sidebar = () => {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  const { user,logout } = useAuth()
  return (
    <div className={`min-h-screen flex flex-col flex-grow  justify-between bg-white dark:bg-[#18181b]  rounded-lg p-3`}>
      <div className={` flex flex-col justify-between ${isCollapsed ? 'w-16' : 'w-56'}`}>
        <div>
          <div className="flex flex-col pt-3 pl-2">
            <div className="flex w-full justify-between ">
              {!isCollapsed && <Logo />}
              <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg">
                <Icon icon={isCollapsed ? 'lucide:chevron-right' : 'lucide:chevron-left'} width={20} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-3 my-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <Avatar size="sm" src="" alt="User Avatar" />
            </div>
            {!isCollapsed && (
              <Link href={`/profile`} className="flex flex-col gap-1 w-full">
                <p className="text-sm font-medium flex-wrap">{user?.username}</p>
                <p className={`text-xs text-gray-500 flex-wrap`}>{user?.email}</p>
              </Link>
            )}
          </div>
          <ul className="pt-3">
            {!isCollapsed && <li className=" opacity-50">Overview</li>}
            {menuItems.map((item) => (
              <li
                key={item.key}
                className={`flex items-start gap-2 p-2 rounded-lg hover:bg-white/10 
              ${pathname === item.path ? 'bg-[#eeeef0] dark:bg-[#27272a]' : ''}`}
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

        <div className="bottom-0 mt-5">
          <div className="flex flex-col gap-2 ">
            {!isCollapsed && <p className=" opacity-50">Account</p>}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <IoSettingsSharp size={24} />
              </div>
              {!isCollapsed && (
                <div className="flex">
                  <Link href="/settings">
                    <p className={`text-sm`}>Settings</p>
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 ml-1">
              <ThemeSwitch withText={true}/>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <IoLogOut size={24} />
              </div>
              {!isCollapsed && (
                <div>
                  <Link href="/signin">
                    <Button className={`text-sm`} onPress={logout}>Log Out</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
