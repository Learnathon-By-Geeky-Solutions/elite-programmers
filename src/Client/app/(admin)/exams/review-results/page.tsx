'use client'

import React, { useState } from 'react'
import { Card, Button, Textarea, Select, SelectItem } from '@heroui/react'

interface TestCase {
  input: string
  expectedOutput: string
  receivedOutput: string
}

interface Question {
  id: number
  title: string
  description: string
  inputFormat?: string
  outputFormat?: string
  constraints?: string
  userSubmission?: string
  testCases: TestCase[]
  points: number
  maxPoints: number
  type: 'code' | 'written'
}

interface ExamSubmission {
  candidateId: string
  questions: Question[]
}

interface ExamData {
  title: string
  candidate: string
  totalScore: string
  examDuration: string
  problemSolving: string
  writtenQuestions: string
  mcq: string
  submissions: ExamSubmission[]
}

/**
 * Renders the exam submission review interface.
 *
 * This React component displays exam details including overall scores, candidate-specific submissions, and question data (both code and written). It allows users to select a candidate via a dropdown, navigate between submissions, review individual question details (with test case results for code questions), and flag questions for further review.
 *
 * @returns The rendered exam review interface.
 */
export default function Component() {
  const examData: ExamData[] = [
    {
      title: 'Learnathon 2.0',
      candidate: 'Candidate-1',
      totalScore: '100/100',
      examDuration: '0h 45m 31s',
      problemSolving: '50/50',
      writtenQuestions: '20/20',
      mcq: '30/30',
      submissions: [
        {
          candidateId: 'Candidate-1',
          questions: [
            {
              id: 1,
              title: 'Question #1',
              description: 'Write a program that takes two integers as input and prints their sum.',
              inputFormat: 'Two space-separated integers, a and b.',
              outputFormat: 'Print the sum of a and b.',
              constraints: '-10⁹ ≤ a, b ≤ 10⁹',
              userSubmission: `#include <bits/stdc++.h>
using namespace std;

int main() {
int a, b;
cin >> a >> b;
cout << "Candidate-1" << '\\n';
return 0;
}`,
              testCases: [
                {
                  input: '3 7',
                  expectedOutput: '10',
                  receivedOutput: '10',
                },
                {
                  input: '99999 -99999',
                  expectedOutput: '0',
                  receivedOutput: '0',
                },
              ],
              points: 5,
              maxPoints: 5,
              type: 'code',
            },
            {
              id: 8,
              title: 'Question #8',
              description: 'What is the difference between a deadlock and a livelock?',
              userSubmission:
                'A deadlock occurs when processes are stuck waiting for each other indefinitely, while a livelock happens when processes continuously change states but still make no progress.',
              testCases: [],
              points: -3,
              maxPoints: 5,
              type: 'written',
            },
          ],
        },
        {
          candidateId: 'Candidate-2',
          questions: [
            {
              id: 1,
              title: 'Question #1',
              description: 'Write a program that takes two integers as input and prints their sum.',
              inputFormat: 'Two space-separated integers, a and b.',
              outputFormat: 'Print the sum of a and b.',
              constraints: '-10⁹ ≤ a, b ≤ 10⁹',
              userSubmission: `
int main() {
    int x, y;
    scanf("%d %d", &x, &y);
    printf("Candidate-2");
    return 0;
}`,
              testCases: [
                {
                  input: '3 7',
                  expectedOutput: '10',
                  receivedOutput: '10',
                },
                {
                  input: '99999 -99999',
                  expectedOutput: '0',
                  receivedOutput: '0',
                },
              ],
              points: 4,
              maxPoints: 5,
              type: 'code',
            },
          ],
        },
      ],
    },
  ]

  const [flaggedCandidates, setFlaggedCandidates] = useState<{
    [candidateId: string]: { [questionId: number]: boolean }
  }>({})
  const [selectedCandidate, setSelectedCandidate] = useState('Candidate-1')
  const currentExamData = examData[0]
  const currentCandidateSubmission = currentExamData.submissions.find((sub) => sub.candidateId === selectedCandidate)
  const currentQ = currentCandidateSubmission?.questions || currentExamData.submissions[0].questions

  const handleCandidateChange = (value: string) => {
    setSelectedCandidate(value)
  }

  const handlePrevCandidate = () => {
    const currentIndex = currentExamData.submissions.findIndex((sub) => sub.candidateId === selectedCandidate)
    if (currentIndex > 0) {
      setSelectedCandidate(currentExamData.submissions[currentIndex - 1].candidateId)
    }
  }

  const handleNextCandidate = () => {
    const currentIndex = currentExamData.submissions.findIndex((sub) => sub.candidateId === selectedCandidate)
    if (currentIndex < currentExamData.submissions.length - 1) {
      setSelectedCandidate(currentExamData.submissions[currentIndex + 1].candidateId)
    }
  }
  const handleFlagChange = (candidateId: string, questionId: number) => {
    setFlaggedCandidates((prevFlags) => {
      const newFlags = { ...prevFlags }
      newFlags[candidateId] ??= {}
      newFlags[candidateId][questionId] = !newFlags[candidateId][questionId]
      return newFlags
    })
  }

  const isQuestionFlagged = (candidateId: string, questionId: number) => {
    return flaggedCandidates[candidateId]?.[questionId] ?? false
  }
  return (
    <div className="min-h-screen flex flex-col  justify-between">
      <h2 className="text-2xl font-bold text-center my-5">Review Results</h2>
      <div className="w-full px-12 border-none flex flex-col gap-4 ">
        <Card className="space-y-4 p-5 bg-white dark:bg-[#18181b] shadow-none">
          <h1 className="text-xl font-semibold w-full text-center">Exam: {currentExamData.title}</h1>

          <div className="flex flex-col gap-3 ">
            <div className="flex w-full items-center justify-between">
              <div className="flex gap-2 items-center">
                <span className="text-default-500">Candidate: </span>
                <Select
                  aria-label="Select a candidate"
                  className="w-80"
                  value={selectedCandidate}
                  onChange={(e: { target: { value: string } }) => handleCandidateChange(e.target.value)}
                >
                  {currentExamData.submissions.map((sub) => (
                    <SelectItem key={sub.candidateId}>{sub.candidateId}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  isDisabled={
                    currentExamData.submissions.findIndex((sub) => sub.candidateId === selectedCandidate) <= 0
                  }
                  onPress={handlePrevCandidate}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  isDisabled={
                    currentExamData.submissions.findIndex((sub) => sub.candidateId === selectedCandidate) >=
                    currentExamData.submissions.length - 1
                  }
                  onPress={handleNextCandidate}
                >
                  Next
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-default-500">Score: </span>
                {currentExamData.totalScore}
              </div>
              <div>
                <span className="text-default-500">Exam Duration: </span>
                {currentExamData.examDuration}
              </div>
            </div>

            <div className="flex  items-center justify-between">
              <div>
                <span className="text-default-500">Problem Solving: </span>
                {currentExamData.problemSolving}
              </div>
              <div>
                <span className="text-default-500">Written Questions: </span>
                {currentExamData.writtenQuestions}
              </div>
              <div>
                <span className="text-default-500">MCQ: </span>
                {currentExamData.mcq}
              </div>
            </div>
          </div>
        </Card>

        <div className="bg-white dark:bg-[#18181b] p-5 rounded-xl">
          <h2 className="w-full text-center ">{selectedCandidate}</h2>

          {currentQ.map((curr) => (
            <div key={curr.id} className="space-y-4">
              <h2 className="text-lg font-semibold">{curr.title}</h2>
              <p>{curr.description}</p>
              {curr.type === 'code' && (
                <>
                  {curr.inputFormat && (
                    <div>
                      <h3 className="font-semibold mb-1">Input Format:</h3>
                      <p>{curr.inputFormat}</p>
                    </div>
                  )}
                  {curr.outputFormat && (
                    <div>
                      <h3 className="font-semibold mb-1">Output Format:</h3>
                      <p>{curr.outputFormat}</p>
                    </div>
                  )}
                  {curr.constraints && (
                    <div>
                      <h3 className="font-semibold mb-1">Constraints:</h3>
                      <p>{curr.constraints}</p>
                    </div>
                  )}
                </>
              )}

              <div>
                <h3 className="font-semibold mb-2">{curr.type === 'code' ? 'User Submission' : 'User Answer'}</h3>
                <Card className={`p-4 rounded-lg  bg-[#eeeef0] dark:bg-[#27272a]`}>
                  <div className={`font-mono text-sm whitespace-pre-wrap p-2`}>{curr.userSubmission}</div>
                </Card>
              </div>

              {curr.type === 'code' && curr.testCases.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">
                    Test Cases (Passed {curr.testCases.length}/{curr.testCases.length})
                  </h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-4 p-3 rounded-lg">
                      <div className="text-xs text-default-500 mb-1">Input</div>
                      <div className="text-xs text-default-500 mb-1">Expected Output</div>
                      <div className="text-xs text-default-500 mb-1">Received Output</div>
                    </div>
                    {curr.testCases.map((testCase) => (
                      <div key={testCase.input} className="grid grid-cols-3 gap-4 p-3 ">
                        <div className={`p-3 font-mono text-sm h-20 rounded-lg bg-[#eeeef0] dark:bg-[#27272a]`}>
                          {testCase.input}
                        </div>
                        <div className={`p-3 font-mono text-sm h-20 rounded-lg  bg-[#eeeef0] dark:bg-[#27272a]`}>
                          {testCase.expectedOutput}
                        </div>
                        <div className={`p-3 font-mono text-sm h-20 rounded-lg bg-[#eeeef0] dark:bg-[#27272a]`}>
                          {testCase.receivedOutput}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Result</h3>
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-3">
                    <span>Points</span>
                    <input name="points" type="number" className="w-16" defaultValue={curr.points} />/{curr.maxPoints}
                  </div>
                  <Button size="sm" variant="flat">
                    <input
                      name="flag"
                      type="checkbox"
                      checked={isQuestionFlagged(selectedCandidate, curr.id)}
                      onChange={() => handleFlagChange(selectedCandidate, curr.id)}/>
                    Flag Solution
                  </Button>
                </div>
              </div>
              {isQuestionFlagged(selectedCandidate, curr.id) && (
                <Textarea className="bg-[#eeeef0] dark:bg-[#27272a] rounded-xl" placeholder="Flag reason" />
              )}

              <div className="w-full flex justify-center">
                <Button className="my-3" color="primary">
                  Save
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
