'use client'

import React from 'react'
import { Button, Card, Link } from '@heroui/react'
import ProfileEdit from '@/app/components/profile/edit/page'

export default function ProfileDetails() {
  return (
    <>
      <div className="flex justify-center items-center ">
        <Card className=" py-5 px-8 rounded-lg shadow-none bg-white dark:bg-[#18181b]">
          <h2 className="text-xl font-bold text-center">Add Details</h2>
          <ProfileEdit />
          <div className="flex justify-between mt-6">
            <Button><Link href="/home" className='text-[#3f3f46] dark:text-white'>Skip for now</Link></Button>
            <Button color="primary" radius="full" type="submit">
              Save & Continue
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}
