"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import PaginationButtons from "@/components/ui/PaginationButton";
import RootNavBar from "@/app/(root)/root-navbar";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
    convertUtcToLocalTime,
    formatTimeHourMinutes,
} from "@/components/DateTimeFormat";
import { ExamData, ExamResponse } from '@/components/types/exam'

const ITEMS_PER_PAGE = 3;

export default function ExamList() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [examsData, setExamsData] = useState<ExamResponse[]>([]);

    const totalPages = Math.max(
        Math.ceil(examsData.length / ITEMS_PER_PAGE),
        1
    );
    const paginatedExams = examsData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        const fetchExamData = async () => {
            try {
                const res = await api.get("/Candidate/Exams");
                if (res.status === 200) {
                    setExamsData(res.data);
                } else if (res.status === 401) {
                    toast.error("Unauthorized");
                    router.push("/");
                } else if (res.status === 500) {
                    toast.error("Internal Server Error");
                }
            } catch (error) {
                console.error("Error fetching exams:", error);
                toast.error("Failed to fetch exams");
            }
        };

        fetchExamData();
    }, [router]);
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Scheduled":
                return "text-green-500";
            case "Ended":
                return "text-gray-500";
            default:
                return "text-red-500";
        }
    };
    const handleAttend = (exam: ExamData) => {
        router.push(
            `/my-exams/start-exam?examId=${
                exam.examId
            }&examData=${encodeURIComponent(JSON.stringify(exam))}`
        );
    };
    return (
        <div className="h-screen flex flex-col">
            <RootNavBar />
            <div className="mx-44 flex-grow flex flex-col items-center mt-3">
                <div className="w-full">
                    <h1 className="text-center my-4 font-bold text-3xl">
                        My Exams
                    </h1>

                    {paginatedExams.length > 0 ? (
                        paginatedExams.map(({ exam, result }) => (
                            <Card
                                key={exam.examId}
                                className="relative w-full mb-3 p-2 shadow-none bg-white dark:bg-[#18181b]">
                                <CardHeader>
                                    <div className="flex w-full justify-between items-center">
                                        <h1 className="text-2xl font-bold w-full">
                                            {exam.title}
                                            <span
                                                className={`ml-2 text-sm ${getStatusColor(
                                                    exam.status)}`}>
                                                {exam.status}
                                            </span>
                                        </h1>
                                        {exam.status === "Running" &&
                                            !result?.submittedAt && (
                                                <Button
                                                    color="primary"
                                                    className="ml-96"
                                                    onPress={() =>
                                                        handleAttend(exam)}>
                                                    Attend
                                                </Button>)}
                                    </div>
                                </CardHeader>
                                <CardBody className="px-3">
                                    {exam.status === "Ended" ? (
                                        <div className="text-center">
                                            <div className="flex justify-between">
                                                <p>
                                                    <span className="text-[#71717a] dark:text-white mr-1">
                                                        Date:
                                                    </span>
                                                    {new Date(
                                                        exam.opensAt
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            weekday: "long",
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </p>
                                                <p>
                                                    <span className="text-[#71717a] dark:text-white mr-1">
                                                        Start Time:
                                                    </span>
                                                    {convertUtcToLocalTime(
                                                        exam.opensAt
                                                    )}
                                                </p>
                                                <p>
                                                    <span className="text-[#71717a] dark:text-white mr-1">
                                                        End Time:
                                                    </span>
                                                    {convertUtcToLocalTime(
                                                        exam.closesAt
                                                    )}
                                                </p>
                                                <p>
                                                    <span className="text-[#71717a] dark:text-white mr-1">
                                                      Score:
                                                    </span>
                                                    {exam.totalPoints}
                                                </p>
                                            </div>
                                            <p className="font-semibold mt-7">
                                                Your result hasn&apos;t been
                                                published. You&apos;ll be
                                                notified once it&apos;s
                                                available.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex">
                                            <div className="flex flex-col flex-1">
                                                <p>
                                                    <span className="text-[#71717a] dark:text-white mr-1">
                                                        Date:
                                                    </span>
                                                    {new Date(
                                                        exam.opensAt
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            weekday: "long",
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </p>
                                                <p>
                                                    <span className="text-[#71717a] dark:text-white mr-1">
                                                        Duration:
                                                    </span>
                                                    {formatTimeHourMinutes(
                                                        exam.durationMinutes
                                                    )}
                                                    hr
                                                </p>
                                                <p>
                                                    <span className="text-[#71717a] dark:text-white mr-1">
                                                        
                                                        Starts at:
                                                    </span>
                                                    {convertUtcToLocalTime(
                                                        exam.opensAt
                                                    )}
                                                </p>
                                                <p>
                                                    <span className="text-[#71717a] dark:text-white mr-1">
                                                        Closes at:
                                                    </span>
                                                    {convertUtcToLocalTime(
                                                        exam.closesAt
                                                    )}
                                                </p>
                                            </div>

                                            <div className="flex flex-col flex-1">
                                                <p>
                                                    <span className="text-[#71717a] dark:text-white mr-1">
                                                        Problem Solving:
                                                    </span>
                                                    {exam.problemSolvingPoints}
                                                </p>
                                                <p>
                                                    <span className="text-[#71717a] dark:text-white mr-1">
                                                        Written:
                                                    </span>
                                                    {exam.writtenPoints}
                                                </p>
                                                <p>
                                                    <span className="text-[#71717a] dark:text-white mr-1">
                                                        MCQ:
                                                    </span>
                                                    {exam.mcqPoints}
                                                </p>
                                                <p>
                                                    <span className="text-[#71717a] dark:text-white mr-1">
                                                        Score:
                                                    </span>
                                                        {exam.totalPoints}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        ))
                    ) : (
                        <div className="my-3 p-2 rounded-lg shadow-none bg-white dark:bg-[#18181b] w-full h-full flex items-center justify-center text-xl">
                            No exam found
                        </div>
                    )}
                </div>

                <div className="mt-auto py-4 my-4 flex justify-center items-center w-full">
                    <span className="mx-4">
                        Page {currentPage} of {totalPages}
                    </span>
                    <PaginationButtons
                        currentIndex={currentPage}
                        totalItems={totalPages}
                        onPrevious={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        onNext={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                            )
                        }
                    />
                </div>
            </div>
        </div>
    );
}
