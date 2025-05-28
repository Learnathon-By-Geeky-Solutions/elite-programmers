"use client";

import { Card, CardBody, Checkbox, Button } from "@heroui/react";
import { useState } from "react";
import RootNavBar from "@/app/(root)/root-navbar";
import {
    convertUtcToLocalTime,
    FormattedDateWeekday,
    formatTimeHourMinutes,
} from "@/components/DateTimeFormat";
import { useRouter, useSearchParams } from "next/navigation";
import { ExamData } from "@/components/types/exam";
import toast from "react-hot-toast";

export default function StartExam() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const examDataString = searchParams.get("examData");
    const currentExam: ExamData | undefined = examDataString
        ? JSON.parse(examDataString)
        : undefined;

    const [agreedToTerms, setAgreedToTerms] = useState({
        capture: false,
        screenMonitor: false,
        audio: false,
        clipboard: false,
    });

    if (!currentExam?.closesAt) return null;

    const handleStartExam = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            toast.success("Camera and microphone permissions granted!");

            await navigator.mediaDevices.getDisplayMedia({ video: true });
            toast.success("Screen sharing permissions granted!");

            if (navigator.clipboard && navigator.permissions) {
                const clipboardPermission = await navigator.permissions.query({
                    name: "clipboard-read" as PermissionName,
                });
                if (
                    clipboardPermission.state !== "granted" &&
                    clipboardPermission.state !== "prompt"
                ) {
                    throw new Error("Clipboard permission not granted");
                }
                toast.success("Clipboard permissions granted!");
            }
            if (currentExam?.examId) {
                router.push(`/my-exams/${currentExam.examId}`);
            }
        } catch (error) {
            toast.error(
                "Permissions are required to proceed with the exam. Please ensure that you allow access to your camera, microphone, screen, and clipboard."
            );
            console.error("Error requesting permissions:", error);
        }
    };

    const now = new Date();
    const closesAt = new Date(currentExam.closesAt);
    const nowUTC = new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
    );
    const timeLeftInMs = closesAt.getTime() - nowUTC.getTime();
    const isClosed = timeLeftInMs <= 0;
    const absTimeLeft = Math.abs(timeLeftInMs);
    const minutesLeft = isClosed
        ? 0
        : Math.floor((absTimeLeft / (1000 * 60)) % 60);
    const hoursLeft = isClosed ? 0 : Math.floor(absTimeLeft / (1000 * 60 * 60));

    return (
        <div>
            <RootNavBar />
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Card className="max-w-3xl w-full mx-auto shadow-md rounded-lg overflow-hidden bg-white dark:bg-[#18181b]">
                    <CardBody className="p-6">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {currentExam?.title}
                                    <span
                                        className={`ml-2 text-sm font-normal text-red-500`}
                                    >
                                        {currentExam?.status}
                                    </span>
                                </h1>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <p className="min-w-[100px] text-gray-700 dark:text-gray-300">
                                        {isClosed
                                            ? "Exam Closed"
                                            : `${hoursLeft}h ${minutesLeft}m left`}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Date:{" "}
                                    </span>
                                    <FormattedDateWeekday
                                        date={currentExam?.closesAt}
                                    />
                                </div>
                                <div className="text-right">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Problem Solving:{" "}
                                    </span>
                                    {currentExam?.problemSolvingPoints}
                                </div>
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Starts {" "}
                                    </span>
                                    {currentExam?.opensAt &&
                                        convertUtcToLocalTime(
                                            currentExam.opensAt
                                        )}
                                </div>
                                <div className="text-right">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Written:{" "}
                                    </span>
                                    {currentExam?.writtenPoints}
                                </div>
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Closes at:{" "}
                                    </span>
                                    {currentExam?.closesAt &&
                                        convertUtcToLocalTime(
                                            currentExam.closesAt
                                        )}
                                </div>
                                <div className="text-right">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        MCQ:{" "}
                                    </span>
                                    {currentExam?.mcqPoints}
                                </div>
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Duration:{" "}
                                    </span>
                                    {formatTimeHourMinutes(
                                        currentExam?.durationMinutes
                                    )}
                                    hr
                                </div>
                                <div className="text-right">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Score:{" "}
                                    </span>
                                    {currentExam?.totalPoints}
                                </div>
                            </div>
                            <hr className="my-4 border-gray-300 dark:border-gray-700" />
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Instructions
                                </h2>
                                <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                                    <li>
                                        Please ensure your webcam and microphone
                                        are enabled throughout the exam.
                                    </li>
                                    <li>
                                        There should be no one else visible in
                                        the webcam area during the exam.
                                    </li>
                                    <li>
                                        A stable internet connection is
                                        required. If you are disconnected for
                                        more than 2 minutes, your answers will
                                        be automatically submitted.
                                    </li>
                                    <li>
                                        Your face must be clearly visible in the
                                        webcam at all times, and your eyes
                                        should remain on the screen. Please do
                                        not look away from the screen.
                                    </li>
                                    <li>
                                        The exam will automatically switch you
                                        to full-screen mode. Please do not try
                                        to change it.
                                    </li>
                                    <li>
                                        Do not attempt to copy or paste anything
                                        during the exam. It will be detected and
                                        flagged.
                                    </li>
                                </ol>
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    Please read and agree to the following terms
                                    to proceed with the exam:
                                </h3>
                                <div className="text-sm">
                                    <Checkbox
                                        className="mb-1"
                                        isSelected={agreedToTerms.capture}
                                        onValueChange={(value) =>
                                            setAgreedToTerms((prev) => ({
                                                ...prev,
                                                capture: value,
                                            }))
                                        }
                                    >
                                        I agree that images will be captured of
                                        me every 5 seconds.
                                    </Checkbox>
                                    <Checkbox
                                        className="mb-1"
                                        isSelected={agreedToTerms.screenMonitor}
                                        onValueChange={(value) =>
                                            setAgreedToTerms((prev) => ({
                                                ...prev,
                                                screenMonitor: value,
                                            }))
                                        }
                                    >
                                        I agree that my screen will be monitored
                                        during the exam.
                                    </Checkbox>
                                    <Checkbox
                                        className="mb-1"
                                        isSelected={agreedToTerms.audio}
                                        onValueChange={(value) =>
                                            setAgreedToTerms((prev) => ({
                                                ...prev,
                                                audio: value,
                                            }))
                                        }
                                    >
                                        I agree that my audio will be recorded
                                        throughout the exam.
                                    </Checkbox>
                                    <Checkbox
                                        className="mb-1"
                                        isSelected={agreedToTerms.clipboard}
                                        onValueChange={(value) =>
                                            setAgreedToTerms((prev) => ({
                                                ...prev,
                                                clipboard: value,
                                            }))
                                        }
                                    >
                                        I agree that my clipboard activity will
                                        be tracked.
                                    </Checkbox>
                                </div>
                            </div>
                            <div className="w-full text-center">
                                <Button
                                    color="primary"
                                    isDisabled={
                                        !Object.values(agreedToTerms).every(
                                            Boolean
                                        )
                                    }
                                    onPress={handleStartExam}
                                >
                                    Start Exam
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
