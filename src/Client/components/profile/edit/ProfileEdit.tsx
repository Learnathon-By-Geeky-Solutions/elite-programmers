'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Avatar, Input, Textarea } from '@heroui/react'
import { Icon } from '@iconify/react'
import api from '@/utils/api'
import { FormData } from '@/components/types/profile'

interface ProfileDetailsProps {
 readonly formData?: FormData
 readonly setFormData?: React.Dispatch<React.SetStateAction<FormData>>
}

/**
 * Renders a user profile editing form.
 *
 * This component provides an interface for updating profile details such as name, bio, contact information, and social links.
 * It supports both controlled and uncontrolled modes:
 * - When both `formData` and `setFormData` are provided, the component uses them for external state management.
 * - Otherwise, it manages its own local state.
 *
 * On mount, it fetches existing profile data from an API and populates the form if available. Users can add, update, or remove social links and upload a profile image.
 *
 * @param formData - Optional profile data for controlled usage.
 * @param setFormData - Optional state updater for controlled usage.
 * @returns A JSX element representing the profile editing form.
 */
export default function ProfileEdit({ formData, setFormData }: ProfileDetailsProps) {
  const [localFormData, setLocalFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    bio: '',
    instituteName: '',
    phoneNumber: '',
    imageFileId: null,
    profileLinks: [{ name: '', link: '' }],
  })

  const isControlled = formData && setFormData
  const updateFormData = useCallback(
    (updateFn: (prev: FormData) => FormData) => {
      if (isControlled) {
        setFormData!(updateFn)
      } else {
        setLocalFormData(updateFn)
      }
    },
    [isControlled, setFormData]
  )

  const handleAddSocialLink = () => {
    updateFormData((prev) => ({
      ...prev,
      profileLinks: [...prev.profileLinks, { name: '', link: '' }],
    }))
  }

  const handleSocialLinkChange = (index: number, field: 'name' | 'link', value: string) => {
    updateFormData((prev) => {
      const updatedLinks = [...prev.profileLinks]
      updatedLinks[index] = { ...updatedLinks[index], [field]: value }
      return { ...prev, profileLinks: updatedLinks }
    })
  }

  const handleRemoveSocialLink = (index: number) => {
    updateFormData((prev) => ({
      ...prev,
      profileLinks: prev.profileLinks.filter((_, i) => i !== index),
    }))
  }

  const handleImageUpload = useCallback(() => {
    const file = null
    updateFormData((prev) => ({ ...prev, imageFileId: file }))
  }, [updateFormData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormData((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        const response = await api.get('/User/Details')
        if (response.data.profile !== null) {
          updateFormData(() => ({
            firstName: response.data.profile?.firstName ?? '',
            lastName: response.data.profile?.lastName ?? '',
            bio: response.data.profile?.bioMarkdown ?? '',
            instituteName: response.data.profile?.instituteName ?? '',
            phoneNumber: response.data.profile?.phoneNumber ?? '',
            imageFileId: response.data.profile?.imageFileId ?? null,
            profileLinks: response.data.profile?.profileLinks ?? [{ name: '', link: '' }],
          }))
        }
      } catch (error) {
        console.error('Error checking profile:', error)
      }
    }

    checkProfileStatus()
  }, [updateFormData])

  const currentFormData = isControlled ? formData : localFormData

  return (
    <div className="w-full flex justify-center">
      <div>
        <div className="flex justify-center items-end text-center my-7">
          <div className="relative">
            <Avatar className="h-32 w-32" size="lg" radius="md" src="" />
            <label htmlFor="image-upload" className="absolute bottom-0 right-0 rounded-full cursor-pointer">
              <Icon icon="solar:pen-2-linear" width={20} />
              <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          <div className="flex flex-col gap-2 ml-2">
            <Input
              name="firstName"
              placeholder="Enter first name"
              value={currentFormData.firstName}
              onChange={handleChange}
            />
            <Input
              name="lastName"
              placeholder="Enter last name"
              value={currentFormData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="w-[550px] grid gap-4">
          <Textarea
            name="bio"
            placeholder="Write your bio here."
            value={currentFormData.bio}
            rows={5}
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              name="instituteName"
              placeholder="Enter institute name"
              value={currentFormData.instituteName}
              onChange={handleChange}
            />
            <Input
              name="phoneNumber"
              placeholder="Enter phone number"
              value={currentFormData.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            {currentFormData.profileLinks.map((link, index) => (
              <div key={link.name} className="flex gap-2 items-center">
                <Input
                  placeholder="Name"
                  value={link.name}
                  onChange={(e) => handleSocialLinkChange(index, 'name', e.target.value)}
                />
                <Input
                  placeholder="Social Link"
                  value={link.link}
                  onChange={(e) => handleSocialLinkChange(index, 'link', e.target.value)}
                />
                {currentFormData.profileLinks.length > 1 && (
                  <button type="button" onClick={() => handleRemoveSocialLink(index)}>
                    <Icon icon="solar:trash-bin-trash-bold" width={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSocialLink}
              className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
            >
              <Icon icon="solar:add-circle-bold" width={20} />
              Add Social Link
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
