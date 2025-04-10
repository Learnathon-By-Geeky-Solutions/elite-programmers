'use client'

import React, { useState } from 'react'
import { Button, Input, Form, Card } from '@heroui/react'
import '@/app/globals.css'
import api from '@/utils/api'
import { useRouter, useSearchParams } from 'next/navigation'
import { Icon } from '@iconify/react/dist/iconify.js'
import isValidPassword from '@/components/check-valid-password'
import ROUTES from '@/constants/route'

/**
 * Renders the account settings form.
 *
 * Displays a card with a form that lets users update their account details, including the username and password.
 * The username is pre-populated from the URL search parameters. The form validates that the username has at least 4 characters,
 * the new password matches its confirmation, and the new password meets complexity requirements (e.g., contains uppercase,
 * lowercase, number, and special character). Upon a successful API update, the user is redirected based on their role.
 * Toggle buttons allow users to show or hide password inputs.
 */
export default function Component() {
  const [newconfirmpassword, setNewconfirmpassword] = useState('')
  const [error, setError] = useState('')

  const router = useRouter()
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false)
  const [isVisibleCurrent, setIsVisibleCurrent] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState('')
  const [currentPassword, setCurrentPassword] = useState<boolean>(false)
  const [userError, setUserError] = useState('')
  const searchParams = useSearchParams()
  const username = searchParams.get('username') ?? ''

  const [formData, setFormData] = useState({
    username,
    currentPassword: '',
    newPassword: '',
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'username' && value.length < 4) {
      setUserError('Username must be at least 4 characters long.')
      return
    }

    if(name==='currentPassword' && value.length>1){
      setCurrentPassword(true)
    }
      setUserError('')
    
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (formData.newPassword !== newconfirmpassword) {
      setPasswordError('New password and confirm password do not match.')
      return
    }
    if (formData.newPassword.length>1 && !isValidPassword(formData.newPassword)) {
      setPasswordError(
        'New Password must contain at least one uppercase letter,  lowercase letter, number, special character.'
      )
      return
    }
   setPasswordError('')
    try {
      const response = await api.patch(ROUTES.ACCOUNT_SETTING, formData)
      if (response.status === 200) {
        if (response.data.roles.some((e:string)=>(e.toLowerCase().includes('admin')))) router.push(ROUTES.ADMIN_SETTING)
        else router.push(ROUTES.CANDIDATE_SETTING)
      }
    } catch {
      setError('Username or Current Password is not correct')
    }
  }

  return (
    <div className="flex mt-24 w-full items-center justify-center">
      <Card className="flex w-full max-w-sm flex-col gap-4 rounded-large shadow-none bg-white dark:bg-[#18181b] bg-content1 px-8 pb-10 pt-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold text-center mb-4">Account Settings</h1>
        </div>
        <Form
          className="flex w-full flex-wrap md:flex-nowrap gap-4 flex-col"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          {error && <p className="text-red-500">{error}</p>}
          <Input
            isRequired
            label="Username"
            name="username"
            type="text"
            className="bg-[#f4f4f5] dark:bg-[#27272a] rounded-xl"
            value={formData.username}
            defaultValue={username}
            onChange={handleChange}
          />
          {userError && <p className="text-red-500">{userError}</p>}
          <Input
            label="Current Password"
            endContent={
              <button type="button" onClick={() => setIsVisibleCurrent(!isVisibleCurrent)}>
                <Icon
                  className="text-2xl text-default-400"
                  icon={isVisibleCurrent ? 'solar:eye-closed-linear' : 'solar:eye-bold'}
                />
              </button>
            }
            name="currentPassword"
            type={isVisibleCurrent ? 'text' : 'password'}
            className="bg-[#f4f4f5] dark:bg-[#27272a] rounded-xl"
            value={formData.currentPassword}
            onChange={handleChange}
          />
          <Input
          isRequired={currentPassword}
            endContent={
              <button type="button" onClick={() => setIsVisible(!isVisible)}>
                <Icon
                  className="text-2xl text-default-400"
                  icon={isVisible ? 'solar:eye-closed-linear' : 'solar:eye-bold'}
                  />
              </button>
            }
            label="New Password"
            name="newPassword"
            type={isVisible ? 'text' : 'password'}
            className="bg-[#f4f4f5] dark:bg-[#27272a] rounded-xl"
            value={formData.newPassword}
            onChange={handleChange}
            />
            {passwordError && <p className="text-red-500">{passwordError}</p>}
          <Input
            isRequired={currentPassword}
            endContent={
              <button type="button" onClick={() => setIsConfirmVisible(!isConfirmVisible)}>
                <Icon
                  className="text-2xl text-default-400"
                  icon={isConfirmVisible ? 'solar:eye-closed-linear' : 'solar:eye-bold'}
                />
              </button>
            }
            label="Confirm Password"
            name="newconfirmpassword"
            type={isConfirmVisible ? 'text' : 'password'}
            className="bg-[#f4f4f5] dark:bg-[#27272a] rounded-xl"
            value={newconfirmpassword}
            onChange={(e) => setNewconfirmpassword(e.target.value)}
          />
          <Button className="w-full mt-2 text-medium" color="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      </Card>
    </div>
  )
}
