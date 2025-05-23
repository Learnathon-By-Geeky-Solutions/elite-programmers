'use client'

import React from 'react'
import '@/app/globals.css'
import RootNavBar from '../../root-navbar'
import SettingsEdit from '@/components/settings/edit/page'

export default function Component() {
  return (
    <>
      <RootNavBar />
      <SettingsEdit />
    </>
  )
}
