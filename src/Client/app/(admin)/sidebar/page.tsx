'use client'

import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useState } from 'react'
import Logo from '@/app/components/ui/logo/page'
import ThemeSwitch from '@/app/ThemeSwitch'
import { Avatar } from '@heroui/react'
import { PiNotepadFill } from 'react-icons/pi'
import { BiSolidPlusSquare, BiSolidUserRectangle } from 'react-icons/bi'
import { MdEmail } from 'react-icons/md'
import { RiAdminFill, RiDashboardFill } from 'react-icons/ri'
import { FaUser } from 'react-icons/fa6'
import { IoLogOut, IoSettingsSharp } from 'react-icons/io5'

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

  return (
    <div className={`h-screen  flex flex-col  justify-between bg-white dark:bg-[#18181b] rounded-lg p-3`}>
      <div className={`h-screen flex flex-col justify-between ${isCollapsed ? 'w-20' : 'w-56'}`}>
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
              <Link href={`/profile`}>
                <div>
                  <p>admin</p>
                  <p className={`text-sm opacity-50`}>administrator</p>
                </div>
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

        <div className="bottom-0">
          <div className="flex flex-col gap-2 ">
            {!isCollapsed && <p className=" opacity-50">Account</p>}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <FaUser size={20} />
              </div>
              {!isCollapsed && (
                <Link href={`/profile`}>
                  <div>
                    <p className={`text-sm `}>My Profile</p>
                  </div>
                </Link>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <IoSettingsSharp size={24} />
              </div>
              {!isCollapsed && (
                <div className="flex">
                  <Link href="/settings">
                    <p className={``}>Settings</p>
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 ml-2">
              <ThemeSwitch />
              {!isCollapsed && <button>Theme</button>}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <IoLogOut size={24} />
              </div>
              {!isCollapsed && (
                <div>
                  <Link href="/login">
                    <p className={`text-sm`}>Log Out</p>
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
