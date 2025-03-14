'use client'
import React, { useState } from "react";
import { Form, Button, Textarea } from "@heroui/react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import PaginationButtons from "../ui/pagination-button";

interface TestCase {
  id?: string;
  input: string;
  output: string;
}

interface Problem {
  id?: string;
  question: string;
  testCases: TestCase[];
}

export default function ProblemSolvingFormp() {
  const [problems, setProblems] = useState<Problem[]>([
    { question: "", testCases: [{ input: "", output: "" }] },
  ]);
  const [currentPage, setCurrentPage] = useState(0);
  const problemsPerPage = 1;
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const addTestCase = (problemIndex: number) => {
    setProblems(prevProblems => {
      const updatedProblems = [...prevProblems];
      updatedProblems[problemIndex] = {
        ...updatedProblems[problemIndex],
        testCases: [...updatedProblems[problemIndex].testCases, { input: '', output: '' }]
      };
      return updatedProblems;
    });
  };

  const handleDelete = (problemIndex: number, testCaseIndex: number) => {
    setProblems(prevProblems => {
      const updatedProblems = [...prevProblems];
      updatedProblems[problemIndex] = {
        ...updatedProblems[problemIndex],
        testCases: updatedProblems[problemIndex].testCases.filter((_, i) => i !== testCaseIndex)
      };
      return updatedProblems;
    });

    toast.success("Test case deleted successfully");
  };

  const handleRefresh = (problemIndex: number, testCaseIndex: number) => {
    setProblems(prevProblems => {
      const updatedProblems = [...prevProblems];
      updatedProblems[problemIndex].testCases[testCaseIndex] = { input: '', output: '' };
      return updatedProblems;
    });

    toast.success("Test case refreshed successfully");
  };

  const handleAddProblem = () => {
    setProblems(prevProblems => {
      const newProblems = [...prevProblems, { question: "", testCases: [{ input: "", output: "" }] }];
      const newTotalPages = Math.ceil(newProblems.length / problemsPerPage);
      setCurrentPage(newTotalPages - 1);
      return newProblems;
    });
  };

  const handleProblemDescriptionChange = (problemIndex: number, newQuestion: string) => {
    setProblems(prevProblems => {
      const updatedProblems = [...prevProblems];
      updatedProblems[problemIndex] = { ...updatedProblems[problemIndex], question: newQuestion };
      return updatedProblems;
    });
  };

  const handleTestCaseInputChange = (problemIndex: number, testCaseIndex: number, newInput: string) => {
    setProblems(prevProblems => {
      const updatedProblems = [...prevProblems];
      updatedProblems[problemIndex].testCases[testCaseIndex] = {
        ...updatedProblems[problemIndex].testCases[testCaseIndex],
        input: newInput
      };
      return updatedProblems;
    });
  };

  const handleTestCaseOutputChange = (problemIndex: number, testCaseIndex: number, newOutput: string) => {
    setProblems(prevProblems => {
      const updatedProblems = [...prevProblems];
      updatedProblems[problemIndex].testCases[testCaseIndex] = {
        ...updatedProblems[problemIndex].testCases[testCaseIndex],
        output: newOutput
      };
      return updatedProblems;
    });
  };

  const totalPages = Math.ceil(problems.length / problemsPerPage);
  const currentProblems = problems.slice(currentPage * problemsPerPage, (currentPage + 1) * problemsPerPage);

  const handleSaveAll = () => {
    // setIsModalOpen(true);
  };
  const Mode = localStorage.getItem("theme")
  return (
    <div className="border-none">
      <h2 className="flex justify-center text-2xl  mb-2">Problem Solving Question : {currentPage + 1}</h2>
      <div className={`flex justify-center p-4 ${Mode === "dark" ? "bg-[#18181b]" : "bg-white"}`}>
        <Form className="w-full flex flex-col gap-4 p-5 border-none">
          {currentProblems.map((problem, problemIndex) => (
            <div key={problemIndex} className=" p-4 rounded-lg shadow-md">
              <Textarea
                label="Problem Description"
                placeholder="Enter your problem description here..."
                minRows={5}
                variant="bordered" className={`${Mode === "dark" ? "bg-[#27272a]" : "bg-white"}`}
                value={problem.question}
                onChange={(e) => handleProblemDescriptionChange(currentPage * problemsPerPage + problemIndex, e.target.value)}
              />

              {problem.testCases.map((testCase, testCaseIndex) => (
                <div key={testCaseIndex} className="flex gap-2 mt-2">
                  <div className="flex flex-col gap-2">
                    <Button
                      isIconOnly
                      variant="flat"
                      isDisabled={problem.testCases.length === 1}
                      onPress={() => handleDelete(currentPage * problemsPerPage + problemIndex, testCaseIndex)}
                    >
                      <Icon icon="lucide:trash-2" width={20} />
                    </Button>
                    <Button
                      isIconOnly
                      variant="flat"
                      onPress={() => handleRefresh(currentPage * problemsPerPage + problemIndex, testCaseIndex)}
                    >
                      <Icon icon="lucide:refresh-cw" width={20} />
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Textarea
                      label={`Test Case ${testCaseIndex + 1} Input`}
                      value={testCase.input}
                      variant="bordered"
                      minRows={2} className={`w-[400px] ${Mode === "dark" ? "bg-[#27272a]" : "bg-white"}`}
                      onChange={(e) => handleTestCaseInputChange(currentPage * problemsPerPage + problemIndex, testCaseIndex, e.target.value)}
                    />
                    <Textarea
                      label={`Test Case ${testCaseIndex + 1} Output`}
                      value={testCase.output} minRows={2}
                      variant="bordered" className={`w-[400px] ${Mode === "dark" ? "bg-[#27272a]" : "bg-white"}`}
                      onChange={(e) => handleTestCaseOutputChange(currentPage * problemsPerPage + problemIndex, testCaseIndex, e.target.value)}
                    />
                  </div>
                </div>
              ))}

              <Button
                variant="flat"
                startContent={<Icon icon="lucide:plus" />}
                onPress={() => addTestCase(currentPage * problemsPerPage + problemIndex)}
                className="mt-2"
              >
                Add Test Case
              </Button>
            </div>
          ))}
          <div className="flex justify-between gap-44 items-center mt-4 ">
            <div>
              <Button onPress={handleSaveAll}>
                Save All
              </Button>
            </div>
            <div className="flex gap-2 items-center">
              <span className="mx-2">Page {currentPage + 1} of {totalPages}</span>
              <PaginationButtons
                currentIndex={currentPage+1}
                totalItems={totalPages}
                onPrevious={() => setCurrentPage(currentPage - 1)}
                onNext={() => setCurrentPage(currentPage + 1)} />
            </div>
            <div >
              <Button onPress={handleAddProblem} >
                Add Problem Solving Question
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}