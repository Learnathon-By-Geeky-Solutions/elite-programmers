"use client"
import React, {SVGProps} from "react";
import {Icon} from "@iconify/react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import '../../../styles/globals.css'

import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, User, Pagination,
    Selection,
    SortDescriptor, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,
} from "@heroui/react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

const SearchIcon = (props: IconSvgProps) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...props}
        >
            <path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <path
                d="M22 22L20 20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
};

const columns = [
    {name: "ID", uid: "id"},
    {name: "Exam Name", uid: "exam"},
    {name: "Date", uid: "date",sortable: true},
    {name: "Time", uid: "time"},
    {name: "Reviewer Name", uid: "reviewer"},
    {name: "No. of Candidates", uid: "candidates",sortable: true},
    {name: "Action", uid: "action"},
];
const users = [
    {
        id: 1,
        exam: "QA engineer intern",
        date:"25-02-2025",
        time:"08:20",
        reviewer:"sadman",
        candidates:"120",
        action:"Edit Delete"
    },
];

const INITIAL_VISIBLE_COLUMNS = ["id","exam","date","time", "reviewer", "candidates","action"];

type User = (typeof users)[0];

export default function Component() {
    const [filterValue, setFilterValue] = React.useState("");
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
        new Set(INITIAL_VISIBLE_COLUMNS),
    );
   
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column:"datetime",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);
    const hasSearchFilter = Boolean(filterValue);
   
    const headerColumns = React.useMemo(() => {
            if (visibleColumns === "all"){setVisibleColumns("all"); return columns;}
    
            return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
        }, [visibleColumns]);
        
    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.exam.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        return filteredUsers;
    }, [ filterValue, hasSearchFilter]);
    const pages = Math.ceil(filteredItems.length / rowsPerPage);
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);
    const sortedItems = React.useMemo(() => {
        return [...items].sort((a: User, b: User) => {
            const first = a[sortDescriptor.column as keyof User] as number;
            const second = b[sortDescriptor.column as keyof User] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [state, setState] = React.useState("");
    
    const handleOpen = React.useCallback((word: string) => {
        setState(word);
        onOpen();
    }, [onOpen]); 

    const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
        const cellValue = user[columnKey as keyof User];
        switch (columnKey) {
            case "name":
                return (
                    <User name={cellValue}>
                        {user.exam}
                    </User>
                );
            case "action":
                return(
                    <>
                    <div className='flex gap-4 ml-28'>
                        <button onClick={()=>handleOpen('edit')}><FaEdit className={'text-xl'}/></button>
                        <button onClick={()=>handleOpen('delete')}><MdDelete className={'text-xl'} /></button>
                    </div>
                  </>
                );
            default:
                return cellValue;
        }
    }, [handleOpen]);
    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4 mt-8 w-full">
                <h3 className="text-2xl text-center font-bold">Exam Management</h3>
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[30%]"
                        placeholder="Search by name..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <Button color="primary" startContent={<Icon icon="solar:add-circle-bold" width={20} />}>
                        Create Exam
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
        );
    }, [
        filterValue, onSearchChange,onRowsPerPageChange,onClear
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">

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
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        );
    }, [ page, pages, onNextPage,onPreviousPage]);

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
                        align={ "center"} className={" font-semibold"}
                        allowsSorting={column.sortable}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>

            <TableBody emptyContent={"No exam found"} items={sortedItems}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
            <Modal isOpen={isOpen} onClose={onClose} >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{state==='edit'?"Edit Confirmation":"Delete Confirmation"}</ModalHeader>
                            <ModalBody>
                                <p>
                                    {`Do you want to ${state==='edit'?"edit this exam":"delete this exam"}?`}
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" variant="light" onPress={onClose}>Close</Button>
                                <Button color="danger" onPress={onClose}>{state==='edit'?"Edit":"Delete"}</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
