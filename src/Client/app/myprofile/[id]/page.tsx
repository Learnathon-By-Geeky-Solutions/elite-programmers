'use client';

import { Avatar ,Link} from '@heroui/react';
import React from 'react';

const ProfilePage = () => {
  return (
    <div className="dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className=" rounded-2xl shadow-lg p-8 w-[600px]">
        <div className="flex items-center gap-2 mb-6">
          <Avatar
            src="" 
            alt="Profile"
            className="rounded-full w-32 h-32 object-cover"
          />
          <div>
          <h2 className="text-2xl font-semibold mb-2">Username</h2>
          <p className="text-gray-400 mb-4">@user</p>
            </div>
        </div>

        <p className="text-sm mb-4">
          This is my bio section. You can add a short description about yourself here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

       <hr/>
        <div className="space-y-2 mb-4 mt-4">
          <p className="text-sm">
            <strong>Email:</strong> <a href="mailto:info@user.com" className="text-blue-400">info@rawfin.com</a>
          </p>
          <p className="text-sm">
            <strong>Institute:</strong> Lorem University
          </p>
          <p className="text-sm">
            <strong>Phone:</strong> +880 123456789
          </p>
          <p className="text-sm">
            <strong>Joined:</strong> 28 Nov 2026, 10:08 PM
          </p>
        </div>
        <div className="flex justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded">
           <Link className='text-white' href="/myprofile/1/update-profile"> Update Profile</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;