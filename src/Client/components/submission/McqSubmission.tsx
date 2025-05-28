import React from 'react';
import { Card, Checkbox, Radio, RadioGroup } from '@heroui/react';

interface MCQOption {
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  isMultiSelect: boolean;
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
interface PageProps {
  readonly question: MCQQuestion;
  readonly setAnswers: React.Dispatch<React.SetStateAction<{ [key: string]: string | string[] }>>;
  readonly answers: { [key: string]: string | string[] };
  readonly options: string[];
}

export default function MCQSubmission({ question, answers, setAnswers, options }: PageProps) {
  const isMultiSelect = question.mcqOption.isMultiSelect;
  const questionId = question.questionId;
  const handleCheckboxChange = (option: string, isChecked: boolean) => {
    setAnswers((prevAnswers) => {
      const current = Array.isArray(prevAnswers[questionId]) 
        ? prevAnswers[questionId] as string[]
        : [];
      
      return {
        ...prevAnswers,
        [questionId]: isChecked 
          ? [...current, option]
          : current.filter(o => o !== option)
      };
    });
  };
  const handleRadioChange = (value: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value
    }));
  };
  const isOptionSelected = (option: string): boolean => {
    const answer = answers[questionId];
    if (Array.isArray(answer)) {
      return answer.includes(option);
    }
    return false;
  };

  return (
    <Card className="p-5 shadow-none bg-white dark:bg-[#18181b]">
      <div className="space-y-4 p-4 rounded-lg">
        <p>{question.statementMarkdown}</p>
        
        {isMultiSelect ? (
          <div className="space-y-3">
            {options.map((option,index) => (
              <div key={index} className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5">
                <Checkbox
                  value={option}
                  isSelected={isOptionSelected(option)}
                  onValueChange={(isChecked) => handleCheckboxChange(option, isChecked)}
                >
                  {option}
                </Checkbox>
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup 
            value={answers[questionId] as string || ""}
            onValueChange={handleRadioChange}>
            <div className="space-y-3">
              {options.map((option,index) => (
                <div key={index} className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5">
                  <Radio value={option}>
                    {option}
                  </Radio>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}
      </div>
    </Card>
  );
}