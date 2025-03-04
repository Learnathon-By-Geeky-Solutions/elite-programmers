'use client'
import React, { useState } from "react";
import { Card, CardBody, Button, Checkbox, Pagination } from "@heroui/react";
import CodeEditor from './code-editor/page'
interface Question {
  id: number;
  title: string;
  description: string;
  type: "code" | "written" | "mcq";
  options?: string[];
  points:number
}

export default function Component() {
  const [currentPage, setCurrentPage] = useState(1);
  const [timeLeft, setTimeLeft] = useState(3600); 
  const [agreedToTerms, setAgreedToTerms] = useState({
    capture: false,
    screenMonitor: false,
    audio: false,
    clipboard: false
  });
  const [examStarted, setExamStarted] = React.useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({}); 
  const examData = {
    title: "Star Coder 2025",
    totalQuestions: 3,
    duration: "1:00:00",
    problemSolving: 10,
    written: 10,
    mcq: 30,
    totalScore: 100
  };

  const questions: Question[] = [
    {
      id: 1,
      title: "Question #1",
      description: "What is the difference between var, let, and const in JavaScript?",
      type: "written",
      points:3
    },
    {
      id: 2,
      title: "Question #2",
      description: "Which of the following is true about React hooks?",
      type: "mcq",
      options: [
        "They can only be used in class components",
        "They must be called at the top level of a component",
        "They can be called conditionally",
        "They can only be used in functional components"
      ],
      points:3
    },{
            id: 3,
            title: "Question #3",
            description: "",
            type: "code",
            points:10
        }
  ];

  React.useEffect(() => {
    if (examStarted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [examStarted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!examStarted) {
    return (
      <div className="pt-12 dark:bg-gray-900 dark:h-screen">
        <Card className="max-w-3xl mx-auto  border-none">
          <CardBody>
            <div className="space-y-3">
              <div>
                <h1 className="text-2xl font-bold">{examData.title}</h1>
                <span className="text-sm text-default-500">Running</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Date: Friday, 21 Nov 2026</div>
                <div className="text-right">Problem Solving: {examData.problemSolving}</div>
                <div>Starts at: 9:00 PM</div>
                <div className="text-right">Written: {examData.written}</div>
                <div>Closes at: 10:20 PM</div>
                <div className="text-right">MCQ: {examData.mcq}</div>
                <div>Duration: {examData.duration}</div>
                <div className="text-right">Score: {examData.totalScore}</div>
              </div>
             <hr className="my-2"/>
              <div className="space-y-2 ">
                <h2 className="text-lg font-semibold">Instructions</h2>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Please ensure your webcam and microphone are enabled throughout the exam.</li>
                  <li>Your face must be clearly visible in the webcam at all times, and your eyes should remain on the screen.</li>
                  <li>There should be no one else visible in the webcam area during the exam.</li>
                 </ol>
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold">Please read and agree to the following terms to proceed with the exam:</h3>
                <div className="space-y-2 text-sm">
                  <Checkbox
                    isSelected={agreedToTerms.capture}
                    onValueChange={(value) => setAgreedToTerms(prev => ({...prev, capture: value}))}
                  >
                    I agree that images will be captured of me every 5 seconds.
                  </Checkbox>
                  <Checkbox
                    isSelected={agreedToTerms.screenMonitor}
                    onValueChange={(value) => setAgreedToTerms(prev => ({...prev, screenMonitor: value}))}
                  >
                    I agree that my screen will be monitored during the exam.
                  </Checkbox>
                  <Checkbox
                    isSelected={agreedToTerms.audio}
                    onValueChange={(value) => setAgreedToTerms(prev => ({...prev, audio: value}))}
                  >
                    I agree that my audio will be recorded throughout the exam.
                  </Checkbox>
                  <Checkbox
                    isSelected={agreedToTerms.clipboard}
                    onValueChange={(value) => setAgreedToTerms(prev => ({...prev, clipboard: value}))}
                  >
                    I agree that my clipboard activity will be tracked.
                  </Checkbox>
                </div>
              </div>

              <Button
                color="primary"
                className="w-full"
                isDisabled={!Object.values(agreedToTerms).every(Boolean)}
                onPress={() => setExamStarted(true)}
              >
                Start Exam
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions.length > 0 ? questions[currentPage - 1] : null;

  if (!currentQuestion) {
    return (
      <div className=" text-white">
        <div className="flex justify-center items-center h-full">
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="">
       {examStarted && (  <div className="pt-14 border-b border-white/10 p-4 z-50 shadow "> 
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 ">
          <span className="font-bold dark:text-white">{examData.title}</span>
        </div>
        <div className="flex items-center gap-4 dark:text-white">
          <div>
          Questions Left: {examData.totalQuestions - currentPage}/{examData.totalQuestions}
          </div>
          <div className={` font-mono ${timeLeft < 300 ? 'text-danger' : ''}`}>
            Time Left: {formatTime(timeLeft)}
          </div>
          <Button color="primary" size="sm">
            Submit Exam
          </Button>
        </div>
      </div>
    </div>
      )}
      <div className="pt-5 dark:bg-gray-900 dark:h-screen">
      <Card className="w-16xl px-5 border-none px-8">
          <CardBody className="space-y-4">
           <div className="w-full flex justify-between"> <h2 className="text-lg font-semibold">{currentQuestion.title}</h2>
           <p>points : {currentQuestion.points}</p></div>
            {currentQuestion.type === "mcq" && currentQuestion.options && (
              <div className="space-y-2 dark:bg-[#27272a]">
                  <p>{currentQuestion.description}</p>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 rounded-lg hover:bg-white/5">
                    <Checkbox value={option}>{option}</Checkbox>
                  </div>
                ))}
              </div>
            )}

            {currentQuestion.type === "written" && (
              <>  <p>{currentQuestion.description}</p>
              <textarea
                className="w-full h-32 border border-white/10 rounded-lg p-3  dark:bg-[#27272a]"
                placeholder="Type your answer here..."
                value={answers[currentQuestion.id] || ""}  
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [currentQuestion.id]: e.target.value, 
                  })
                }
              /></>
            )}

            {currentQuestion.type === "code" && <CodeEditor />}
          </CardBody>
       
        <div className="flex justify-center py-6 ">
          <Pagination
            total={examData.totalQuestions}
            page={currentPage}
            onChange={setCurrentPage}
            color="primary"
            showControls
            className="gap-2"
          />
        </div></Card>
      </div>
    </div>
  );
}