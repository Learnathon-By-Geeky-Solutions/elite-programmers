"use client";

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    SelectItem,
    Textarea,
    Select,
    Spinner,
} from "@heroui/react";
import SearchIcon from "@/components/ui/SearchIcon";
import CommonModal from "@/components/ui/Modal/EditDeleteModal";
import PaginationButtons from "@/components/ui/PaginationButton";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useEmailParser } from "@/hooks/useEmailParser";
import isValidEmail from "@/components/EmailValidation";

interface Exam {
    examId: string;
    title: string;
}
interface User {
    email: string;
}
const columns = [
    { label: "Email", key: "email" },
    { label: "Action", key: "action" },
];
const ROWS_PER_PAGE = 10;
export default function Component() {
    const [filterValue, setFilterValue] = useState("");
    const [page, setPage] = useState(1);
    const [fileContent, setFileContent] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [exams, setExams] = useState<Exam[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState<User | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [editedEmail, setEditedEmail] = useState("");
    const [editingEmail, setEditingEmail] = useState<string | null>(null);
    const [examId, setExamId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { userEmails, parseEmailContent, setUserEmails } = useEmailParser();

    useEffect(() => {
        const fetchExams = async () => {
            try {
                setIsLoading(true);
                const response = await api.get("/Exam");
                if (response.status === 200) {
                    setExams(response.data);
                }
            } catch {
            } finally {
                setIsLoading(false);
            }
        };
        fetchExams();
    }, []);
    const handleAddToList = () => {
        if (!fileContent) {
            toast.error("Please enter emails or upload a file");
            return;
        }
        parseEmailContent(fileContent);
    };
    const filteredItems = useMemo(() => {
        if (!filterValue) return userEmails;
        return userEmails.filter((user) =>
            user.email.toLowerCase().includes(filterValue.toLowerCase())
        );
    }, [filterValue, userEmails]);

    const totalPages = Math.ceil(filteredItems.length / ROWS_PER_PAGE) ?? 1;
    const paginatedItems = useMemo(() => {
        const start = (page - 1) * ROWS_PER_PAGE;
        const end = start + ROWS_PER_PAGE;
        return filteredItems.slice(start, end);
    }, [page, filteredItems]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setFileContent(content);
            };
            reader.readAsText(file);
        }
    };

    const handleSendInvites = async () => {
        if (!examId) {
            toast.error("Please select an exam");
            return;
        }
        if (userEmails.length === 0) {
            toast.error("No candidates to invite");
            return;
        }
        try {
            setIsLoading(true);
            const response = await api.post("/Exam/Invite/Candidates", {
                examId,
                emails: userEmails.map((u) => u.email),
            });

            if (response.status === 200) {
                toast.success("Invitations sent successfully!");
                setUserEmails([]);
                setFileContent("");
            }
        } catch {
            toast.error("Failed to send invitations.Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditEmail = useCallback(() => {
        if (!selectedEmail || !editedEmail) return;
        if (!isValidEmail(editedEmail)) {
            toast.error("Please enter a valid email address");
            return;
        }
        if (
            userEmails.some(
                (user) =>
                    user.email === editedEmail &&
                    user.email !== selectedEmail.email
            )
        ) {
            toast.error("This email already exists in the list");
            return;
        }
        setUserEmails((prev) =>
            prev.map((user) =>
                user.email === selectedEmail.email
                    ? { ...user, email: editedEmail }
                    : user
            )
        );
        toast.success("Email updated successfully");
    }, [editedEmail, selectedEmail, setUserEmails, userEmails]);

    const renderCell = useCallback(
        (user: User, columnKey: string) => {
            if (columnKey === "email") {
                if (editingEmail === user.email) {
                    return (
                        <input
                            type="text"
                            className="border rounded px-2 py-1 w-full"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                            onBlur={() => {
                                handleEditEmail();
                                setEditingEmail(null);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleEditEmail();
                                    setEditingEmail(null);
                                }
                            }}
                            autoFocus
                        />
                    );
                }
                return user.email;
            }

            if (columnKey === "action") {
                return (
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => {
                                setSelectedEmail(user);
                                setEditedEmail(user.email);
                                setEditingEmail(user.email);
                            }}
                        >
                            <FaEdit className="text-xl" />
                        </button>
                        <button
                            onClick={() => {
                                setSelectedEmail(user);
                                setIsDeleteModalOpen(true);
                            }}
                        >
                            <MdDelete className="text-xl" />
                        </button>
                    </div>
                );
            }

            return (
                <div className="flex items-center gap-2">
                    <span>{user.email}</span>
                </div>
            );
        },
        [editingEmail, editedEmail, handleEditEmail]
    );

    const handleDeleteEmail = () => {
        if (!selectedEmail) return;
        setUserEmails((prev) =>
            prev.filter((u) => u.email !== selectedEmail.email)
        );
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="h-full flex flex-col justify-between">
            <h2 className="text-2xl font-bold my-5 text-center">
                Invite Candidates
            </h2>

            <div className="h-full px-8 flex flex-col rounded-xl justify-between mx-44 my-8 bg-white dark:bg-[#18181b]">
                <div>
                    <div className="w-full flex items-center justify-center mt-8">
                        <p className="mr-4 ">Exam</p>
                        <Select
                            label="Select an exam"
                            className="max-w-md bg-[#eeeef0] dark:bg-[#27272a] rounded-2xl"
                            selectedKeys={examId ? [examId] : []}
                            onChange={(e) => setExamId(e.target.value)}
                            isLoading={isLoading}
                        >
                            {exams.map((exam) => (
                                <SelectItem key={exam.examId}>
                                    {exam.title}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                    <div className="my-6">
                        <h1 className="ml-6 my-2">Candidate Email Import</h1>
                        <div className="flex gap-2 px-5 mb-8">
                            <Textarea
                                value={fileContent}
                                onChange={(e) => setFileContent(e.target.value)}
                                placeholder="Insert emails (separated by commas or line breaks)."
                                rows={5}
                                onPaste={(e) => {
                                    e.preventDefault();
                                    const pastedText =
                                        e.clipboardData.getData("text");
                                    if (textareaRef.current) {
                                        textareaRef.current.value = pastedText;
                                        setFileContent(pastedText);
                                    }
                                }}
                                ref={textareaRef}
                            />
                            <div className="flex flex-col gap-2">
                                <input
                                    type="file"
                                    accept=".csv,.txt,.xlsx"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    style={{ display: "none" }}
                                />
                                <Button
                                    onPress={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    Upload CSV
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={handleAddToList}
                                    isDisabled={!fileContent}
                                >
                                    Add to list
                                </Button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="my-4 flex justify-between items-center">
                                <h2 className="ml-5">Candidates List</h2>
                                <Input
                                    isClearable
                                    className="w-[400px] mr-3"
                                    placeholder="Search emails"
                                    startContent={<SearchIcon />}
                                    value={filterValue}
                                    onValueChange={(value) => {
                                        setFilterValue(value);
                                        setPage(1);
                                    }}
                                />
                            </div>

                            <Table
                                aria-label="Example table without border and shadow"
                                selectionMode="multiple"
                                removeWrapper
                                classNames={{
                                    base: "max-h-[400px]",
                                    table: "min-w-full",
                                    th: "bg-transparent",
                                    td: "border-b border-divider",
                                }}
                            >
                                <TableHeader>
                                    {columns.map((column) => (
                                        <TableColumn
                                            key={column.key}
                                            align="center"
                                        >
                                            {column.label}
                                        </TableColumn>
                                    ))}
                                </TableHeader>
                                <TableBody
                                    emptyContent={
                                        isLoading
                                            ? "Loading..."
                                            : "No candidates found"
                                    }
                                    loadingContent={<Spinner />}
                                    loadingState={
                                        isLoading ? "loading" : "idle"
                                    }
                                >
                                    {paginatedItems.map((item) => (
                                        <TableRow key={item.email}>
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={`${item.email}-${column.key}`}
                                                >
                                                    {renderCell(
                                                        item,
                                                        column.key
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
                <div className="p-2 m-2 flex justify-between items-center">
                    <div></div>

                    <div className="flex items-center gap-4">
                        <span className="text-small">
                            Page {page} of {Math.max(totalPages, 1)}
                        </span>

                        <PaginationButtons
                            currentIndex={page}
                            totalItems={totalPages}
                            onPrevious={() =>
                                setPage((p) => Math.max(1, p - 1))
                            }
                            onNext={() =>
                                setPage((p) => Math.min(totalPages, p + 1))
                            }
                        />
                        <Button
                            color="primary"
                            onPress={handleSendInvites}
                            isDisabled={!examId || userEmails.length === 0}
                            isLoading={isLoading}
                        >
                            Invite Candidates
                        </Button>
                    </div>
                </div>

                <CommonModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Confirm Deletion"
                    content={`Remove ${selectedEmail?.email} from the list?`}
                    confirmButtonText="Remove"
                    onConfirm={handleDeleteEmail}
                />
            </div>
        </div>
    );
}
