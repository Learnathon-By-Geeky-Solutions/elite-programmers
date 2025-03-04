'use client';
import React, { useState } from "react";
import { Button, Textarea, Checkbox } from "@heroui/react";

interface WrittenQuestion {
  id?: string;
  question: string;
  isShortAnswer: boolean;
  isLongAnswer: boolean;
  shortAnswerText?: string;
  longAnswerText?: string;
}

export default function App() {
  const [writtenQuestions, setWrittenQuestions] = useState<WrittenQuestion[]>([
    { question: "", isShortAnswer: false, isLongAnswer: false }
  ]);
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 1;

  const handleAddWrittenQuestion = () => {
    setWrittenQuestions(prevQuestions => {
      const newQuestions: WrittenQuestion[]= [...prevQuestions, { question: "", isShortAnswer: false, isLongAnswer: false }];
      const newTotalPages = Math.ceil(newQuestions.length / questionsPerPage);
      setCurrentPage(newTotalPages - 1);
      
      return newQuestions;
    });
  };

  const handleQuestionChange = (questionIndex: number, newQuestion: string) => {
    setWrittenQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex] = { ...updatedQuestions[questionIndex], question: newQuestion };
      return updatedQuestions;
    });
  };

  const handleShortAnswerChange = (questionIndex: number, isChecked: boolean) => {
    setWrittenQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        isShortAnswer: isChecked,
        isLongAnswer: !isChecked,
        shortAnswerText: isChecked ? "" : undefined, 
        longAnswerText: undefined 
      };
      return updatedQuestions;
    });
  };

  const handleLongAnswerChange = (questionIndex: number, isChecked: boolean) => {
    setWrittenQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        isLongAnswer: isChecked,
        isShortAnswer: !isChecked,
        longAnswerText: isChecked ? "" : undefined,
        shortAnswerText: undefined 
      };
      return updatedQuestions;
    });
  };

  const totalPages = Math.ceil(writtenQuestions.length / questionsPerPage);
  const currentQuestions = writtenQuestions.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col items-center pt-32 shadow">
      <h2 className="text-2xl">Written Question : {currentPage+1}</h2>
      <div className="w-full max-w-5xl">
        {currentQuestions.map((question, questionIndex) => (
          <div key={questionIndex} className="border p-4 rounded-lg shadow-md mt-4">
            <Textarea
              label="Written Question"
              name="question"
              minRows={4}
              variant="bordered"
              value={question.question}
              onChange={(e) => handleQuestionChange(currentPage * questionsPerPage + questionIndex, e.target.value)}
            />

            <div className="flex items-center gap-4">
              <label>
                <Checkbox
                  checked={question.isShortAnswer}
                  onChange={(e) => handleShortAnswerChange(currentPage * questionsPerPage + questionIndex, e.target.checked)}
                  isDisabled={question.isLongAnswer}
                >
                  Short Answer
                </Checkbox>
              </label>
              <label>
                <Checkbox
                  checked={question.isLongAnswer}
                  onChange={(e) => handleLongAnswerChange(currentPage * questionsPerPage + questionIndex, e.target.checked)}
                  isDisabled={question.isShortAnswer}
                >
                  Long Answer
                </Checkbox>
              </label>
            </div>
            {question.isShortAnswer && (
              <p className="mt-2">Short answer</p>
            )}
            {question.isLongAnswer && (
             <p className="mt-2">Long answer</p>
            )}
          </div>
        ))}

        <div className="flex justify-end mt-10">
          <Button color="primary" onPress={handleAddWrittenQuestion}>
            Add Written Question
          </Button>
        </div>

        <div className="flex justify-center items-center my-5">
          <Button onPress={goToPreviousPage} disabled={currentPage === 0}>Previous</Button>
          <span className="mx-2">Page {currentPage + 1} of {totalPages}</span>
          <Button onPress={goToNextPage} disabled={currentPage === totalPages - 1}>Next</Button>
        </div>
      </div>
    </div>
  );
}