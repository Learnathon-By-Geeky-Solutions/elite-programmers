"use client"
import React from "react";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, User, Pagination,
    Selection, SortDescriptor,
} from "@heroui/react";
import {Link} from "@nextui-org/react";
import SearchIcon from "../../../table/search_icon/page";


const columns = [
    {name: "Candidate Id", uid: "CandidateId"},
    {name: "Candidate Name", uid: "CandidateName"},
    {name: "Timestamp", uid: "Timestamp"},
    {name:"Submission",uid:"Submission"},
    {name: "Score", uid: "Score",sortable: true},
];
const users = [{
    CandidateId:1,
    CandidateName:"aa",
    Timestamp:"1:58:19",
    Submission:"",
    Score:""
},];
const INITIAL_VISIBLE_COLUMNS = ["CandidateId", "CandidateName","Timestamp","Submission","Score"];
type User = (typeof users)[0];

export default function Component({ params }: { params: Promise<{ id: string }> }) {
    const paramsId=React.use(params);
    const [filterValue, setFilterValue] = React.useState("");

    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
        new Set(INITIAL_VISIBLE_COLUMNS),
    );
  
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column:"Date",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);
    const hasSearchFilter = Boolean(filterValue);
    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") { setVisibleColumns("all"); return columns;}

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);
    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.CandidateName.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        return filteredUsers;
    }, [ filterValue,hasSearchFilter]);
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
    const renderCell = React.useCallback((user: User, columnKey: React.Key,CandidateId:number) => {
        const cellValue = user[columnKey as keyof User];
        switch (columnKey) {
            case "Submission":
                return(
                    <>
                        <Link href={`/reviewer_dashboard/exam-review/${paramsId.id}/submissions/${CandidateId}`}><Button radius={'full'} color={'primary'}>View</Button></Link>
                    </>
                );
            default:
                return cellValue;
        }
    }, [paramsId.id]);
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
                <h3 className="text-2xl text-center font-bold">Exam ID:{paramsId.id}</h3>
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
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {users.length} users</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        onClear,paramsId.id,
        onSearchChange,
        onRowsPerPageChange,

    ]);
    const bottomContent = React.useMemo(() => {
        return (
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
        );
    }, [ page, pages,onNextPage,onPreviousPage]);
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
                   selectedKeys={selectedKeys}
                   sortDescriptor={sortDescriptor}
                   topContent={topContent}
                   topContentPlacement="outside"
                   onSelectionChange={setSelectedKeys}
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
                        <TableRow key={item.CandidateId}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey,item.CandidateId)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}
