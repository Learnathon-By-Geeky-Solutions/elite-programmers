"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { Selection } from "@heroui/react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Pagination,
    Textarea,
} from "@heroui/react";
import SearchIcon from "@/components/ui/SearchIcon";
import api from "@/lib/api";
import { FormatDatewithTime } from "@/components/DateTimeFormat";
import isValidEmail from "@/components/EmailValidation";
import toast from "react-hot-toast";
import Paginate from "@/components/SelectPagination";
import { ApiResponse, User } from "@/components/types/apiResponse";

const columns = [
    { label: "Username", key: "username" },
    { label: "Email", key: "email" },
    { label: "Role", key: "roles" },
    { label: "Created At", key: "createdAt" },
];

export default function Component() {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const hasSearchFilter = Boolean(searchTerm);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
    const [invitedEmails, setInvitedEmails] = useState("");

    useEffect(() => {
        const ManageUser = async () => {
            try {
                const response = await api.get<ApiResponse>(
                    `/Account?pageIndex=${page}&pageSize=${rowsPerPage}${
                        searchTerm ? `&searchTerm=${searchTerm}` : ""
                    }`
                );
                if (response.status === 200) {
                    const pureCandidates = response.data.accounts.filter(
                        (user) =>
                            user.roles.length === 1 &&
                            user.roles[0] === "Candidate"
                    );
                    setAllUsers(pureCandidates);
                    setTotalPages(
                        Math.ceil(pureCandidates.length / rowsPerPage)
                    );
                }
            } catch { toast.error("Failed to load candidate list.Please check your network connection and try again.") }
        };
        ManageUser();
    }, [page, rowsPerPage, searchTerm]);

    const filteredItems = useMemo(() => {
        let filteredUsers = [...allUsers];
        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter(
                (user) =>
                    user.email
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    user.username
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }
        return filteredUsers;
    }, [allUsers, hasSearchFilter, searchTerm]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const onNextPage = useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);
    const onSearchChange = useCallback((value?: string) => {
        setSearchTerm(value ?? "");
        setPage(1);
    }, []);
    const renderCell = useCallback((user: User, columnKey: React.Key) => {
        const cellValue = user[columnKey as keyof User];
        if (columnKey === "createdAt")
            return FormatDatewithTime(cellValue as string);
        else if (columnKey === "roles") {
            if (Array.isArray(cellValue)) {
                return cellValue.map((curr) => <div key={curr}>{curr}</div>);
            }
        } else return cellValue as React.ReactNode;
    }, []);
    const onClear = useCallback(() => {
        setSearchTerm("");
        setPage(1);
    }, []);

    const handleMakeAdmin = useCallback(async () => {
        const selectedEmail = Array.from(selectedKeys);
        if (selectedEmail.length == 0) {
            alert("please select an account to make admin.");
        }
        const selectedUsers = allUsers.filter((e) =>
            selectedEmail.includes(e.email)
        );
        try {
            const response = await api.patch("/Account/MakeAdmin", {
                accountIds: selectedUsers.map((e) => e.accountId),
            });

            if (response.status === 200) {
                setAllUsers((prev) =>
                    prev.map((e) =>
                        selectedEmail.includes(e.email)
                            ? {
                                  ...e,
                                  roles: Array.from(
                                      new Set([...e.roles, "Admin"])
                                  ),
                              }
                            : e
                    )
                );
                setSelectedKeys(new Set());
                toast.success(
                    "Selected users have been made admins successfully!"
                );
            }
        } catch {
            toast.error("Failed to make admin. Please try again.");
        }
    }, [selectedKeys, allUsers]);

    const handleInvitation = useCallback(async () => {
        const emailsToSend = invitedEmails
            .split(",")
            .map((email) => email.trim())
            .filter(Boolean);

        const invalidEmails = emailsToSend.filter(
            (email) => !isValidEmail(email)
        );

        if (invalidEmails.length > 0) {
            alert(`Emails are invalid`);
            return;
        }

        if (emailsToSend.length === 0) {
            alert("Please enter at least one valid email address");
            return;
        }
        try {
            const response = await api.post("/Account/SendAdminInvite", {
                email: emailsToSend,
            });
            if (response.status === 200) {
                toast.success("Invitations sent successfully!");
                setInvitedEmails("");
            }
        } catch {
            toast.error("Failed to send invitations. Please try again.");
        }
    }, [invitedEmails]);

    const topContent = useMemo(
        () => (
            <div className="flex w-full justify-between mt-24">
                <Input
                    isClearable
                    className="w-[400px] dark:[#71717a] rounded-2xl "
                    placeholder="Search"
                    startContent={<SearchIcon />}
                    value={searchTerm}
                    onClear={onClear}
                    onValueChange={onSearchChange}
                />
                <Paginate
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                />
            </div>
        ),
        [onClear, onSearchChange, rowsPerPage, searchTerm]
    );

    return (
        <div className="flex flex-col justify-between">
            <h2 className="text-2xl font-bold text-center my-5">Add Admins</h2>
            <div className=" mx-44 flex flex-col justify-between rounded-xl bg-white dark:bg-[#18181b] px-12">
                <div>
                    <div className="flex gap-3 w-full p-3 mt-12 items-center">
                        <Textarea
                            isClearable
                            className="bg-[#eeeef0] dark:bg-[#27272a] rounded-2xl"
                            placeholder="Email Addresses"
                            onClear={onClear}
                            value={invitedEmails}
                            onChange={(e) => setInvitedEmails(e.target.value)}
                        />
                        <Button
                            color="primary"
                            size="lg"
                            onPress={handleInvitation}
                        >
                            Send Invitations
                        </Button>
                    </div>
                    <Table
                        aria-label="Example table with custom cells, pagination, and sorting"
                        topContent={topContent}
                        topContentPlacement="outside"
                        removeWrapper
                        selectedKeys={selectedKeys}
                        selectionMode="multiple"
                        classNames={{
                            table: "w-full h-full",
                            base: "min-h-[570px]",
                        }}
                        onSelectionChange={setSelectedKeys}
                    >
                        <TableHeader>
                            {columns.map((column) => (
                                <TableColumn
                                    key={column.key}
                                    align={"center"}
                                    className={"font-semibold"}
                                >
                                    {column.label}
                                </TableColumn>
                            ))}
                        </TableHeader>
                        <TableBody
                            emptyContent="No admin found"
                            className={
                                items.length === 0
                                    ? "min-h-[70vh]"
                                    : "min-h-[auto]"
                            }
                        >
                            {items.map((item) => (
                                <TableRow key={item.email}>
                                    {columns.map((column) => (
                                        <TableCell key={column.key}>
                                            {renderCell(item, column.key)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="py-2 px-2 flex justify-between items-center">
                    <span className="w-[30%] text-small text-default-400">
                        Page {page} out of {totalPages}
                    </span>
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={pages}
                        onChange={setPage}
                    />
                    <div className="hidden sm:flex w-[30%] justify-end gap-2">
                        <Button
                            isDisabled={pages === 1}
                            size="sm"
                            variant="flat"
                            onPress={onPreviousPage}
                        >
                            Previous
                        </Button>
                        <Button
                            isDisabled={pages === 1}
                            size="sm"
                            variant="flat"
                            onPress={onNextPage}
                        >
                            Next
                        </Button>
                        <Button
                            color="primary"
                            size="sm"
                            onPress={handleMakeAdmin}
                        >
                            Make Admin
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
