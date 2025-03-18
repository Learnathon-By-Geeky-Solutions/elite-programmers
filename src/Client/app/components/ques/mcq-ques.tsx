'use client'

import React from 'react'
import { Form, Button, Textarea, Card, CardBody, CardHeader, RadioGroup, Radio } from '@heroui/react'
import { Icon } from '@iconify/react'
import PaginationButtons from '@/app/components/ui/pagination-button'

interface MCQOption {
  id: number
  text: string
}

interface MCQQuestion {
  id?: string
  question: string
  options: MCQOption[]
  correctOption: number
}

export default function App() {
  const [questions, setQuestions] = React.useState<MCQQuestion[]>([
    {
      question: '',
      options: [
        { id: 1, text: '' },
        { id: 2, text: '' },
        { id: 3, text: '' },
        { id: 4, text: '' },
      ],
      correctOption: 1,
    },
  ])

  const [currentPage, setCurrentPage] = React.useState(0)

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[index].question = value
    setQuestions(newQuestions)
  }

  const handleOptionChange = (questionIndex: number, optionId: number, value: string) => {
    const newQuestions = [...questions]
    const optionIndex = newQuestions[questionIndex].options.findIndex((opt) => opt.id === optionId)
    newQuestions[questionIndex].options[optionIndex].text = value
    setQuestions(newQuestions)
  }

  const handleCorrectOptionChange = (questionIndex: number, value: number) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].correctOption = value
    setQuestions(newQuestions)
  }

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: [
          { id: 1, text: '' },
          { id: 2, text: '' },
          { id: 3, text: '' },
          { id: 4, text: '' },
        ],
        correctOption: 1,
      },
    ])
    setCurrentPage(questions.length)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="flex justify-center ">
      <Form id="#" className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
        {questions.length > 0 && (
          <Card key={currentPage} className="w-full">
            <CardHeader className="flex flex-col gap-2">
              <div className="text-default-500">MCQ Question {currentPage + 1}</div>
              <Textarea
                label="Question"
                placeholder="Enter your question here..."
                value={questions[currentPage].question}
                variant="bordered"
                onChange={(e) => handleQuestionChange(currentPage, e.target.value)}
              />
            </CardHeader>
            <CardBody className="flex flex-col gap-4 ">
              <div className="grid grid-cols-2 gap-4">
                {questions[currentPage].options.map((option) => (
                  <Textarea
                    key={option.id}
                    label={`Option ${option.id}`}
                    placeholder={`Enter option ${option.id}`}
                    value={option.text}
                    minRows={2}
                    variant="bordered"
                    onChange={(e) => handleOptionChange(currentPage, option.id, e.target.value)}
                  />
                ))}
              </div>

              <RadioGroup
                label="Correct Answer"
                value={questions[currentPage].correctOption.toString()}
                onValueChange={(value) => handleCorrectOptionChange(currentPage, parseInt(value))}
              >
                {questions[currentPage].options.map((option) => (
                  <div key={option.id} className="flex flex-row flex-wrap items-center ">
                    <Radio value={option.id.toString()}>Option {option.id}</Radio>
                  </div>
                ))}
              </RadioGroup>
            </CardBody>
          </Card>
        )}

        <div className="flex justify-between gap-2">
          <PaginationButtons
            currentIndex={currentPage + 1}
            totalItems={questions.length}
            onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            onNext={() => setCurrentPage((prev) => Math.min(prev + 1, questions.length - 1))}
          />
          <Button startContent={<Icon icon="lucide:plus" />} onPress={addNewQuestion}>
            Add New Question
          </Button>

          <Button className="ml-44 mb-10" type="submit">
            Save All Questions
          </Button>
        </div>
      </Form>
    </div>
  )
}
