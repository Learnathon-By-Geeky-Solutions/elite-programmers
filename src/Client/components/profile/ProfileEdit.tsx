'use client'

import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Input, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';
import api from '@/lib/api';
import { ProfileDetailsProps, ProfileFormData } from '@/components/types/profile';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthProvider'



export default function ProfileEdit({ formData, setFormData }: ProfileDetailsProps) {
  const [localFormData, setLocalFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    bio: '',
    instituteName: '',
    phoneNumber: '',
    imageFileId: '', 
    profileLinks: [{ name: '', link: '' }],
  });
  const { setProfileImage, profileImage } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const isControlled = formData && setFormData;
  const currentFormData = isControlled ? formData : localFormData;
  const updateFormData = useCallback(
    (updateFn: (prev: ProfileFormData) => ProfileFormData) => {
      if (isControlled) {
        setFormData!(updateFn);
      } else {
        setLocalFormData(updateFn);
      }
    },
    [isControlled, setFormData]
  );
  const handleAddSocialLink = useCallback(() => {
    updateFormData((prev) => ({
      ...prev,
      profileLinks: [...prev.profileLinks, { name: '', link: '' }],
    }));
  }, [updateFormData]);
  const handleSocialLinkChange = useCallback(
    (index: number, field: 'name' | 'link', value: string) => {
      updateFormData((prev) => {
        const updatedLinks = [...prev.profileLinks];
        updatedLinks[index] = { ...updatedLinks[index], [field]: value };
        return { ...prev, profileLinks: updatedLinks };
      });
    },
    [updateFormData]
  );
  const handleRemoveSocialLink = useCallback(
    (index: number) => {
      updateFormData((prev) => ({
        ...prev,
        profileLinks: prev.profileLinks.filter((_, i) => i !== index),
      }));
    },
    [updateFormData]
  );
  const fetchImageUrl = useCallback(async (fileId: string | null) => {
    if (fileId) {
      try {
        const response = await api.get(`/CloudFile/Details/${fileId}`);
        setImageUrl(response.data.directLink);
        setProfileImage(response.data.directLink);
      } catch (error) {
        console.error('Error fetching image URL:', error);
        setImageUrl(null);
      }
    } else {
      setImageUrl(null);
    }
  }, [setProfileImage]);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file) return;
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed (JPEG, PNG)');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await api.post('/CloudFile/Upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const cloudFileId = response.data.cloudFileId;
        updateFormData((prev) => ({ ...prev, imageFileId: cloudFileId }));
        const tempUrl = URL.createObjectURL(file);
        setImageUrl(tempUrl);
        setProfileImage(tempUrl);
        fetchImageUrl(cloudFileId); 
        toast.success('Image uploaded successfully');
      } catch {
        toast.error('Failed to upload image.Please check your network connection and try again.');
      } finally {
        setUploading(false);
      }
    },
    [updateFormData, fetchImageUrl, setProfileImage]
  );
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      updateFormData((prev) => ({ ...prev, [name]: value }));
    },
    [updateFormData]
  );

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        const response = await api.get('/User/Details');
        if (response.data.profile !== null) {
          const profileData: ProfileFormData = {
            firstName: response.data.profile?.firstName ?? '',
            lastName: response.data.profile?.lastName ?? '',
            bio: response.data.profile?.bioMarkdown ?? '',
            instituteName: response.data.profile?.instituteName ?? '',
            phoneNumber: response.data.profile?.phoneNumber ?? '',
            imageFileId: response.data.profile?.imageFile?.cloudFileId ?? '',
            profileLinks: response.data.profile?.profileLinks ?? [{ name: '', link: '' }],
          };
          updateFormData(() => profileData);
          fetchImageUrl(profileData.imageFileId); 
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      }
    };
    checkProfileStatus();
  }, [updateFormData, fetchImageUrl]);

  return (
    <div className="w-full flex justify-center">
      <div>
        <div className="flex justify-center items-end text-center my-7">
          <div className="relative">
            <Avatar className="h-32 w-32" size="lg" radius="md" src={imageUrl || profileImage || ''} />
            <label htmlFor="image-upload" className="absolute bottom-0 right-0 rounded-full cursor-pointer">
              {uploading ? <Icon icon="solar:loading" className="animate-spin" width={20} /> : <Icon icon="solar:pen-2-linear" width={20} />}
              <input
                id="image-upload"
                type="file"
                // accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
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
              <div key={index} className="flex gap-2 items-center">
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
  );
}