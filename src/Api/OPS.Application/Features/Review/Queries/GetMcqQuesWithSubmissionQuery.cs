﻿using ErrorOr;
using FluentValidation;
using MediatR;
using OPS.Application.Contracts.DtoExtensions;
using OPS.Application.Contracts.Dtos;
using OPS.Domain;

namespace OPS.Application.Features.Review.Queries;

public record GetMcqQuesWithSubmissionQuery(Guid ExamId, Guid AccountId)
    : IRequest<ErrorOr<List<McqQuesWithSubmissionResponse?>>>;

public class GetMcqQuesWithSubmissionQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetMcqQuesWithSubmissionQuery, ErrorOr<List<McqQuesWithSubmissionResponse?>>>
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    public async Task<ErrorOr<List<McqQuesWithSubmissionResponse?>>> Handle(
        GetMcqQuesWithSubmissionQuery request, CancellationToken cancellationToken)
    {
        var questions = await _unitOfWork.McqSubmission
            .GetMcqQuesWithSubmission(request.ExamId, request.AccountId, cancellationToken);

        return questions.Select(q => q.ToMcqWithSubmissionDto()).ToList();
    }
}

public class GetMcqQuesWithSubmissionQueryValidator : AbstractValidator<GetMcqQuesWithSubmissionQuery>
{
    public GetMcqQuesWithSubmissionQueryValidator()
    {
        RuleFor(x => x.ExamId)
            .NotEmpty()
            .NotEqual(Guid.Empty);

        RuleFor(x => x.AccountId)
            .NotEmpty()
            .NotEqual(Guid.Empty);
    }
}