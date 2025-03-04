'use client'
import React, { useState } from "react";
import { Card, CardBody, Button, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

interface TestCase {
  input: string;
  expectedOutput: string;
  receivedOutput: string;
}

interface Question {
  id: number;
  title: string;
  description: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  userSubmission?: string;
  testCases: TestCase[];
  points: number;
  maxPoints: number;
  type: "code" | "written";
}

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const examData = {
    title: "Learnathon 3.0",
    candidate: "Zaid",
    totalScore: "100/100",
    examDuration: "0h 45m 31s",
    problemSolving: "50/50",
    writtenQuestions: "20/20",
    mcq: "30/30",
  };

  const questions: Question[] = [
    {
      id: 1,
      title: "Question #1",
      description: "Write a program that takes two integers as input and prints their sum.",
      inputFormat: "Two space-separated integers, a and b.",
      outputFormat: "Print the sum of a and b.",
      constraints: "-10⁹ ≤ a, b ≤ 10⁹",
      userSubmission: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << '\\n';
    return 0;
}`,
      testCases: [
        {
          input: "3 7",
          expectedOutput: "10",
          receivedOutput: "10"
        },
        {
          input: "99999 -99999",
          expectedOutput: "0",
          receivedOutput: "0"
        }
      ],
      points: 5,
      maxPoints: 5,
      type: "code"
    },
    {
      id: 8,
      title: "Question #8",
      description: "What is the difference between a deadlock and a livelock?",
      userSubmission: "A deadlock occurs when processes are stuck waiting for each other indefinitely, while a livelock happens when processes continuously change states but still make no progress.",
      testCases: [],
      points: -3,
      maxPoints: 5,
      type: "written"
    }
  ];

  const currentQ = questions[currentQuestion];

  return (
    <div className="">
      <Card className="max-w-6xl mx-auto  border-none h-[740px]">
        <CardBody>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">Exam: {examData.title}</h1>
              <div className="flex gap-2">
                <Button color="primary"
                  size="sm"
                  isDisabled={currentQuestion === 0}
                  onPress={() => setCurrentQuestion(prev => prev - 1)}>
                  Previous
                </Button>
                <Button color="primary"
                  size="sm"
                  isDisabled={currentQuestion === questions.length - 1}
                  onPress={() => setCurrentQuestion(prev => prev + 1)}>
                  Next
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-default-500">Candidate: </span>
                {examData.candidate}
              </div>
              <div className="text-right">
                <span className="text-default-500">Score: </span>
                {examData.totalScore}
              </div>
              <div>
                <span className="text-default-500">Problem Solving: </span>
                {examData.problemSolving}
              </div>
              <div className="text-right">
                <span className="text-default-500">Exam Duration: </span>
                {examData.examDuration}
              </div>
              <div>
                <span className="text-default-500">Written Questions: </span>
                {examData.writtenQuestions}
              </div>
              <div className="text-right">
                <span className="text-default-500">MCQ: </span>
                {examData.mcq}
              </div>
            </div>
          </div>

          <Divider className="my-3" />
          <div className="space-y-4 h-[420px]">
            <h2 className="text-lg font-semibold">{currentQ.title}</h2>
            <p>{currentQ.description}</p>

            {currentQ.type === "code" && (
              <>
                {currentQ.inputFormat && (
                  <div>
                    <h3 className="font-semibold mb-1">Input Format:</h3>
                    <p>{currentQ.inputFormat}</p>
                  </div>
                )}
                {currentQ.outputFormat && (
                  <div>
                    <h3 className="font-semibold mb-1">Output Format:</h3>
                    <p>{currentQ.outputFormat}</p>
                  </div>
                )}
                {currentQ.constraints && (
                  <div>
                    <h3 className="font-semibold mb-1">Constraints:</h3>
                    <p>{currentQ.constraints}</p>
                  </div>
                )}
              </>
            )}

            <div>
              <h3 className="font-semibold mb-2">
                {currentQ.type === "code" ? "User Submission" : "User Answer"}
              </h3>
              <div className=" p-4 rounded-lg">
                <pre className="font-mono text-sm whitespace-pre-wrap">
                  {currentQ.userSubmission}
                </pre>
              </div>
            </div>

            {currentQ.type === "code" && currentQ.testCases.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Test Cases (Passed {currentQ.testCases.length}/{currentQ.testCases.length})</h3>
                <div className="space-y-2">
                  {currentQ.testCases.map((testCase, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 p-3 rounded-lg">
                      <div>
                        <div className="text-xs text-default-500 mb-1">Input</div>
                        <div className="font-mono text-sm">{testCase.input}</div>
                      </div>
                      <div>
                        <div className="text-xs text-default-500 mb-1">Expected Output</div>
                        <div className="font-mono text-sm">{testCase.expectedOutput}</div>
                      </div>
                      <div>
                        <div className="text-xs text-default-500 mb-1">Received Output</div>
                        <div className="font-mono text-sm">{testCase.receivedOutput}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Result</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span>Points</span>
                  <div className=" px-3 py-1 rounded">
                    {currentQ.points}/{currentQ.maxPoints}
                  </div>
                </div>
                <Button size="sm" variant="flat">
                  <Icon icon="lucide:flag" className="mr-1" />
                  Flag Solution
                </Button>
              </div>
            </div>

            <div className="flex justify-between py-4">
              <Button
                size="sm"
                
                isDisabled={currentQuestion === 0}
                onPress={() => setCurrentQuestion(prev => prev - 1)}
              >
                Previous
              </Button>
              <Button
                size="sm"
           
                isDisabled={currentQuestion === questions.length - 1}
                onPress={() => setCurrentQuestion(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}