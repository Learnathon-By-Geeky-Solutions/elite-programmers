export interface MCQOption {
    id: number;
    text: string;
}
export interface MCQQuestion {
    questionId?: string;
    question: string;
    points: number;
    options: MCQOption[];
    correctOptions: number[];
    difficultyType: string;
}
export interface ExistingQuestion {
    questionId?: string;
    statementMarkdown: string;
    score: number;
    difficultyType: string;
    mcqOption: {
        option1: string;
        option2: string;
        option3: string;
        option4: string;
        isMultiSelect: boolean;
        answerOptions: string;
    };
}
export interface MCQFormProps {
    readonly examId: string;
    readonly existingQuestions: ExistingQuestion[];
    readonly mcqPoints: (points: number) => void;
    onFocus: () => void;
    onBlur: () => void;
}
export interface MCQOptions {
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    isMultiSelect: boolean;
    answerOptions: string;
}
export interface McqQuestion {
    questionId: string;
    examId: string;
    questionType: string;
    statementMarkdown: string;
    score: number;
    difficultyType: string;
    mcqOption: MCQOptions;
    answerOptions: string;
}
