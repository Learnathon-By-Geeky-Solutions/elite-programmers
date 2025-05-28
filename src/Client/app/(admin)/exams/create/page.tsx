"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, Input, Textarea, TimeInput } from "@heroui/react";
import { CalendarDate, Time } from "@internationalized/date";
import { DatePicker } from "@heroui/date-picker";
import ProblemSolve from "@/components/ques/ProblemSolveQues";
import WrittenQues from "@/components/ques/WrittenQues";
import McqQues from "@/components/ques/McqQues";
import "@/app/globals.css";
import { v4 as uuidv4 } from "uuid";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { convertUtcToLocalTime, parseTime } from "@/components/DateTimeFormat";
import { AIGenerateButton } from "@/components/ui/AiButton";

interface FormData {
    title: string;
    description: string;
    durationMinutes: number;
    totalPoints: number;
    opensAt: string;
    closesAt: string;
}
export default function ExamFormPage() {
    const [date, setDate] = useState<CalendarDate | null>(null);
    const [problemQuesPoint, setProblemQuesPoint] = useState<number>(0);
    const [writtenQuesPoint, setWrittenQuesPoint] = useState<number>(0);
    const [mcqQuesPoint, setMcqQuesPoint] = useState<number>(0);
    const [totalPoints, setTotalPoints] = useState<number>(0);
    const [activeComponents, setActiveComponents] = useState<
        { id: string; type: string }[]
    >([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = React.useState<
        string | null
    >(null);
    const [publishBtn, setPublishbtn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const route = useRouter();
    const [examId, setExamId] = useState(searchParams.get("id") || "");
    const isEdit = searchParams.get("isEdit") === "true";
    const [published, setPublished] = useState<boolean>();
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        durationMinutes: 0,
        totalPoints: 0,
        opensAt: "",
        closesAt: "",
    });
    const [questionData, setQuestionData] = useState({
        problemSolve: [],
        writtenQues: [],
        mcq: [],
    });
    const [isTotalPointsFocused, setIsTotalPointsFocused] = useState(false);

    const calculatedTotal = problemQuesPoint + writtenQuesPoint + mcqQuesPoint;
    const handleGenerate = () => {
        const FetchData = async () => {
            setGeneratedContent(null);
            setIsGenerating(true);
            try {
                const response = await api.post(
                    "/Ai/Generate/ExamDescription",
                    {
                        title: formData.title,
                        userPrompt: formData.description,
                    }
                );
                if (response.status === 200) {
                    setFormData({
                        ...formData,
                        description: response.data.description,
                    });
                }
            } catch {
            } finally {
                setIsGenerating(false);
            }
        };
        FetchData();
    };
    const handleAddComponent = (componentType: string) => {
        setActiveComponents([
            ...activeComponents,
            { id: uuidv4(), type: componentType },
        ]);
    };
    const handleSaveExam = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        if (!date) {
            toast.error("Please select a date");
            setIsLoading(false);
            return;
        }
        try {
            const formatDateTimeToUTC = (
                timeString: string | undefined,
                selectedDate: CalendarDate | null
            ): string => {
                if (!timeString || !selectedDate) return "";
                const [timePart] = timeString.split(' ');
                const [hoursStr, minutesStr] = timePart.split(":");
                const hours = parseInt(hoursStr, 10);
                const minutes = parseInt(minutesStr, 10);
                const localDate = new Date(
                    selectedDate.year,
                    selectedDate.month - 1,
                    selectedDate.day,
                    hours,
                    minutes
                );
                return localDate.toISOString();
            };
            const examData = {
                title: formData.title,
                description: formData.description,
                durationMinutes: formData.durationMinutes,
                totalPoints: formData.totalPoints,
                opensAt: formatDateTimeToUTC(formData.opensAt, date),
                closesAt: formatDateTimeToUTC(formData.closesAt, date),
                date: new Date(
                    date.year,
                    date.month - 1,
                    date.day
                ).toISOString(),
            };
            setTotalPoints(examData.totalPoints);
            const now = new Date().toISOString();
            if (examData.opensAt <= now) {
                toast.error("Exam's start time must be in the future");
                setIsLoading(false);
                return;
            }
            if (examData.opensAt >= examData.closesAt) {
                toast.error("Close time must be after start time");
                setIsLoading(false);
                return;
            }
            let resp;
            if (examId) {
                const payload = {
                    examId: examId,
                    title: formData.title,
                    description: formData.description,
                    durationMinutes: formData.durationMinutes,
                    totalPoints: formData.totalPoints,
                    opensAt: formatDateTimeToUTC(formData.opensAt, date),
                    closesAt: formatDateTimeToUTC(formData.closesAt, date),
                };
                resp = await api.patch(`/Exam/Update`, payload);
                if (resp.status === 200) {
                    toast.success(`Exam updated successfully.`);
                    setPublished(resp.data.isPublished);
                    route.push("/view-exams");
                }else if(resp.status === 409){
                    toast.error(resp.data.detail||"Exam is already published");
                    route.push("/view-exams");
                }
            } else {
                resp = await api.post("/Exam/Create", examData);
                if (resp.status === 200) {
                    toast.success(`Exam created successfully.`);
                    setExamId(resp.data.examId);
                    setPublished(resp.data.isPublished);
                }
            }
            setPublishbtn(true);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const { data } = error.response;
            toast.error(
                data.message || "An unexpected error occurred.Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const fetchExamDetails = async () => {
            try {
                if (!isEdit) {
                    return;
                }
                if (!examId) {
                    route.push("/view-exams");
                    return;
                }
                const [
                    examResponse,
                    problemQuesResponse,
                    writtenQuesResponse,
                    mcqQuesResponse,
                ] = await Promise.all([
                    api.get(`/Exam/${examId}`),
                    api.get(`/Questions/Problem/ByExam/${examId}`),
                    api.get(`/Questions/Written/ByExam/${examId}`),
                    api.get(`/Questions/Mcq/ByExam/${examId}`),
                ]);
                if (examResponse.status === 200) {
                    const exam = examResponse.data.exam;
                    setFormData({
                        title: exam.title,
                        description: exam.description,
                        durationMinutes: exam.durationMinutes,
                        totalPoints: exam.totalPoints,
                        opensAt: convertUtcToLocalTime(exam.opensAt),
                        closesAt: convertUtcToLocalTime(exam.closesAt),
                    });
                    const opensAtDate = new Date(exam.opensAt);
                    setDate(
                        new CalendarDate(
                            opensAtDate.getFullYear(),
                            opensAtDate.getMonth() + 1,
                            opensAtDate.getDate()
                        )
                    );
                }
                setQuestionData({
                    problemSolve: problemQuesResponse.data ?? [],
                    writtenQues: writtenQuesResponse.data ?? [],
                    mcq: mcqQuesResponse.data ?? [],
                });
                const components: { id: string; type: string }[] = [];
                if (problemQuesResponse.data?.length) {
                    components.push({ id: uuidv4(), type: "problemSolve" });
                }
                if (writtenQuesResponse.data?.length) {
                    components.push({ id: uuidv4(), type: "writtenQues" });
                }
                if (mcqQuesResponse.data?.length) {
                    components.push({ id: uuidv4(), type: "mcq" });
                }
                setActiveComponents(components);
            } catch {
                toast.error(
                    "Failed to load exam data.Please check your network connection and try again."
                );
                route.push("/view-exams");
            }
        };

        fetchExamDetails();
    }, [examId, isEdit, route, totalPoints]);
    const toastIdRef = useRef<string | null>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const showToastDebounced = useCallback(
        (
            calculatedTotal: number,
            problemQuesPoint: number,
            writtenQuesPoint: number,
            mcqQuesPoint: number,
            formTotal: number
        ) => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);

            debounceTimer.current = setTimeout(() => {
                const message = `Current Points
                                • Problem: ${problemQuesPoint}
                                • Written: ${writtenQuesPoint}
                                • MCQ: ${mcqQuesPoint}
                                • Total: ${calculatedTotal} / ${formTotal}`;

                if (toastIdRef.current) {
                    toast(message, {
                        id: toastIdRef.current,
                        position: "bottom-right",
                        className:
                            "bg-white dark:bg-[#18181b] text-black dark:text-white",
                        style: { whiteSpace: "pre-line" },
                    });
                } else {
                    toastIdRef.current = toast(message, {
                        position: "bottom-right",
                        className:
                            "bg-white dark:bg-[#18181b] text-black dark:text-white",
                        style: { whiteSpace: "pre-line" },
                    });
                }
            }, 400);
        },
        []
    );

    useEffect(() => {
        const calculatedTotal =
            problemQuesPoint + writtenQuesPoint + mcqQuesPoint;
        if (isTotalPointsFocused) {
            showToastDebounced(
                calculatedTotal,
                problemQuesPoint,
                writtenQuesPoint,
                mcqQuesPoint,
                formData.totalPoints
            );
        } else if (toastIdRef.current) {
            toast.dismiss(toastIdRef.current);
            toastIdRef.current = null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        formData.totalPoints,
        problemQuesPoint,
        writtenQuesPoint,
        mcqQuesPoint,
        isTotalPointsFocused,
    ]);

    const handlePublishExam = async () => {
        if (examId && !published) {
            try {
                const response = await api.post(
                    `/Exam/Publish?examId=${examId}`
                );
                if (response.status === 200) {
                    toast.success("Exam published successfully.");
                    route.push("/view-exams");
                    resetForm();
                }
            } catch {
                toast.error(
                    `Failed to publish exam.Please make sure total points (${formData.totalPoints}) match sum of all questions (${calculatedTotal})`
                );
            }
        } else {
            toast.error("Exam is already published.");
        }
    };
    const handleProblemPointsChange = (points: number) => {
        setProblemQuesPoint(points);
    };
    const handleWrittenPointsChange = (points: number) => {
        setWrittenQuesPoint(points);
    };
    const handleMcqPointsChange = (points: number) => {
        setMcqQuesPoint(points);
    };
    const handleTotalPointsChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            setFormData({
                ...formData,
                totalPoints: value,
            });
        }
    };
    const handleDeleteExam = async () => {
        if (examId) {
            const response = await api.delete(`/Exam/Delete/${examId}`);
            if (response.status === 200) {
                toast.success("Exam deleted successfully.");
                route.push("/view-exams");
            } else {
                toast.error("Failed to delete exam.");
            }
        }
    };
    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            durationMinutes: 0,
            totalPoints: 0,
            opensAt: "",
            closesAt: "",
        });
        setDate(null);
        setActiveComponents([]);
        setQuestionData({
            problemSolve: [],
            writtenQues: [],
            mcq: [],
        });
    };
  const handleOpenCloseTime = (time: Time | null): string => {
    if (!time) return "";
    const hours = time.hour;
    const minutes = time.minute;
    const period = hours >= 12 ? 'PM' : 'AM';
    const twelveHour = hours % 12 || 12; 
    return `${twelveHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
};
    return (
        <>
            <div className="mx-44 flex flex-col gap-8">
                <h1 className="w-full text-center text-3xl font-bold my-3">
                    {isEdit ? "Edit Exam" : "Create Exam"}
                </h1>
                <Card className="flex shadow-none flex-col justify-between p-8 items-center">
                    <form
                        className="flex gap-4 flex-wrap flex-col w-full"
                        onSubmit={handleSaveExam}
                    >
                        <Input
                            className="rounded-2xl"
                            isRequired
                            label="Title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                        />
                        <div className="relative">
                            <div>
                                <Textarea
                                    className="rounded-2xl"
                                    isRequired
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="absolute bottom-2 right-2">
                                <AIGenerateButton
                                    isGenerating={isGenerating}
                                    onGenerate={handleGenerate}
                                />
                                {generatedContent && (
                                    <div className="p-4 mt-6 border rounded-lg bg-content2 border-default-200">
                                        <p className="text-foreground">
                                            {generatedContent}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-5">
                            <DatePicker
                                className="flex-1 rounded-2xl"
                                isRequired
                                label="Exam Date"
                                value={date}
                                onChange={setDate}
                            />
                            <Input
                                className="flex-1 rounded-2xl"
                                isRequired
                                label="Duration (minutes)"
                                type="number"
                                min="1"
                                value={formData.durationMinutes.toString()}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (!isNaN(value)) {
                                        setFormData({
                                            ...formData,
                                            durationMinutes: value,
                                        });
                                    }
                                }}
                            />
                        </div>
                        <div className="flex gap-5">
                            <TimeInput
                                label="Start Time"
                                className="rounded-2xl"
                                value={parseTime(formData.opensAt)}
                                isRequired
                                onChange={(time) =>
                                    setFormData({
                                        ...formData,
                                        opensAt: handleOpenCloseTime(time),
                                    })
                                }
                                hourCycle={12}
                            />
                            <TimeInput
                                label="End Time"
                                className="rounded-2xl"
                                value={parseTime(formData.closesAt)}
                                isRequired
                                onChange={(time) =>
                                    setFormData({
                                        ...formData,
                                        closesAt: handleOpenCloseTime(time),
                                    })
                                }
                                hourCycle={12}
                            />
                        </div>
                        <div className="flex items-end justify-between">
                            <div className="w-1/4">
                                <Input
                                    className="rounded-2xl"
                                    isRequired
                                    label="Total Points"
                                    type="number"
                                    min="1"
                                    value={formData.totalPoints.toString()}
                                    onFocus={() =>
                                        setIsTotalPointsFocused(true)
                                    }
                                    onBlur={() => {
                                        setIsTotalPointsFocused(false);
                                        if (toastIdRef.current) {
                                            toast.dismiss(toastIdRef.current);
                                            toastIdRef.current = null;
                                        }
                                    }}
                                    onChange={handleTotalPointsChange}
                                />
                            </div>
                            <div className="flex gap-3">
                                {publishBtn && (
                                    <Button
                                        color="success"
                                        onPress={handlePublishExam}
                                    >
                                        Publish
                                    </Button>
                                )}
                                {examId && (
                                    <Button
                                        color="danger"
                                        onPress={handleDeleteExam}
                                    >
                                        Delete
                                    </Button>
                                )}
                                {!publishBtn &&
                                    (isLoading ? (
                                        <Button color="primary" type="submit">
                                            {isEdit
                                                ? "Updating..."
                                                : "Saving..."}
                                        </Button>
                                    ) : (
                                        <Button color="primary" type="submit">
                                            {isEdit ? "Update" : "Save"}
                                        </Button>
                                    ))}
                            </div>
                        </div>
                    </form>
                </Card>
                {activeComponents.map((component) => (
                    <div key={component.id} className="w-full">
                        {component.type === "problemSolve" && (
                            <ProblemSolve
                                examId={examId}
                                existingQuestions={questionData.problemSolve}
                                problemPoints={handleProblemPointsChange}
                                onFocus={() => setIsTotalPointsFocused(true)}
                                onBlur={() => {
                                    setIsTotalPointsFocused(false);
                                    if (toastIdRef.current) {
                                        toast.dismiss(toastIdRef.current);
                                        toastIdRef.current = null;
                                    }
                                }}
                            />
                        )}
                        {component.type === "writtenQues" && (
                            <WrittenQues
                                examId={examId}
                                existingQuestions={questionData.writtenQues}
                                writtenPoints={handleWrittenPointsChange}
                                onFocus={() => setIsTotalPointsFocused(true)}
                                onBlur={() => {
                                    setIsTotalPointsFocused(false);
                                    if (toastIdRef.current) {
                                        toast.dismiss(toastIdRef.current);
                                        toastIdRef.current = null;
                                    }
                                }}
                            />
                        )}
                        {component.type === "mcq" && (
                            <McqQues
                                examId={examId}
                                existingQuestions={questionData.mcq}
                                mcqPoints={handleMcqPointsChange}
                                onFocus={() => setIsTotalPointsFocused(true)}
                                onBlur={() => {
                                    setIsTotalPointsFocused(false);
                                    if (toastIdRef.current) {
                                        toast.dismiss(toastIdRef.current);
                                        toastIdRef.current = null;
                                    }
                                }}
                            />
                        )}
                    </div>
                ))}
                {examId && (
                    <div className="flex gap-3 justify-center my-4">
                        {!activeComponents.some(
                            (c) => c.type === "problemSolve"
                        ) && (
                            <Button
                                onPress={() =>
                                    handleAddComponent("problemSolve")
                                }
                            >
                                Add Problem Solving Question
                            </Button>
                        )}
                        {!activeComponents.some(
                            (c) => c.type === "writtenQues"
                        ) && (
                            <Button
                                onPress={() =>
                                    handleAddComponent("writtenQues")
                                }
                            >
                                Add Written Question
                            </Button>
                        )}
                        {!activeComponents.some((c) => c.type === "mcq") && (
                            <Button onPress={() => handleAddComponent("mcq")}>
                                Add MCQ Question
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
