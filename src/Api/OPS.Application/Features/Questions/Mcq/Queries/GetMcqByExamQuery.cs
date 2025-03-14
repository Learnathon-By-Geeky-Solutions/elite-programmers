﻿using ErrorOr;
using FluentValidation;
using MediatR;
using OPS.Application.Contracts.DtoExtensions;
using OPS.Application.Contracts.Dtos;
using OPS.Domain;

namespace OPS.Application.Features.Questions.Mcq.Queries;

public record GetMcqByExamQuery(Guid ExamId) : IRequest<ErrorOr<List<McqQuestionResponse>>>;

public class GetMcqByExamQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetMcqByExamQuery, ErrorOr<List<McqQuestionResponse>>>
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    public async Task<ErrorOr<List<McqQuestionResponse>>> Handle(GetMcqByExamQuery request, CancellationToken cancellationToken)
    {
        var questions = await _unitOfWork.Question.GetMcqByExamIdAsync(request.ExamId, cancellationToken);

        return questions.Select(q => q.ToMcqQuestionDto()).ToList();
    }
}

public class GetMcqByExamQueryValidator : AbstractValidator<GetMcqByExamQuery>
{
    public GetMcqByExamQueryValidator()
    {
        RuleFor(x => x.ExamId)
            .NotEmpty()
            .NotEqual(Guid.Empty);
    }
}