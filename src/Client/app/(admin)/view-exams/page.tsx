'use client'

import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, Modal, ModalContent, ModalBody, useDisclosure, Link } from '@heroui/react'
import { Controller, useForm } from 'react-hook-form'
import PaginationButtons from '@/app/components/ui/pagination-button'
import CommonModal from '@/app/components/ui/Modal/edit-delete-modal'

interface Exam {
  examId: string
  title: string
  description: string
  durationMinutes: number
  opensAt: string
  createdAt: string
  closesAt: string
  status: 'Published' | 'Draft' | 'Ended'
  invitedCandidates: number | 'N/A'
  acceptedCandidates: number | 'N/A'
  problemSolving: number
  written: number
  mcq: number
  score: number
}

const ITEMS_PER_PAGE = 2
const Exams: Exam[] = [
  {
    title: 'Star Coder 2026',
    description: 'Running',
    durationMinutes: 60,
    opensAt: '2026-11-21T21:00:00.000Z',
    closesAt: '2026-11-21T22:20:00.000Z',
    status: 'Published',
    problemSolving: 10,
    written: 10,
    mcq: 30,
    score: 100,
    examId: '',
    createdAt: '',
    invitedCandidates: 0,
    acceptedCandidates: 0,
  },
  {
    title: 'Learnathon 4.0',
    description: 'Upcoming',
    durationMinutes: 90,
    opensAt: '2026-12-10T21:00:00.000Z',
    closesAt: '2026-12-10T23:00:00.000Z',
    status: 'Draft',
    problemSolving: 10,
    written: 10,
    mcq: 30,
    score: 100,
    examId: '',
    createdAt: '',
    invitedCandidates: 0,
    acceptedCandidates: 0,
  },
  {
    title: 'Star Coder 2005',
    description: 'Ended',
    durationMinutes: 60,
    opensAt: '2025-11-21T21:00:00.000Z',
    closesAt: '2025-11-21T22:00:00.000Z',
    status: 'Ended',
    problemSolving: 10,
    written: 10,
    mcq: 30,
    score: 100,
    examId: '',
    createdAt: '',
    invitedCandidates: 0,
    acceptedCandidates: 0,
  },
]
export default function ExamList() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { control, reset } = useForm<Exam>()
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const totalPages = Math.max(1, Math.ceil(Exams.length / ITEMS_PER_PAGE))

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages))
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1)
    }
  }, [currentPage, totalPages])

  const paginatedExams = Exams.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const handleEdit = (exam: Exam) => {
    setSelectedExam(exam)
    reset(exam)
    onOpen()
  }

  return (
    <>
      <div className={`h-screen flex flex-col justify-between w-full`}>
        <h1 className='w-full text-center text-3xl font-bold my-3'>Exams</h1>
        {paginatedExams.map((exam, index) => (
          <Card key={index} className="mx-8 p-4 shadow-none">
            <CardHeader className="flex justify-between items-center ">
              <div className="flex items-end gap-1">
                <h1 className="text-2xl font-bold flex gap-1 items-end text-[#3f3f46] dark:text-white">{exam.title}</h1>
                {exam.status === 'Published' ? (
                  <p className="text-green-500">{exam.status}</p>
                ) : exam.status === 'Draft' ? (
                  <p className="text-yellow-500">{exam.status}</p>
                ) : (
                  <p className="text-blue-600">{exam.status}</p>
                )}
              </div>
              <div className="flex gap-2">
                {exam.status === 'Ended' ? (
                  <Button color="primary">
                    <Link href="/exams/review-results" className={'text-white'}>
                      Review Results
                    </Link>
                  </Button>
                ) : exam.status === 'Draft' ? (
                  <>
                    <Button onPress={() => handleEdit(exam)}>Edit</Button>
                    <Button color="primary">Publish</Button>
                  </>
                ) : (
                  <>
                    <Button onPress={() => handleEdit(exam)}>Edit</Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardBody className="px-3">
              <div className="flex">
                <div className="flex flex-col flex-1">
                  <p><span className='text-[#71717a] dark:text-white'>Date:</span> Friday, 21 Nov 2026</p>
                  <p><span className='text-[#71717a] dark:text-white'>Duration:</span> 2 hr</p>
                  <p><span className='text-[#71717a] dark:text-white'>Starts at:</span> 9:00 PM</p>
                  <p><span className='text-[#71717a] dark:text-white'>Closes at:</span> 10:20 PM</p>
                </div>
                <div className="flex flex-col flex-1">
                  <p><span className='text-[#71717a] dark:text-white'>Problem Solving:</span> 10</p>
                  <p><span className='text-[#71717a] dark:text-white'>Written:</span> 10</p>
                  <p><span className='text-[#71717a] dark:text-white'>MCQ:</span> 10</p>
                  <p><span className='text-[#71717a] dark:text-white'>Score:</span> 100</p>
                </div>
                <div className="flex flex-col flex-1">
                  <p><span className='text-[#71717a] dark:text-white'>Invited Candidates:</span> 120</p>
                  <p><span className='text-[#71717a] dark:text-white'>Accepted:</span> 90</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
        <div className="flex justify-center items-center my-4">
          <span className="mx-4">
            Page {currentPage} of {totalPages}
          </span>
          <PaginationButtons
            currentIndex={currentPage}
            totalItems={totalPages}
            onPrevious={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            onNext={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          />
        </div>
      </div>

      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalBody>
            {selectedExam && (
              <form id="#" className="flex flex-col gap-6 p-10">
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2">
                      <h3 className="font-semibold">Title :</h3> <input {...field} placeholder="Exam Title" />
                    </div>
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2">
                      <h3 className="font-semibold">Description :</h3> <input {...field} placeholder="Description" />
                    </div>
                  )}
                />
                <Controller
                  name="durationMinutes"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2">
                      <h3 className="font-semibold flex">Duration(min) :</h3>{' '}
                      <input {...field} type="number" placeholder="Duration (minutes)" />
                    </div>
                  )}
                />
                <Controller
                  name="opensAt"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2">
                      <h3 className="font-semibold">Start Time :</h3> <input {...field} placeholder="Start Time" />
                    </div>
                  )}
                />
                <Controller
                  name="closesAt"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2">
                      <h3 className="font-semibold">Close Time :</h3>
                      <input {...field} placeholder="Close Time" />
                    </div>
                  )}
                />
                <Button color="primary" type="submit">
                  Update Exam
                </Button>
              </form>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <CommonModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Confirmation"
        content="Do you want to delete this user record?"
        confirmButtonText="Delete"
        onConfirm={() => setIsDeleteModalOpen(false)}
      />
    </>
  )
}
