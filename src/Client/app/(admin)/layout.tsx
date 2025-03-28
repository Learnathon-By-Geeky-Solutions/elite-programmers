'use client'

import '@/app/globals.css'
import SideBar from '@/app/(admin)/sidebar/page'
import withProtectedRoute from '@/app/components/utils/withProtectedRoute '

interface RootLayoutProps {
  readonly children: React.ReactNode
}

const AdminLayout = ({ children }: RootLayoutProps) => {
  return (
    <div className="flex min-h-screen ">
      <SideBar />
      <div className="flex-grow w-full ">
        {children}
      </div>
    </div>
  )
}
export default withProtectedRoute(AdminLayout)
