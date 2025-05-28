export interface ProfileLink {
  name: string
  link: string
}
export interface ProfileDetailsProps {
  readonly formData?: ProfileFormData;
  readonly setFormData?: React.Dispatch<React.SetStateAction<ProfileFormData>>;
}
export interface UserProfile {
  profileId: string
  firstName: string
  lastName: string
  bioMarkdown?: string
  instituteName?: string
  phoneNumber?: string
 imageFile: {
      cloudFileId: string,
      fileId: string,
      name: string,
      contentType: string,
      size: number,
      webContentLink: string,
      webViewLink: string,
      directLink: string,
      createdAt: string
    },
  profileLinks: ProfileLink[]
}

export interface User {
  accountId: string
  username: string
  email: string
  createdAt: string
  isActive: boolean
  profile: UserProfile | null
  roles: string[]
}

export interface ProfileFormData {
  firstName: string
  lastName: string
  bio: string
  instituteName: string
  phoneNumber: string
  imageFileId: string
  profileLinks: { name: string; link: string }[];
}