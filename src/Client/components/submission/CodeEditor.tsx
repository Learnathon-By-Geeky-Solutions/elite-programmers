"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, Select, SelectItem, Spinner } from "@heroui/react";
import Editor from "@monaco-editor/react";
import api from "@/lib/api";
import { languages } from "@/lib/language-selector";
import { ProblemQuestion, TestCase } from "@/components/types/problemQues";
import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeSanitize from "rehype-sanitize";
import { Code } from "@/components/KatexMermaid";
import useTheme from '@/hooks/useTheme'

interface PageProps {
    readonly question: ProblemQuestion;
    readonly setAnswers: React.Dispatch<
        React.SetStateAction<{ [key: string]: string | string[] }>
    >;
    readonly answers: { [key: string]: string | string[] };
    readonly questionId: string;
    readonly examId: string;
    readonly persistedTestCaseResults?: TestCase[];
    readonly onTestCaseRunComplete: (
        questionId: string,
        results: TestCase[]
    ) => void;
}
interface CodeState {
    [key: string]: string;
}

export default function CodeEditor({
    question,
    setAnswers,
    questionId,
    answers,
    examId,
    persistedTestCaseResults,
    onTestCaseRunComplete,
}: PageProps) {
    const [selectedLanguage, setSelectedLanguage] = useState("cpp");
    const [codeStates, setCodeStates] = React.useState<CodeState>({});
    const [selectedTestCase, setSelectedTestCase] = useState<number>(0);
    const [formattedTestCases, setFormattedTestCases] = useState<TestCase[]>(
        []
    );
    const [displayTestCaseResults, setDisplayTestCaseResults] =
        useState<boolean>(false);
    const displayedTestCasesResults = [formattedTestCases[selectedTestCase]];
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const initialStates: CodeState = {};
        languages.forEach((lang) => {
            initialStates[lang.value] = lang.defaultCode;
        });
        const existingCode = answers[questionId] as string | undefined;
        if (existingCode) {
            setCodeStates({ [selectedLanguage]: existingCode });
        } else {
            setCodeStates(initialStates);
        }
        if (persistedTestCaseResults) {
            setFormattedTestCases(persistedTestCaseResults);
            setDisplayTestCaseResults(true);
        } else {
            const initializedTestCases = question.testCases.map((tc) => ({
                ...tc,
                receivedOutput: "",
                output: tc.output || "Error",
                status: "pending" as const,
                executionTime: 0,
                errorMessage: "",
            }));
            setFormattedTestCases(initializedTestCases);
        }
    }, [
        question.testCases,
        questionId,
        answers,
        persistedTestCaseResults,
        selectedLanguage,
    ]);

    const handleCodeChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCodeStates((prev) => ({
                ...prev,
                [selectedLanguage]: value,
            }));
            setAnswers((prev) => ({
                ...prev,
                [questionId]: value,
            }));
        }
    };
    const handleLanguageChange = (newLanguage: string) => {
        setSelectedLanguage(newLanguage);
    };
    const handleRun = async () => {
        setLoading(true);
        const currentCode = codeStates[selectedLanguage];
        const savePayload = {
            examId: examId,
            questionId: question.questionId,
            code: currentCode,
            language: selectedLanguage,
        };
        try {
            const saveResponse = await api.put(
                "/Candidate/Submit/Problem/Save",
                savePayload
            );
            if (saveResponse.status === 200) {
                const responseData: {
                    testCaseId: string;
                    isAccepted: boolean;
                    receivedOutput: string;
                    errorMessage: string;
                    exception: string;
                    executionTime: number;
                }[] = await saveResponse.data;

                const updatedTestCases = formattedTestCases.map((tc) => {
                    const matchingResult = responseData.find(
                        (res) => res.testCaseId === tc.testCaseId
                    );
                    return {
                        ...tc,
                        receivedOutput: matchingResult?.receivedOutput,
                        exception: matchingResult?.exception,
                        executionTime: matchingResult?.executionTime ?? 0,
                        isAccepted: matchingResult?.isAccepted ?? false,
                    } as TestCase;
                });
                setFormattedTestCases(updatedTestCases);
                setDisplayTestCaseResults(true);
                onTestCaseRunComplete(questionId, updatedTestCases);
            } else {
                console.error("Failed to save code");
            }
        } catch (saveError) {
            console.error("Error during code save:", saveError);
        } finally {
            setLoading(false);
        }
    };
    const Mode=useTheme();
    return (
        <div>
            <div
                className="grid grid-cols-2 gap-4"
                style={{ height: "650px" }} >
                <Card className="border-none rounded-lg p-4 shadow-none bg-white dark:bg-[#18181b]">
                    <div className="space-y-4 overflow-auto p-6 bg-white dark:bg-[#18181b] rounded-lg">
                        <MarkdownPreview
                            source={question.statementMarkdown}
                            rehypePlugins={[rehypeSanitize]}
                            components={{ code: Code }}
                            style={{
                                backgroundColor: Mode==="dark" ? '#18181b' : 'white',
                                color:Mode==="dark" ? 'white' : 'black'
                              }}
                        />
                    </div>
                </Card>
                <div>
                    <Card className="px-3 rounded-lg mb-3">
                        <div className="flex justify-between pt-2">
                            <p className="font-semibold">Code Editor</p>
                            <div className="flex gap-2">
                                {loading ? (
                                    <Button>
                                        <Spinner />
                                    </Button>
                                ) : (
                                    <Button onPress={handleRun}>Run</Button>
                                )}
                                <Select
                                    aria-label="Select Language"
                                    selectedKeys={[selectedLanguage]}
                                    onChange={(e) =>
                                        handleLanguageChange(e.target.value)
                                    }
                                    className="w-40"
                                >
                                    {languages.map((lang) => (
                                        <SelectItem key={lang.value}>
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="m-3 rounded-lg overflow-auto">
                            <Editor 
                                height="450px"
                                defaultLanguage={selectedLanguage}
                                language={selectedLanguage}
                                value={codeStates[selectedLanguage]}
                                theme='vs-dark'
                                onChange={handleCodeChange}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: "on",
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                }}
                            />
                        </div>
                    </Card>
                    {displayTestCaseResults && (
                        <Card className="p-4 rounded-lg">
                            <div className="flex justify-between">
                                <p className="font-bold">Test Cases</p>
                                <div className="flex gap-2">
                                    {formattedTestCases.map((tc, index) => {
                                        const getStatusColor = () => {
                                            if (tc.isAccepted)
                                                return "bg-green-500";
                                            else if (tc.isAccepted === false)
                                                return "bg-red-500";
                                            return "bg-gray-500";
                                        };
                                        const isSelected =
                                            selectedTestCase === index
                                                ? "ring-2 ring-blue-500"
                                                : "";
                                        return (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    setSelectedTestCase(index)
                                                }
                                                className={`w-8 h-8 rounded-lg text-white flex items-center justify-center ${getStatusColor()} ${isSelected}`}
                                            >
                                                {index + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            {displayedTestCasesResults?.map(
                                (testCase, index) => (
                                    <div key={index} className="space-y-4">
                                        <div className="w-full flex flex-col gap-2 mb-4">
                                            {testCase.exception && (
                                                <p className="text-red-500 text-sm">
                                                    {testCase.exception}
                                                </p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 mt-3">
                                            <div>
                                                <p className="font-semibold mb-2">
                                                    Input
                                                </p>
                                                <div className="font-mono p-2 bg-[#f4f4f5] dark:bg-[#27272a] rounded-lg whitespace-pre-wrap h-[250px] overflow-auto">
                                                    {testCase.input ||
                                                        "No input provided"}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold mb-2">
                                                    Output
                                                    {testCase.executionTime !==
                                                        null && (
                                                        <span className="text-blue-500 text-sm">
                                                            (
                                                            {
                                                                testCase.executionTime
                                                            }
                                                            ms)
                                                        </span>
                                                    )}
                                                </p>
                                                <div
                                                    className={`font-mono p-2 rounded-lg whitespace-pre-wrap h-[250px] bg-[#f4f4f5] dark:bg-[#27272a] overflow-auto
                                                        ${
                                                            testCase.isAccepted
                                                                ? "bg-green-100 dark:bg-green-900"
                                                                : testCase.isAccepted ===
                                                                  false
                                                                ? "bg-red-100 dark:bg-red-900"
                                                                : ""
                                                        }`}
                                                >
                                                    {testCase.receivedOutput}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold mb-2">
                                                    Expected Output
                                                </p>
                                                <div className="font-mono p-2 bg-[#f4f4f5] dark:bg-[#27272a] rounded-lg whitespace-pre-wrap h-[250px] overflow-auto">
                                                    {testCase.output ||
                                                        "No expected output"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
