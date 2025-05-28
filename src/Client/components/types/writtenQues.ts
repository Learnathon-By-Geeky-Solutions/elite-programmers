export interface WrittenQuestion {
  questionId: string;
  examId: string;
  questionType: string;
  hasLongAnswer: boolean;
  statementMarkdown: string;
  score: number;
  difficultyType: string;
}

export interface WrittenQuestionForm {
    id: string;
    questionId: string;
    question: string;
    points: number;
    difficultyType: string;
    isShortAnswer: boolean;
    isLongAnswer: boolean;
}
export interface ExistingQuestion {
    questionId: string;
    statementMarkdown: string;
    score: number;
    difficultyType: string;
    hasLongAnswer: boolean;
}
export interface WrittenQuestionFormProps {
    readonly examId: string;
    readonly existingQuestions: ExistingQuestion[];
    readonly writtenPoints: (points: number) => void;
    onFocus: () => void;
    onBlur: () => void;
}
