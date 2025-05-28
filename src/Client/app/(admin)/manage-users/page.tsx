"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MdDelete } from "react-icons/md";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Pagination,
    Button,
} from "@heroui/react";
import SearchIcon from "@/components/ui/SearchIcon";
import PaginationButtons from "@/components/ui/PaginationButton";
import CommonModal from "@/components/ui/Modal/EditDeleteModal";
import api from "@/lib/api";
import { FormatDatewithTime } from "@/components/DateTimeFormat";
import handleDelete from "@/lib/handleDelete";
import handleStatus from "@/lib/handleStatus";
import RoleFilter from "@/components/RoleFilter";
import Paginate from "@/components/SelectPagination";
import toast from "react-hot-toast";
import { ApiResponse, User } from "@/components/types/apiResponse";

const columns = [
    { label: "Username", key: "username" },
    { label: "Email", key: "email" },
    { label: "Role", key: "roles" },
    { label: "Created At", key: "createdAt" },
    { label: "Action", key: "action" },
];

export default function Component() {
    const [filterValue, setFilterValue] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [roleFilter, setRoleFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [isActiveModalOpen, setIsActiveModalOpen] = useState(false);
    const [usersData, setUserData] = useState<User[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState("");
    const [status, setStatus] = useState<boolean>(true);
    const hasSearchFilter = Boolean(filterValue);
    const hasRoleFilter = Boolean(roleFilter);

    useEffect(() => {
        const ManageUser = async () => {
            try {
                const response = await api.get<ApiResponse>(
                    `/Account?pageIndex=${page}&pageSize=${rowsPerPage}${
                        roleFilter ? `&role=${roleFilter}` : ""
                    }${searchTerm ? `&searchTerm=${searchTerm}` : ""}`
                );
                if (response.status === 200) {
                    setUserData(response.data.accounts);
                    setTotalPages(response.data.page.totalPages ?? 1);
                }
            } catch {
                toast.error(
                    "Failed to load users list .Please check your network connection and try again."
                );
            }
        };
        ManageUser();
    }, [page, roleFilter, rowsPerPage, searchTerm]);

    const filteredItems = useMemo(() => {
        let filteredUsers = [...usersData];
        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter(
                (user) =>
                    user.email
                        ?.toLowerCase()
                        .includes(filterValue.toLowerCase()) ||
                    user.username
                        ?.toLowerCase()
                        .includes(filterValue.toLowerCase())
            );
        }
        if (hasRoleFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.roles?.some(
                    (role) => role.toLowerCase() === roleFilter.toLowerCase()
                )
            );
        }
        return filteredUsers;
    }, [filterValue, hasSearchFilter, usersData, roleFilter, hasRoleFilter]);

    const renderCell = useCallback((user: User, columnKey: React.Key) => {
        const cellValue = user[columnKey as keyof User];
        if (columnKey === "roles") {
            if (Array.isArray(cellValue) && cellValue?.length > 1) {
                return cellValue.map((e) => (
                    <p className="w-full" key={e}>
                        {e}
                    </p>
                ));
            }
        }
        if (columnKey === "action") {
            return (
                <div className="flex gap-3 w-[100px] justify-between ml-6">
                    <Button
                        type="button"
                        variant="solid"
                        aria-label="Change Status"
                        onPress={() => {
                            setSelectedUser(user.accountId);
                            setIsActiveModalOpen(true);
                        }}
                    >
                        {user.isActive ? "Disable" : "Enable"}
                    </Button>
                    <button
                        type="button"
                        aria-label="Delete User"
                        onClick={() => {
                            setSelectedUser(user.accountId);
                            setIsDeleteModalOpen(true);
                        }}
                    >
                        <MdDelete className={"text-2xl"} />
                    </button>
                </div>
            );
        } else if (columnKey === "createdAt") {
            return FormatDatewithTime(cellValue as string);
        } else {
            return cellValue as React.ReactNode;
        }
    }, []);

    const onSearchChange = useCallback((value?: string) => {
        setSearchTerm(value ?? "");
        setPage(1);
    }, []);

    const onClear = useCallback(() => {
        setSearchTerm("");
        setFilterValue("");
        setRoleFilter("");
        setPage(1);
    }, []);

    const onRoleChange = useCallback((value: string) => {
        setRoleFilter(value);
        setPage(1);
    }, []);

    const topContent = useMemo(
        () => (
            <div className="flex gap-5 p-3 w-full items-center justify-between mt-5">
                <Input
                    isClearable
                    className="w-[400px] bg-[#eeeef0] dark:[#71717a] rounded-2xl"
                    placeholder="Search"
                    startContent={<SearchIcon />}
                    value={searchTerm}
                    onClear={onClear}
                    onValueChange={onSearchChange}
                />
                <div className="flex gap-3">
                    <RoleFilter
                        roleFilter={roleFilter}
                        onRoleChange={onRoleChange}
                    />
                    <Paginate
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                    />
                </div>
            </div>
        ),
        [
            roleFilter,
            onRoleChange,
            rowsPerPage,
            searchTerm,
            onClear,
            onSearchChange,
        ]
    );

    return (
        <div className="h-full flex flex-col justify-between">
            <h2 className="text-2xl font-bold my-5 text-center flex justify-center">
                Manage Users
            </h2>
            <div className="h-full mx-40 px-5 mb-8 flex flex-col justify-between rounded-xl bg-white dark:bg-[#18181b]">
                <Table
                    aria-label="Example table with custom cells, pagination"
                    topContent={topContent}
                    topContentPlacement="outside"
                    selectionMode="multiple"
                    removeWrapper
                    classNames={{
                        table: "w-full h-full",
                    }}
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
                        emptyContent="No user found"
                        className={
                            filteredItems.length === 0
                                ? "min-h-[70vh]"
                                : "min-h-[auto]"
                        }
                    >
                        {filteredItems.map((item) => (
                            <TableRow key={item.accountId}>
                                {columns.map((column) => (
                                    <TableCell key={column.key}>
                                        {renderCell(item, column.key)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="py-4 px-2 flex justify-between items-center">
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={totalPages}
                        onChange={setPage}
                    />
                    <span className=" text-small text-default-400">
                        Page {page} out of {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <PaginationButtons
                            currentIndex={page}
                            totalItems={totalPages}
                            onPrevious={() => setPage(Math.max(1, page - 1))}
                            onNext={() =>
                                setPage(Math.min(totalPages, page + 1))
                            }
                        />
                        <Button color="primary" size="sm">
                            Export
                        </Button>
                    </div>
                </div>
            </div>
            <CommonModal
                isOpen={isActiveModalOpen}
                onClose={() => {
                    setIsActiveModalOpen(false);
                    setSelectedUser("");
                }}
                title="Status Confirmation"
                content={`Do you want to ${
                    status ? "disable" : "enable"
                } this record`}
                confirmButtonText={`${status ? "Disable" : "Enable"}`}
                onConfirm={async () => {
                    const resp = await handleStatus(selectedUser, setStatus);
                    if (resp) {
                        setUserData((prevUsers) =>
                            prevUsers.map((user) =>
                                user.accountId === selectedUser
                                    ? { ...user, isActive: !status }
                                    : user
                            )
                        );
                        setIsActiveModalOpen(false);
                        setSelectedUser("");
                    }
                }}
            />
            <CommonModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedUser("");
                }}
                title="Delete Confirmation"
                content={`Do you want to delete this record?`}
                confirmButtonText="Delete"
                onConfirm={async () => {
                    const success = await handleDelete(selectedUser);
                    if (success) {
                        setUserData((prevUsers) =>
                            prevUsers.filter(
                                (user) => user.accountId !== selectedUser
                            )
                        );
                        setIsDeleteModalOpen(false);
                        setSelectedUser("");
                        const remainingUsersOnCurrentPage = filteredItems
                            .filter((user) => user.accountId !== selectedUser)
                            .slice(
                                (page - 1) * rowsPerPage,
                                page * rowsPerPage
                            ).length;
                        if (remainingUsersOnCurrentPage === 0 && page > 1)
                            setPage(page - 1);
                        else {
                            const ManageUser = async () => {
                                try {
                                    const response = await api.get<ApiResponse>(
                                        `/Account?pageIndex=${page}&pageSize=${rowsPerPage}${
                                            roleFilter
                                                ? `&role=${roleFilter}`
                                                : ""
                                        }${
                                            searchTerm
                                                ? `&searchTerm=${searchTerm}`
                                                : ""
                                        }`
                                    );
                                    if (response.status === 200) {
                                        setUserData(response.data.accounts);
                                        setTotalPages(
                                            response.data.page.totalPages ?? 1
                                        );
                                    }
                                } catch {}
                            };
                            ManageUser();
                        }
                    }
                }}
            />
        </div>
    );
}
