﻿using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OPS.Api.Common;
using OPS.Api.Common.ErrorResponses;
using OPS.Application.Dtos;
using OPS.Application.Features.Candidates.Commands;
using OPS.Application.Features.Candidates.Queries;
using OPS.Domain.Contracts.Core.OneCompiler;
using OPS.Infrastructure.Authentication.Permission;
using static Microsoft.AspNetCore.Http.StatusCodes;
using static OPS.Infrastructure.Authentication.Permission.Permissions;

namespace OPS.Api.Controllers;

[Route("Candidate")]
[ProducesResponseType<UnauthorizedResponse>(Status401Unauthorized)]
[ProducesResponseType<ExceptionResponse>(Status500InternalServerError)]
public class CandidateController(IMediator mediator) : BaseApiController
{
    private readonly IMediator _mediator = mediator;

    /// <summary>Retrieves all exams of the authenticated user.</summary>
    /// <param name="cancellationToken">Request cancellation token.</param>
    /// <returns>List of exams by user.</returns>
    [HttpGet("Exams")]
    [HasPermission(AccessOwnExams)]
    [EndpointDescription("Retrieves all exams of the authenticated user.")]
    [ProducesResponseType<List<ExamResponse>>(Status200OK)]
    public async Task<IActionResult> GetExamsAsync(CancellationToken cancellationToken)
    {
        var query = new GetAllExamsByCandidateQuery();
        var response = await _mediator.Send(query, cancellationToken);
        return ToResult(response);
    }

    /// <summary>Starts an exam for the authenticated user.</summary>
    /// <param name="examId">Exam Id.</param>
    /// <param name="cancellationToken">Request cancellation token.</param>
    /// <returns>Exam details, questions, and submitted answers.</returns>
    [HttpPost("Exam/Start/{examId:guid}")]
    [HasPermission(AccessOwnExams)]
    [EndpointDescription("Starts an exam for the authenticated user.")]
    [ProducesResponseType<ExamStartResponse>(Status200OK)]
    [ProducesResponseType<ValidationErrorResponse>(Status400BadRequest)]
    public async Task<IActionResult> StartExamAsync(Guid examId, CancellationToken cancellationToken)
    {
        var command = new StartExamCommand(examId);
        var response = await _mediator.Send(command, cancellationToken);
        return ToResult(response);
    }

    /// <summary>Creates or updates a problem-solving submission.</summary>
    /// <param name="command">Problem-solving submission details.</param>
    /// <param name="cancellationToken">Request cancellation token.</param>
    /// <returns>The saved or updated problem-solving submission.</returns>
    [HttpPut("Submit/Problem/Save")]
    [HasPermission(SubmitAnswers)]
    [EndpointDescription("Creates or updates a problem-solving submission.")]
    [ProducesResponseType<List<TestCodeResponse>>(Status200OK)]
    [ProducesResponseType<ValidationErrorResponse>(Status400BadRequest)]
    [ProducesResponseType<NotFoundResponse>(Status404NotFound)]
    public async Task<IActionResult> SaveProblemAsync(SaveProblemSubmissionsCommand command,
        CancellationToken cancellationToken = default)
    {
        var response = await _mediator.Send(command, cancellationToken);
        return ToResult(response);
    }

    /// <summary>Creates or updates a written submission.</summary>
    /// <param name="command">Written submission details.</param>
    /// <param name="cancellationToken">Request cancellation token.</param>
    /// <returns>The saved or updated written submission.</returns>
    [HttpPut("Submit/Written/Save")]
    [HasPermission(SubmitAnswers)]
    [EndpointDescription("Creates or updates a written submission.")]
    [ProducesResponseType(Status200OK)]
    [ProducesResponseType<ValidationErrorResponse>(Status400BadRequest)]
    [ProducesResponseType<NotFoundResponse>(Status404NotFound)]
    public async Task<IActionResult> SaveWrittenSubmissionAsync(SaveWrittenSubmissionsCommand command,
        CancellationToken cancellationToken = default)
    {
        var response = await _mediator.Send(command, cancellationToken);
        return ToResult(response);
    }

    /// <summary>Creates or updates an MCQ submission.</summary>
    /// <param name="command">MCQ submission details.</param>
    /// <param name="cancellationToken">Request cancellation token.</param>
    /// <returns>The saved or updated MCQ submission.</returns>
    [HttpPut("Submit/Mcq/Save")]
    [HasPermission(SubmitAnswers)]
    [EndpointDescription("Creates or updates an MCQ submission.")]
    [ProducesResponseType(Status200OK)]
    [ProducesResponseType<ValidationErrorResponse>(Status400BadRequest)]
    [ProducesResponseType<NotFoundResponse>(Status404NotFound)]
    public async Task<IActionResult> SaveMcqSubmissionAsync(SaveMcqSubmissionsCommand command,
        CancellationToken cancellationToken = default)
    {
        var response = await _mediator.Send(command, cancellationToken);
        return ToResult(response);
    }

    /// <summary>Execute and test codes for a problem-solving question.</summary>
    /// <param name="command">Code with the Question Id to test</param>
    /// <param name="cancellationToken">Request cancellation token.</param>
    /// <returns>Test results</returns>
    [AllowAnonymous]
    [HttpPost("RunAnyCode")]
    [EndpointDescription("Executes a code.")]
    [ProducesResponseType<CodeRunResponse>(Status200OK)]
    [ProducesResponseType<ValidationErrorResponse>(Status400BadRequest)]
    public async Task<IActionResult> RunAnyCodeAsync(CodeRunCommand command, CancellationToken cancellationToken = default)
    {
        var response = await _mediator.Send(command, cancellationToken);
        return Ok(response);
    }
}