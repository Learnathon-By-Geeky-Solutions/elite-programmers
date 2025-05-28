using ErrorOr;
using FluentValidation;
using MediatR;
using OPS.Application.Dtos;
using OPS.Application.Interfaces;

namespace OPS.Application.Features.AiPrompts.Queries;

public record AiWrittenQues(string QuestionStatement);

public record AiGenerateWrittenQuesQuery(string? UserPrompt) : IRequest<ErrorOr<AiWrittenQues>>;

public class AiGenerateWrittenQuesQueryHandler(IAiService aiService)
    : IRequestHandler<AiGenerateWrittenQuesQuery, ErrorOr<AiWrittenQues>>
{
    private readonly IAiService _aiService = aiService;

    public async Task<ErrorOr<AiWrittenQues>> Handle(AiGenerateWrittenQuesQuery request,
        CancellationToken cancellationToken)
    {
        var prompt = new PromptRequest(
            """
            - Create a computer science theoretical question for interviews.
            - If a user prompt is provided, use it as a reference.
            - If the user prompt already includes a question, improve it.
            - The question should be clear, concise, and ending with a question mark.
            - Return JSON: { "questionStatement": "string" }
            """,
            [
                $"UserPrompt: [{request.UserPrompt}]"
            ]
        );

        var response = await _aiService.PromptAsync<AiWrittenQues>(prompt);

        return response is null
            ? Error.Failure("Failed to get a response from the AI service.")
            : response;
    }
}

public class AiGenerateWrittenQuesQueryValidator : AbstractValidator<AiGenerateWrittenQuesQuery>
{
    public AiGenerateWrittenQuesQueryValidator()
    {
        RuleFor(x => x.UserPrompt)
            .MaximumLength(2000);
    }
}