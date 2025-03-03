"use client"
import React, { SVGProps, useCallback, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, Pagination,
     SortDescriptor, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,
} from "@heroui/react";
import SearchIcon from "../../table/search_icon/page";

const columns = [
    { name: "Exam ID", uid: "ExamId" },
    { name: "Exam Name", uid: "ExamName" },
    { name: "Candidate Id", uid: "CandidateId" },
    { name: "Candidate Name", uid: "CandidateName" },
    { name: "Date", uid: "Date", sortable: true },
    { name: "Time", uid: "Time" },
    { name: "Action", uid: "Action" },
];

const users = [{
    ExamId: 1,
    ExamName: "QA engineer intern",
    CandidateId: 1,
    CandidateName: "aa",
    Date: "25-02-2025",
    Time: "08:20",
    Action: "Edit Delete"
}];

type User = typeof users[0];

export default function Component() {
    const [filterValue, setFilterValue] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "datetime",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [state, setState] = useState("");

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
        return columns.filter((column) => column.uid !== "Action"); 
    }, []);

    const filteredItems = useMemo(() => {
        let filteredUsers = [...users];
        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.ExamName.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        return filteredUsers;
    }, [filterValue, hasSearchFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a: User, b: User) => {
            const first = a[sortDescriptor.column as keyof User] as number;
            const second = b[sortDescriptor.column as keyof User] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const handleOpen = useCallback((word: string) => {
        setState(word);
        onOpen();
    }, [onOpen]);

    const renderCell = useCallback((user: User, columnKey: React.Key) => {
        const cellValue = user[columnKey as keyof User];
        switch (columnKey) {
            case "Action":
                return (
                    <div className='flex gap-4 ml-28'>
                        <button onClick={() => handleOpen('edit')}><FaEdit className={'text-xl'} /></button>
                        <button onClick={() => handleOpen('delete')}><MdDelete className={'text-xl'} /></button>
                    </div>
                );
            default:
                return cellValue;
        }
    }, [handleOpen]);

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

    const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const topContent = useMemo(() => (
        <div className="flex flex-col gap-4 mt-8 w-full">
            <h3 className="text-2xl text-center font-bold">Candidate Management</h3>
            <div className="flex justify-between gap-3 items-end">
                <Input
                    isClearable
                    className="w-full sm:max-w-[30%]"
                    placeholder="Search by name..."
                    startContent={<SearchIcon/>}
                    value={filterValue}
                    onClear={onClear}
                    onValueChange={onSearchChange}
                />
                <Button color="primary" startContent={<Icon icon="solar:add-circle-bold" width={20} />}>
                    Add
                </Button>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-default-400 text-small">Total {users.length} users</span>
                <label className="flex items-center text-default-400 text-small">
                    Rows per page:
                    <select
                        className="bg-transparent outline-none text-default-400 text-small"
                        onChange={onRowsPerPageChange}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </label>
            </div>
        </div>
    ), [filterValue, onSearchChange, onRowsPerPageChange, onClear]);

    const bottomContent = useMemo(() => (
        <div className="py-2 px-2 flex justify-between items-center">
            <span className="w-[30%] text-small text-default-400"></span>
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
                <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                    Previous
                </Button>
                <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                    Next
                </Button>
            </div>
        </div>
    ), [page, pages, onPreviousPage, onNextPage]);

    return (
        <>
            <Table className="px-10 mx-2"
                   isHeaderSticky
                   aria-label="Example table with custom cells, pagination and sorting"
                   bottomContent={bottomContent}
                   bottomContentPlacement="outside"
                   classNames={{
                       wrapper: "max-h-[382px]",
                   }}
                   sortDescriptor={sortDescriptor}
                   topContent={topContent}
                   topContentPlacement="outside"
                   onSortChange={setSortDescriptor}>
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={"center"}
                            className={"font-semibold"}
                            allowsSorting={column.sortable}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"No exam found"} items={sortedItems}>
                    {(item) => (
                        <TableRow key={item.ExamId}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{state === 'edit' ? "Edit Confirmation" : "Delete Confirmation"}</ModalHeader>
                            <ModalBody>
                                <p>
                                    {`Do you want to ${state === 'edit' ? "edit this candidate record" : "delete this candidate record"}?`}
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" variant="light" onPress={onClose}>Close</Button>
                                <Button color="danger" onPress={onClose}>{state === 'edit' ? "Edit" : "Delete"}</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}