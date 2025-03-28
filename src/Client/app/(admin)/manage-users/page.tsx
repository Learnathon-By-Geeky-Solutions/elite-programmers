'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'
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
} from '@heroui/react'
import SearchIcon from '@/app/components/ui/search_icon/page'
import PaginationButtons from '@/app/components/ui/pagination-button'
import CommonModal from '@/app/components/ui/Modal/edit-delete-modal'
import api from '@/app/components/utils/api'
import { AxiosError } from 'axios'

const columns = [
  { label: 'Username', key: 'username' },
  { label: 'Email', key: 'email' },
  { label: 'Role', key: 'roles' },
  { label: 'Created At', key: 'createdAt' },
  { label: 'Action', key: 'action' },
]

type User = {
  username: string
  email: string
  roles: string
  createdAt: Date
  action?: string
}

export default function Component() {
  const [filterValue, setFilterValue] = useState('')
  const rowsPerPage = 10
  const [page, setPage] = useState(1)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [usersData,setUserData]=useState<User[]>([])
  const [error,setError]=useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const hasSearchFilter = Boolean(filterValue)
  useEffect(()=>{
    const ManageUser=async()=>{
   
        try{
          const response=await api.get('Account/All')
          if(response.status===200){
             setUserData(response.data)
          }
        }catch(err){
            const error=err as AxiosError
            setError(error.message)
        }
    }
    ManageUser();
  },[])
  const filteredItems = useMemo(() => {
    let filteredUsers = [...usersData]
    console.log(filteredUsers)
    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.email?.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.username?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredUsers
  }, [filterValue, hasSearchFilter, usersData])
  const pages = Math.ceil(filteredItems.length / rowsPerPage)
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])
  const formatDate = useCallback((date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
  }, [])
  const renderCell = useCallback(
    (user: User, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof User]
      switch (columnKey) {
        case 'action':
          return (
            <div className="flex gap-4 ml-16">
              <button aria-label="Edit User" onClick={() => setIsEditModalOpen(true)}>
                <FaEdit className={'text-xl'} />
              </button>
              <button aria-label="Delete User" onClick={() => setIsDeleteModalOpen(true)}>
                <MdDelete className={'text-xl'} />
              </button>
            </div>
          )
        case 'createdAt':
          return formatDate(cellValue as Date)
        default:
          return cellValue as React.ReactNode
      }
    },
    [formatDate]
  )
  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue('')
    }
  }, [])
  const onClear = useCallback(() => {
    setFilterValue('')
    setPage(1)
  }, [])
  const topContent = useMemo(
    () => (
      <div className="flex gap-8 p-3  w-full justify-between items-center mt-5">
        <h2 className="ml-3">Users List</h2>
        <div className="flex items-end">
          <Input
            isClearable
            className="w-[400px] bg-[#eeeef0] dark:[#71717a] rounded-2xl"
            placeholder="Search"
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    ),
    [filterValue, onClear, onSearchChange]
  )

  return (
    <div className="flex  flex-col justify-between">
      <h2 className="text-2xl font-bold my-5 text-center flex justify-center"> Manage Users</h2>
      <div className="mx-12 flex min-h-screen flex-col justify-between  rounded-xl bg-white dark:bg-[#18181b]">
        {error && <p className='text-red-500 text-xl'>{error}</p>}
        <Table
          aria-label="Example table with custom cells, pagination"
          topContent={topContent}
          topContentPlacement="outside"
          selectionMode="multiple"
          classNames={{
            wrapper: ' ',
            table: 'w-full ',
          }}
        >
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key} align={'center'} className={'font-semibold'}>
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody emptyContent="No user found" className={items.length === 0 ? 'min-h-[70vh]' : 'min-h-[auto]'}>
            {items.map((item) => (
              <TableRow key={item.email}>
                {columns.map((column) => (
                  <TableCell key={column.key}>{renderCell(item, column.key)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="py-4 px-2 flex justify-between items-center">
          <Pagination isCompact showControls showShadow color="primary" page={page} total={pages} onChange={setPage} />
          <span className=" text-small text-default-400">
            Page {page} out of {pages}
          </span>
          <div className="flex gap-2">
            <PaginationButtons
              currentIndex={page}
              totalItems={pages}
              onPrevious={() => setPage(page - 1)}
              onNext={() => setPage(page + 1)}
            />
            <Button color="primary" size="sm">
              Export
            </Button>
          </div>
        </div>
      </div>
      <CommonModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Confirmation"
        content="Do you want to edit this user record?"
        confirmButtonText="Edit"
        onConfirm={() => setIsEditModalOpen(false)}
      />
      <CommonModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Confirmation"
        content="Do you want to delete this user record?"
        confirmButtonText="Delete"
        onConfirm={() => setIsDeleteModalOpen(false)}
      />
    </div>
  )
}
