﻿using ErrorOr;
using FluentValidation;
using MediatR;
using OPS.Application.Contracts.DtoExtensions;
using OPS.Application.Contracts.Dtos;
using OPS.Domain;
using OPS.Domain.Contracts.Core.Authentication;
using OPS.Domain.Entities.Submit;

namespace OPS.Application.Features.Submissions.Commands;

public record SaveMcqSubmissionCommand(
    Guid QuestionId,
    string AnswerOptions) : IRequest<ErrorOr<McqSubmitResponse>>;

public class SaveMcqSubmissionCommandHandler(IUnitOfWork unitOfWork, IUserInfoProvider userInfoProvider)
    : IRequestHandler<SaveMcqSubmissionCommand, ErrorOr<McqSubmitResponse>>
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IUserInfoProvider _userInfoProvider = userInfoProvider;

    public async Task<ErrorOr<McqSubmitResponse>> Handle(
        SaveMcqSubmissionCommand request, CancellationToken cancellationToken)
    {
        var userAccountId = _userInfoProvider.AccountId();

        var question = await _unitOfWork.Question.GetWithMcqOption(request.QuestionId, cancellationToken);
        if (question == null) return Error.NotFound();

        var submission = new McqSubmission
        {
            AnswerOptions = request.AnswerOptions,
            Score = question.McqOption!.AnswerOptions == request.AnswerOptions ? question.Points : 0,
            AccountId = userAccountId,
            McqOptionId = question.McqOption!.Id,
            QuestionId = question.Id
        };

        var existingSubmission = await _unitOfWork.McqSubmission
            .GetByAccountIdAsync(request.QuestionId, userAccountId, cancellationToken);

        if (existingSubmission is null)
        {
            _unitOfWork.McqSubmission.Add(submission);
        }
        else
        {
            existingSubmission.AnswerOptions = submission.AnswerOptions;
            existingSubmission.Score = submission.Score;
            submission = existingSubmission;
        }

        await _unitOfWork.CommitAsync(cancellationToken);

        return submission.ToDto();
    }
}

public class SaveMcqSubmissionCommandValidator : AbstractValidator<SaveMcqSubmissionCommand>
{
    public SaveMcqSubmissionCommandValidator()
    {
        RuleFor(x => x.QuestionId)
            .NotEmpty()
            .NotEqual(Guid.Empty);

        RuleFor(x => x.AnswerOptions)
            .NotEmpty()
            .Matches("^([1-4](,[1-4]){0,3})?$")
            .WithMessage("AnswerOptions must contain numbers 1-4, separated by commas.");
    }
}