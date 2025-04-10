'use client'

import React, { useState, useMemo } from 'react'
import { Form, Button, Textarea, Card, Input } from '@heroui/react'
import { Icon } from '@iconify/react'
import toast from 'react-hot-toast'
import PaginationButtons from '@/components/ui/pagination-button'
import he from 'he'
import { v4 as uuidv4 } from 'uuid'
import MdEditor from '../katex-mermaid'

interface TestCase {
  id: string
  input: string
  output: string
}

interface Problem {
  id: string
  question: string
  testCases: TestCase[]
}

/**
 * Renders a paginated form for managing problem solving questions and their test cases.
 *
 * This component maintains a list of problems—each with an associated question and test cases—and provides
 * helper functions to update them. It supports adding new test cases and problems, deleting or refreshing
 * test cases, and handling pagination to display one problem per page. User actions like deleting or refreshing
 * test cases trigger corresponding toast notifications.
 *
 * @returns The JSX element representing the problem solving question form.
 */
export default function ProblemSolvingForm() {
  const [problems, setProblems] = useState<Problem[]>([
    { id: uuidv4(), question: '', testCases: [{ id: uuidv4(), input: '', output: '' }] },
  ])
  const [currentPage, setCurrentPage] = useState(0)
  const problemsPerPage = 1
  const [value, setValue] = React.useState('"Hello, World!"')
  const escaped: string = he.escape(value)
  const unescaped: string = he.unescape(escaped)
  console.log(unescaped)

  const updateProblem = (problemId: string, updateFn: (problem: Problem) => Problem) => {
    setProblems(prevProblems => 
      prevProblems.map(problem => 
        problem.id === problemId ? updateFn(problem) : problem
      )
    )
  }

  const updateTestCase = (problemId: string, testCaseId: string, updateFn: (testCase: TestCase) => TestCase) => {
    updateProblem(problemId, problem => ({
      ...problem,
      testCases: problem.testCases.map(testCase => 
        testCase.id === testCaseId ? updateFn(testCase) : testCase
      )
    }))
  }

  const addTestCase = (problemId: string) => {
    updateProblem(problemId, problem => ({
      ...problem,
      testCases: [...problem.testCases, { id: uuidv4(), input: '', output: '' }]
    }))
    setValue('')
  }

  const handleDelete = (problemId: string, testCaseId: string) => {
    updateProblem(problemId, problem => ({
      ...problem,
      testCases: problem.testCases.filter(testCase => testCase.id !== testCaseId)
    }))
    toast.success('Test case deleted successfully')
  }

  const handleRefresh = (problemId: string, testCaseId: string) => {
    updateTestCase(problemId, testCaseId, () => ({ id: testCaseId, input: '', output: '' }))
    toast.success('Test case refreshed successfully')
  }

  const handleAddProblem = () => {
    const newProblem = { id: uuidv4(), question: '', testCases: [{ id: uuidv4(), input: '', output: '' }] }
    setProblems(prevProblems => {
      const newProblems = [...prevProblems, newProblem]
      setCurrentPage(Math.ceil(newProblems.length / problemsPerPage) - 1)
      return newProblems
    })
  }

  const handleTestCaseInputChange = (problemId: string, testCaseId: string, newInput: string) => {
    updateTestCase(problemId, testCaseId, testCase => ({ ...testCase, input: newInput }))
  }

  const handleTestCaseOutputChange = (problemId: string, testCaseId: string, newOutput: string) => {
    updateTestCase(problemId, testCaseId, testCase => ({ ...testCase, output: newOutput }))
  }

  const totalPages = useMemo(() => Math.ceil(problems.length / problemsPerPage), [problems, problemsPerPage])
  const currentProblems = useMemo(
    () => problems.slice(currentPage * problemsPerPage, (currentPage + 1) * problemsPerPage),
    [problems, currentPage, problemsPerPage]
  )

  return (
    <div>
      <Card className="border-none shadow-none bg-white dark:bg-[#18181b]">
        <h2 className="flex justify-center text-2xl my-3">Problem Solving Question : {currentPage + 1}</h2>
        <div className={`flex justify-center p-4`}>
          <Form id="#" className="w-full flex flex-col gap-4 p-5 border-none">
            {currentProblems.map(problem => (
              <ProblemItem
                key={problem.id}
                problem={problem}
                onDelete={handleDelete}
                onRefresh={handleRefresh}
                onInputChange={handleTestCaseInputChange}
                onOutputChange={handleTestCaseOutputChange}
              />
            ))}
            <FormFooter 
              totalPages={totalPages}
              currentPage={currentPage}
              onPrevious={() => setCurrentPage(currentPage - 1)}
              onNext={() => setCurrentPage(currentPage + 1)}
              onAddTestCase={() => addTestCase(currentProblems[0].id)}
            />
          </Form>
        </div>
      </Card>
      <div className="flex w-full justify-center mt-5">
        <Button onPress={handleAddProblem}>Add Problem Solving Question</Button>
      </div>
    </div>
  )
}

const ProblemItem = ({ problem, onDelete, onRefresh, onInputChange, onOutputChange }: {
  problem: Problem
  onDelete: (problemId: string, testCaseId: string) => void
  onRefresh: (problemId: string, testCaseId: string) => void
  onInputChange: (problemId: string, testCaseId: string, value: string) => void
  onOutputChange: (problemId: string, testCaseId: string, value: string) => void
}) => (
  <div className="rounded-lg w-full flex flex-col justify-center items-center">
    <MdEditor />
    {problem.testCases.map(testCase => (
      <TestCaseItem
        key={testCase.id}
        problem={problem}
        testCase={testCase}
        onDelete={onDelete}
        onRefresh={onRefresh}
        onInputChange={onInputChange}
        onOutputChange={onOutputChange}
      />
    ))}
  </div>
)

const TestCaseItem = ({ problem, testCase, onDelete, onRefresh, onInputChange, onOutputChange }: {
  problem: Problem
  testCase: TestCase
  onDelete: (problemId: string, testCaseId: string) => void
  onRefresh: (problemId: string, testCaseId: string) => void
  onInputChange: (problemId: string, testCaseId: string, value: string) => void
  onOutputChange: (problemId: string, testCaseId: string, value: string) => void
}) => (
  <div className="w-full flex gap-2 mt-2">
    <div className="flex flex-col gap-2">
      <Button
        isIconOnly
        variant="flat"
        isDisabled={problem.testCases.length === 1}
        onPress={() => onDelete(problem.id, testCase.id)}
      >
        <Icon icon="lucide:trash-2" width={20} />
      </Button>
      <Button isIconOnly variant="flat" onPress={() => onRefresh(problem.id, testCase.id)}>
        <Icon icon="lucide:refresh-cw" width={20} />
      </Button>
    </div>
    <div className="w-full flex gap-3">
      <Textarea
        label="Input"
        value={testCase.input}
        className="flex-1 bg-[#f4f4f5] dark:bg-[#27272a] rounded-2xl"
        onChange={(e) => onInputChange(problem.id, testCase.id, e.target.value)}
      />
      <Textarea
        label="Expected Output"
        value={testCase.output}
        className="flex-1 bg-[#f4f4f5] dark:bg-[#27272a] rounded-2xl"
        onChange={(e) => onOutputChange(problem.id, testCase.id, e.target.value)}
      />
    </div>
  </div>
)

const FormFooter = ({ 
  totalPages, 
  currentPage, 
  onPrevious, 
  onNext, 
  onAddTestCase 
}: {
  totalPages: number
  currentPage: number
  onPrevious: () => void
  onNext: () => void
  onAddTestCase: () => void
}) => (
  <div className="flex w-full justify-between items-center mt-4">
    <Input className="w-32" type="number" placeholder="Points" />
    <div className="flex gap-2 items-center">
      <span>Page {currentPage + 1} of {totalPages}</span>
      <PaginationButtons
        currentIndex={currentPage + 1}
        totalItems={totalPages}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </div>
    <div className="flex gap-2 items-center">
      <Button
        variant="flat"
        startContent={<Icon icon="lucide:plus" />}
        onPress={onAddTestCase}
      >
        Add Test Case
      </Button>
      <Button color="primary">Save</Button>
    </div>
  </div>
)