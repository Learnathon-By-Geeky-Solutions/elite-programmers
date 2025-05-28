'use client'

export interface TestCase {
  testCaseId?: string;
  input: string;
  output: string;  
  receivedOutput?: string;
  status?: 'success' | 'error' | 'pending';
}
export interface ProblemQuestion {
  questionId: string;
  examId: string;
  questionType: string;
  statementMarkdown: string;
  points: number;
  difficultyType: string;
  testCases: TestCase[];
}
interface WrittenQuestion {
    questionId: string;
    examId: string;
    questionType: string;
    hasLongAnswer: boolean;
    statementMarkdown: string;
    score: number;
    difficultyType: string;
}


interface MCQOption {
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    isMultiSelect: boolean;
    answerOptions: string;
}


interface MCQQuestion {
    questionId: string;
    examId: string;
    questionType: string;
    statementMarkdown: string;
    score: number;
    difficultyType: string;
    mcqOption: MCQOption;
}


interface Questions {
    problem: ProblemQuestion[];
    written: WrittenQuestion[];
    mcq: MCQQuestion[];
}


interface QuestionData {
    questions: Questions;
    submits: {
        problem: [];
        written: [];
        mcq: [];
    };
}
interface PageProps {
  currentPage: number;
  questions: QuestionData;
}


export default function getQuestionsForCurrentPage({ currentPage, questions }: PageProps) {
    const problemQuestions = questions.questions.problem;
    const writtenAndMcqQuestions = [
        ...questions.questions.written,
        ...questions.questions.mcq,
    ];


    if (currentPage <= problemQuestions.length) {
        return [problemQuestions[currentPage - 1]];
    } else {
        const adjustedPage = currentPage - problemQuestions.length;
        const startIndex = (adjustedPage - 1) * 5;
        const endIndex = startIndex + 5;
        return writtenAndMcqQuestions.slice(startIndex, endIndex);
    }
}
