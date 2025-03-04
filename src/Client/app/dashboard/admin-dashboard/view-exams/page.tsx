"use client";

import React, { useState } from "react";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";

interface Exam {
  title: string;
  description: string;
  durationMinutes: number;
  opensAt: string;
  closesAt: string;
  status: "Published" | "Draft" | "Review Results";
  invitedCandidates: number | "N/A";
  acceptedCandidates: number | "N/A";
  problemSolving: number;
  written: number;
  mcq: number;
  score: number;
}

const Exams: Exam[] = [
  {
    title: "Star Coder 2026",
    description: "Published",
    durationMinutes: 60,
    opensAt: "2026-11-21T21:00:00.000Z",
    closesAt: "2026-11-21T22:20:00.000Z",
    status: "Published",
    invitedCandidates: 3068,
    acceptedCandidates: 2613,
    problemSolving: 10,
    written: 10,
    mcq: 30,
    score: 100,
  }, {
    title: "Star Coder 2026",
    description: "Published",
    durationMinutes: 60,
    opensAt: "2026-11-21T21:00:00.000Z",
    closesAt: "2026-11-21T22:20:00.000Z",
    status: "Published",
    invitedCandidates: 3068,
    acceptedCandidates: 2613,
    problemSolving: 10,
    written: 10,
    mcq: 30,
    score: 100,
  },
  {
    title: "Learnathon 4.0",
    description: "Draft",
    durationMinutes: 90,
    opensAt: "2026-12-10T21:00:00.000Z",
    closesAt: "2026-12-10T23:00:00.000Z",
    status: "Draft",
    invitedCandidates: "N/A",
    acceptedCandidates: "N/A",
    problemSolving: 10,
    written: 10,
    mcq: 30,
    score: 100,
  },
  {
    title: "Star Coder 2005",
    description: "Review Results",
    durationMinutes: 60,
    opensAt: "2025-11-21T21:00:00.000Z",
    closesAt: "2025-11-21T22:00:00.000Z",
    status: "Review Results",
    invitedCandidates: 3068,
    acceptedCandidates: 2613,
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
    <div className="dark:bg-gray-900 w-full flex flex-col justify-between h-screen">
      {paginatedExams.map((exam, index) => (
        <Card key={index} className="dark:bg-gray-900 relative w-full border-small">
          <CardHeader className="flex justify-between items-center w-full">
              <h1 className="text-2xl font-bold flex gap-1 items-end">
                {exam.title}
                <span className={`text-sm ${exam.status === "Published" ? "text-green-500" : exam.status === "Draft" ? "text-gray-500" : "text-blue-500"}`}>
                  {exam.description}
                </span>
              </h1>
              <div className="flex gap-2">
                {exam.status === "Published" ? (
                  <Button className="primary">Edit</Button>
                ) : exam.status === "Draft" ? (
                  <>
                    <Button className="primary">Edit</Button>
                    <Button className="bg-blue-500 text-white">Publish</Button>
                  </>
                ) : (
                  <Button className="bg-purple-500 text-white">Review</Button>
                )}
              </div>
          </CardHeader>

          <CardBody className="px-3">
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
              <div className="flex flex-col flex-1">
                <p>Invited Candidates: {exam.invitedCandidates}</p>
                <p>Accepted: {exam.acceptedCandidates}</p>
              </div>
            </div>
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