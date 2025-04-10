'use client'

import { Card, Checkbox } from '@heroui/react'

interface Question {
  id: number
  title: string
  description: string
  points: number
}
interface PageProps {
 readonly question: Question
 readonly setAnswers: React.Dispatch<React.SetStateAction<{ [key: number]: string | string[] }>>
 readonly answers: { [key: number]: string | string[] }
 readonly options:string[]
}

/**
 * Renders a multiple-choice question card.
 *
 * This React component displays a card containing a multiple-choice question along with its title, description, and point value.
 * It renders checkboxes for each provided option and updates the selected answers using a functional state update. When a checkbox
 * is toggled, the component adds the option to the answer array if selected or removes it if deselected.
 *
 * @param props - The component properties:
 *   - question: An object with the question details (id, title, description, and points).
 *   - answers: An object mapping question IDs to their currently selected answers.
 *   - setAnswers: A function to update the answers state.
 *   - options: An array of strings representing the available answer options.
 *
 * @returns A JSX element representing the multiple-choice question card.
 */
export default function MCQSubmission({ question,answers,setAnswers,options}: PageProps) {
  const handleCheckboxChange = (questionId: number, option: string, isChecked: boolean) => {
      setAnswers((prevAnswers) => {
        const currentAnswers = prevAnswers[questionId] ?? []
        if (isChecked) {
          return { ...prevAnswers, [questionId]: [...(currentAnswers as string[]), option] }
        } else {
          return { ...prevAnswers, [questionId]: (currentAnswers as string[]).filter((o) => o !== option) }
        }
      })
    }
  return (
    <Card className=" p-5 shadow-none bg-white dark:bg-[#18181b]">
      <div className="w-full flex justify-between">
        <h2 className="text-lg font-semibold">{question.title}</h2>
        <p>points: {question.points}</p>
      </div>
      <div className={`space-y-4 p-4 rounded-lg `}>
        <p>{question.description}</p>
        {options.map((option) => (
          <div key={option} className="flex items-center gap-2 p-3 rounded-lg hover:bg-white/5">
            <Checkbox
              value={option}
              isSelected={Array.isArray(answers[question.id]) && (answers[question.id] as string[]).includes(option)}
              onValueChange={(isChecked) => handleCheckboxChange(question.id, option, isChecked)}
            >
              {option}
            </Checkbox>
          </div>
        ))}
      </div>
    </Card>
  )
}
