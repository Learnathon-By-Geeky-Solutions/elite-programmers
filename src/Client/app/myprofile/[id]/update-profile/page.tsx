"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Link,
  Avatar,
  Input,
  Textarea,
  CardFooter,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import "../../../../styles/globals.css";

export default function ProfileDetails() {
  const [socialLinks, setSocialLinks] = useState<string[]>([""]);

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, ""]); 
  };

  const handleSocialLinkChange = (index: number, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = value;
    setSocialLinks(newLinks);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[800px] p-6 shadow-lg rounded-lg">
        <h2 className="text-lg font-semibold my-3 text-center">Update Profile</h2>
        <CardHeader className="flex items-center text-center">
          <div className="relative">
            <Avatar className="h-24 w-24 ml-56" size="lg" src="" />
            <button className="absolute bottom-2 right-2 rounded-full shadow">
              <Icon icon="solar:pen-2-linear" width={20} />
            </button>
          </div>
          <div className="flex flex-col gap-3 ml-4">
            <Input label="" placeholder="Enter first name" />
            <Input label="" placeholder="Enter last name" />
          </div>
        </CardHeader>

        <CardBody className="grid gap-4">
          <Textarea label="" placeholder="Write your bio here." />
          <div className="grid grid-cols-2 gap-2">
            <Input label="" placeholder="Enter institute name" />
            <Input label="" placeholder="Enter phone number" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  label={`Social Link ${index + 1}`}
                  placeholder="Enter social link"
                  value={link}
                  onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-start mt-2">
            <button
              onClick={handleAddSocialLink}
              className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
            >
              <Icon icon="lucide:circle-plus" className="w-6 h-6 mr-2" />
              Add Social Link
            </button>
          </div>
        </CardBody>

        <CardFooter className="flex justify-center">
          <Button color="primary" radius="full">
            <Link className="text-white" href="/myprofile/1">Save Changes</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
