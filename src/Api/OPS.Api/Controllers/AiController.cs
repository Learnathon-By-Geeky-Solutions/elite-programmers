using MediatR;
using Microsoft.AspNetCore.Mvc;
using OPS.Api.Common;
using OPS.Api.Common.ErrorResponses;
using OPS.Application.Dtos;
using OPS.Application.Features.AiPrompts.Queries;
using static Microsoft.AspNetCore.Http.StatusCodes;

namespace OPS.Api.Controllers;

/// <summary>
/// API endpoints for interacting with AI-powered prompts and generation.
/// </summary>
[Route("Ai")]
[ProducesResponseType<UnauthorizedResponse>(Status401Unauthorized)]
[ProducesResponseType<ExceptionResponse>(Status500InternalServerError)]
public class AiPromptController(IMediator mediator) : BaseApiController
{
    private readonly IMediator _mediator = mediator;

    /// <summary>
    /// Sends a custom AI prompt and retrieves the response.
    /// </summary>
    /// <param name="command">The AI prompt command containing the instruction and content.</param>
    /// <returns>An IActionResult representing the result of the prompt request.</returns>
    [HttpPost("Prompt")]
    [ProducesResponseType(Status200OK)]
    [EndpointDescription("Sends a custom AI prompt and retrieves the response.")]
    public async Task<IActionResult> GetPrompt(AiPromptCommand command)
    {
        var response = await _mediator.Send(command);

        return !response.IsError
            ? Ok(new { response = response.Value })
            : ToResult(response);
    }

    /// <summary>
    /// Generates an exam description using AI based on the provided query.
    /// </summary>
    /// <param name="query">The query containing parameters for generating the exam description.</param>
    /// <returns>An IActionResult representing the generated exam description.</returns>
    [HttpPost("Generate/ExamDescription")]
    [ProducesResponseType<AiExamDescriptionResponse>(Status200OK)]
    [EndpointDescription("Generates an exam description using AI based on the provided query.")]
    public async Task<IActionResult> GenerateExamDescription(AiExamDescriptionQuery query)
    {
        var response = await _mediator.Send(query);
        return ToResult(response);
    }

    /// <summary>
    /// Generates a problem-solving question using AI based on the provided query.
    /// </summary>
    /// <param name="query">The query containing parameters for generating the problem-solving question.</param>
    /// <returns>An IActionResult representing the generated problem-solving question.</returns>
    [HttpPost("Generate/ProblemSolvingQuestion")]
    [ProducesResponseType<AiProblemQuestionResponse>(Status200OK)]
    [EndpointDescription("Generates a problem-solving question using AI based on the provided query.")]
    public async Task<IActionResult> GenerateProblemSolvingQuestion(AiGenerateProblemQuery query)
    {
        var response = await _mediator.Send(query);
        return ToResult(response);
    }

    /// <summary>
    /// Generates a written question using AI based on the provided query.
    /// </summary>
    /// <param name="query">The query containing parameters for generating the written question.</param>
    /// <returns>An IActionResult representing the generated written question.</returns>
    [HttpPost("Generate/WrittenQuestion")]
    [ProducesResponseType<AiWrittenQues>(Status200OK)]
    [EndpointDescription("Generates a written question using AI based on the provided query.")]
    public async Task<IActionResult> GenerateWrittenQuestion(AiGenerateWrittenQuesQuery query)
    {
        var response = await _mediator.Send(query);
        return ToResult(response);
    }

    /// <summary>
    /// Reviews a problem submission using AI.
    /// </summary>
    /// <param name="problemSubmissionId">The ID of the problem submission to review.</param>
    /// <returns>An IActionResult representing the AI review of the problem submission.</returns>
    [HttpPost("Review/ProblemSubmission/{problemSubmissionId}")]
    [ProducesResponseType<AiSubmissionReview>(Status200OK)]
    [ProducesResponseType<NotFoundResponse>(Status404NotFound)]
    [EndpointDescription("Reviews a problem submission using AI.")]
    public async Task<IActionResult> ReviewProblemSubmission(Guid problemSubmissionId)
    {
        var query = new AiReviewProblemQuery(problemSubmissionId);
        var response = await _mediator.Send(query);
        return ToResult(response);
    }

    /// <summary>
    /// Reviews a written submission using AI.
    /// </summary>
    /// <param name="submissionId">The ID of the written submission to review.</param>
    /// <returns>An IActionResult representing the AI review of the written submission.</returns>
    [HttpPost("Review/WrittenSubmission/{submissionId}")]
    [ProducesResponseType<AiSubmissionReview>(Status200OK)]
    [ProducesResponseType<NotFoundResponse>(Status404NotFound)]
    [EndpointDescription("Reviews a written submission using AI.")]
    public async Task<IActionResult> ReviewWrittenSubmission(Guid submissionId)
    {
        var query = new AiReviewWrittenQuery(submissionId);
        var response = await _mediator.Send(query);
        return ToResult(response);
    }
}