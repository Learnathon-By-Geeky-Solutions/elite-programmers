﻿using OPS.Application.Contracts.Dtos;
using OPS.Domain.Entities.Exam;
using QuestionType = OPS.Domain.Enums.QuestionType;

namespace OPS.Application.Contracts.DtoExtensions;

public static class ExamExtensions
{
    public static ExamResponse ToDto(this Examination exam)
    {
        return new ExamResponse(
            exam.Id,
            exam.Title,
            exam.DescriptionMarkdown,
            exam.DurationMinutes,
            GetExamStatus(exam),
            exam.OpensAt,
            exam.ClosesAt,
            exam.CreatedAt,
            exam.UpdatedAt,
            exam.IsActive
        );
    }

    public static ExamWithQuestionsResponse ToDtoWithQuestions(this Examination exam)
    {
        var problemQuestions = exam.Questions
            .Where(q => q.QuestionTypeId == (int)QuestionType.ProblemSolving)
            .Select(q => q.ToProblemQuestionDto())
            .ToList();

        var writtenQuestions = exam.Questions
            .Where(q => q.QuestionTypeId == (int)QuestionType.Written)
            .Select(q => q.ToWrittenQuestionDto())
            .ToList();

        var mcqQuestions = exam.Questions
            .Where(q => q.QuestionTypeId == (int)QuestionType.MCQ)
            .Select(q => q.ToMcqQuestionDto())
            .ToList();

        return new ExamWithQuestionsResponse(
            exam.Id,
            exam.Title,
            exam.DescriptionMarkdown,
            exam.DurationMinutes,
            GetExamStatus(exam),
            exam.OpensAt,
            exam.ClosesAt,
            new QuestionResponses(
                problemQuestions,
                writtenQuestions,
                mcqQuestions
            )
        );
    }

    public static OngoingExamResponse ToOngoingExamDto(this Examination exam)
    {
        var problemQuestionsWithSubmissions = exam.Questions
            .Where(q => q.QuestionTypeId == (int)QuestionType.ProblemSolving)
            .Select(q => q.ToQuesProblemSubmissionDto())
            .ToList();

        var writtenQuestionsWithSubmissions = exam.Questions
            .Where(q => q.QuestionTypeId == (int)QuestionType.Written)
            .Select(q => q.ToWrittenWithSubmissionDto())
            .ToList();

        var mcqQuestionsWithSubmissions = exam.Questions
            .Where(q => q.QuestionTypeId == (int)QuestionType.MCQ)
            .Select(q => q.ToMcqWithSubmissionDto())
            .ToList();

        return new OngoingExamResponse(
            exam.Id,
            exam.Title,
            exam.DescriptionMarkdown,
            exam.DurationMinutes,
            GetExamStatus(exam),
            exam.OpensAt,
            exam.ClosesAt,
            new QuestionsWithSubmission(
                problemQuestionsWithSubmissions,
                writtenQuestionsWithSubmissions,
                mcqQuestionsWithSubmissions
            )
        );
    }

    private static string GetExamStatus(Examination exam)
    {
        var now = DateTime.UtcNow;

        return now switch
        {
            _ when now < exam.OpensAt => "Scheduled",
            _ when now > exam.ClosesAt => "Ended",
            _ => "Running"
        };
    }
}