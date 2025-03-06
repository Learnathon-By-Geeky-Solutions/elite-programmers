﻿using OPS.Application.Contracts.Dtos;
using OPS.Domain.Entities.Exam;

namespace OPS.Application.Contracts.DtoExtensions;

public static class McqQuestionExtensions
{
    public static McqQuestionResponse OptionsToDto(this Question question,List<McqOptionResponse> options)
    {
        return new McqQuestionResponse(
            Id : question.Id,
            StatementMarkdown: question.StatementMarkdown,
            Score: question.Points,
            ExaminationId : question.ExaminationId,
            DifficultyId: question.DifficultyId,
            QuestionTypeId : question.QuestionTypeId,
            CreatedAt : question.CreatedAt,
            UpdatedAt : question.UpdatedAt,
            IsActive : question.IsActive,
            McqOptions : options
        );
    }
}