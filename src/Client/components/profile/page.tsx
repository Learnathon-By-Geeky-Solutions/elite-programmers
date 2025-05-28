"use client";
import React, { useEffect, useState } from "react";
import { Avatar, Card, Link, Button } from "@heroui/react";
import { FaLink } from "react-icons/fa6";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/api";
import { FormatDatewithTime } from "../DateTimeFormat";
import { ProfileLink, User } from "../types/profile";
import { useAuth } from "@/context/AuthProvider";

export default function ProfilePage() {
    const path = usePathname();
    const [route, setRoute] = useState("");
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { profileImage } = useAuth();
    useEffect(() => {
        setRoute(path.startsWith("/profile") ? "profile" : "myprofile");
    }, [path]);

    useEffect(() => {
        const fetchProfileInfo = async () => {
            try {
                setLoading(true);
                const response = await api.get("/User/Details");
                if (response.status === 200) {
                    const normalizedData = {
                        ...response.data,
                        profile: response.data.profile
                            ? {
                                  ...response.data.profile,
                                  profileList:
                                      response.data.profile.profileList?.map(
                                          (link: ProfileLink) => ({
                                              name: link.name ?? "Unknown",
                                              link: link.link ?? "#",
                                          })
                                      ) ?? [],
                              }
                            : null,
                    };
                    setUserInfo(normalizedData);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                setUserInfo({
                    accountId: "",
                    username: "",
                    email: "",
                    createdAt: new Date().toISOString(),
                    isActive: false,
                    roles: [],
                    profile: null,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchProfileInfo();
    }, []);
    const handleProfileEdit = () => {
        router.push(`/${route}/edit`);
    };
    if (loading) {
        return (
            <div className="h-full flex items-center justify-center mt-5">
                <Card className="p-8 w-[600px] text-center">
                    Loading profile...
                </Card>
            </div>
        );
    }

    return (
        <div className="h-full flex items-center justify-center mt-5">
            <Card className="relative rounded-2xl p-8 w-[600px] overflow-visible shadow-none bg-white dark:bg-[#18181b]">
                <div className="flex items-center mb-8">
                    <Avatar
                        src={profileImage ?? ""}
                        alt="Profile"
                        radius="md"
                        className="absolute w-36 h-36 -mt-20 ml-24"
                    />
                    <div className="ml-64">
                        <h2 className="text-3xl font-semibold">
                            {userInfo?.profile?.firstName ?? ""}
                            {userInfo?.profile?.lastName ?? ""}
                        </h2>
                        <p className="text-gray-400">
                            @{userInfo?.username ?? "not provided"}
                        </p>
                    </div>
                </div>
                <p className="text-md mb-4">
                    {userInfo?.profile?.bioMarkdown ?? "No bio provided"}
                </p>
                <hr />
                <div className="space-y-2 mb-4 mt-4">
                    <p className="text-md flex gap-3">
                        <strong>Email:</strong>
                        <Link
                            href={`mailto:${userInfo?.email}`}
                            className="text-[#71717a] dark:text-white"
                        >
                            {userInfo?.email ?? "not provided"}
                        </Link>
                    </p>

                    <p className="text-md flex gap-3">
                        <strong>Institute:</strong>
                        <span className="text-[#71717a] dark:text-white">
                            {userInfo?.profile?.instituteName ?? "not provided"}
                        </span>
                    </p>

                    <p className="text-md flex gap-3">
                        <strong>Phone:</strong>
                        <span className="text-[#71717a] dark:text-white">
                            {userInfo?.profile?.phoneNumber ?? "not provided"}
                        </span>
                    </p>

                    <p className="text-md flex gap-3 items-center">
                        <strong>Links:</strong>
                        <span className="flex flex-wrap gap-3">
                            {userInfo?.profile?.profileLinks?.length ? (
                                userInfo.profile.profileLinks.map((link) => (
                                    <Link
                                        key={link.link}
                                        href={link.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-[#71717a] dark:text-white"
                                    >
                                        {link.name} <FaLink />
                                    </Link>
                                ))
                            ) : (
                                <span className="text-gray-500">
                                    not provided
                                </span>
                            )}
                        </span>
                    </p>

                    <div className="text-md flex gap-3">
                        <strong>Joined:</strong>
                        <span className="text-[#71717a] dark:text-white">
                            {userInfo?.createdAt
                                ? FormatDatewithTime(userInfo?.createdAt)
                                : "not provided"}
                        </span>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Button
                        color="primary"
                        className="font-semibold py-2 px-4 rounded-lg"
                        onPress={handleProfileEdit}
                    >
                        Update Profile
                    </Button>
                </div>
            </Card>
        </div>
    );
}
