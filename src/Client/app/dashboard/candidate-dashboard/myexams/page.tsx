"use client";

import React, { useState } from "react";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";

interface Exam {
  title: string;
  description: string;
  durationMinutes: number;
  opensAt: string;
  closesAt: string;
  status: "Running" | "Upcoming" | "Ended";
  problemSolving: number;
  written: number;
  mcq: number;
  score: number;
}

const Exams: Exam[] = [
  {
    title: "Star Coder 2026",
    description: "Running",
    durationMinutes: 60,
    opensAt: "2026-11-21T21:00:00.000Z",
    closesAt: "2026-11-21T22:20:00.000Z",
    status: "Running",
    problemSolving: 10,
    written: 10,
    mcq: 30,
    score: 100,
  },
  {
    title: "Learnathon 4.0",
    description: "Upcoming",
    durationMinutes: 90,
    opensAt: "2026-12-10T21:00:00.000Z",
    closesAt: "2026-12-10T23:00:00.000Z",
    status: "Upcoming",
    problemSolving: 10,
    written: 10,
    mcq: 30,
    score: 100,
  },
  {
    title: "Star Coder 2005",
    description: "Ended",
    durationMinutes: 60,
    opensAt: "2025-11-21T21:00:00.000Z",
    closesAt: "2025-11-21T22:00:00.000Z",
    status: "Ended",
    problemSolving: 10,
    written: 10,
    mcq: 30,
    score: 100,
  },
];

const ITEMS_PER_PAGE = 3;

export default function ExamList() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(Exams.length / ITEMS_PER_PAGE);

  const paginatedExams = Exams.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="mx-auto flex flex-col items-center mt-3">
      {paginatedExams.map((exam, index) => (
        <Card key={index} className="relative w-full border-small mb-3 p-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold w-full">
                {exam.title} <span className={`text-sm ${exam.status === "Upcoming" ? "text-green-500" : exam.status === "Ended" ? "text-gray-500" : "text-red-500"}`}>{exam.description}</span>
              </h1>
              {exam.status === "Running" && (
                <div className="flex justify-end"><Button color="primary" className="ml-96">View Exam</Button></div>
              )}
            </div>
          </CardHeader>
          <CardBody className="px-3">
            {exam.status === 'Ended' ? (
              <div className="text-center">
                <div className="flex justify-between">
                  <p>Date: {new Date(exam.opensAt).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p>Score: 100/100</p>
                  <p>Participants: 3068</p>
                </div>
                <p className="font-semibold mt-7">Result hasn&apos;t been published.</p>
              </div>
            ) : (
              <div className="flex">
                <div className="flex flex-col flex-1">
                  <p>Date: {new Date(exam.opensAt).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p>Duration: {exam.durationMinutes / 60} hr</p>
                  <p>Starts at: {new Date(exam.opensAt).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}</p>
                  <p>Closes at: {new Date(exam.closesAt).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="flex flex-col flex-1">
                  <p>Problem Solving: {exam.problemSolving}</p>
                  <p>Written: {exam.written}</p>
                  <p>MCQ: {exam.mcq}</p>
                  <p>Score: {exam.score}</p>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      ))}
      <div className="flex justify-center items-center my-4">
        <Button disabled={currentPage === 1} onPress={() => setCurrentPage(currentPage - 1)}>Previous</Button>
        <span className="mx-4">Page {currentPage} of {totalPages}</span>
        <Button disabled={currentPage === totalPages} onPress={() => setCurrentPage(currentPage + 1)}>Next</Button>
      </div>
    </div>
  );
}
