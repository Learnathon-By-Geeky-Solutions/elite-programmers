"use client";

import api from "@/lib/api";
import { Button, Card } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormatDatewithTime } from "../DateTimeFormat";

interface User {
    username: string;
    email: string;
    password: string;
    createdAt: string;
}

export default function Component() {
    const path = usePathname();
    const [route, setRoute] = useState("");
    const router = useRouter();
    const [userSetting, setUserSettings] = useState<User | null>(null);
    const handleSettingsEdit = () => {
        router.push(`/${route}/edit/?username=${userSetting?.username}`);
    };
    useEffect(() => {
        if (path.startsWith("/settings")) setRoute("settings");
        else setRoute("mysettings");
    }, [path]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/User/Details");
                if (response.status === 200) {
                    setUserSettings(response.data);
                }
            } catch (error) {
                console.error("An error occurred:", error);
                alert("An unexpected error has occurred");
            }
        };
        fetchData();
    }, []);
    return (
        <div className="h-full flex items-center justify-center ">
            <Card
                className={`p-8 rounded-lg max-w-md w-full shadow-none bg-white dark:bg-[#18181b]`}
            >
                <h1 className="text-2xl font-semibold mb-6 text-center">
                    Account settings
                </h1>
                <hr />
                <div className="flex flex-col space-y-2">
                    <div className="mt-2 flex items-center">
                        <p className=" font-semibold">Username : </p>
                        <p className="text-sm ml-3">{userSetting?.username}</p>
                    </div>

                    <div className="flex items-center">
                        <p className=" font-semibold">Email : </p>
                        <p className="text-sm ml-3">{userSetting?.email}</p>
                    </div>
                    <div className="flex items-center">
                        <p className=" font-semibold">Password : </p>
                        <p className="text-sm ml-3">**********</p>
                    </div>
                    <div className="flex items-center">
                        <p className=" font-semibold">Joined : </p>
                        <p className="text-sm ml-3">
                            {userSetting ? FormatDatewithTime(userSetting?.createdAt) : ""}
                        </p>
                    </div>
                </div>
                <div className="mt-5 flex w-full justify-center">
                    <Button color="primary" onPress={handleSettingsEdit}>
                        Change Settings
                    </Button>
                </div>
            </Card>
        </div>
    );
}
