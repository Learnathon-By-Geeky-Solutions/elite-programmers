using ErrorOr;
using FluentValidation;
using MediatR;
using OPS.Application.Common;
using OPS.Application.Dtos;
using OPS.Application.Interfaces;
using OPS.Domain;

namespace OPS.Application.Features.AiPrompts.Queries;

public record AiReviewWrittenQuery(Guid SubmissionId) : IRequest<ErrorOr<AiSubmissionReview>>;

public class AiReviewWrittenQueryHandler(IUnitOfWork unitOfWork, IAiService aiService)
    : IRequestHandler<AiReviewWrittenQuery, ErrorOr<AiSubmissionReview>>
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IAiService _aiService = aiService;

    public async Task<ErrorOr<AiSubmissionReview>> Handle(
        AiReviewWrittenQuery request, CancellationToken cancellationToken)
    {
        var submission = await _unitOfWork.WrittenSubmission.GetWithQuestionAsync(
            request.SubmissionId, cancellationToken);

        if (submission is null) return Error.NotFound();

        var prompt = new PromptRequest(
            $$"""
              - Review answer of the given question. Focus on accuracy and correctness.
              - Provide 2/3 lines review and give a score between score 0 to {{submission.Question.Points}}.
              - Return JSON { review, score }
              """,
            [
                $"Question: [{submission.Question.StatementMarkdown}]",
                $"Answer: [{submission.Answer}]"
            ]
        );

        var response = await _aiService.PromptAsync<AiSubmissionReview>(prompt);

        return response is null
            ? Error.Failure("Failed to get a response from the AI service.")
            : response;
    }
}

public class AiReviewWrittenQueryValidator : AbstractValidator<AiReviewWrittenQuery>
{
    public AiReviewWrittenQueryValidator()
    {
        RuleFor(x => x.SubmissionId)
            .IsValidGuid();
    }
}