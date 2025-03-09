﻿using MediatR;
using Microsoft.AspNetCore.Mvc;
using OPS.Api.Common;
using OPS.Application.Features.ProblemSubmissions.Commands;
using OPS.Application.Features.ProblemSubmissions.Queries;

namespace OPS.Api.Controllers;

public class ProblemSubmitController(IMediator mediator) : BaseApiController
{
    private readonly IMediator _mediator = mediator;
    
    [HttpPost]
    public async Task<IActionResult> SaveAsync(SaveProblemSubmissionCommand command)
    {
        var result = await _mediator.Send(command);

        return ToResult(result);
    }
    
    [HttpGet("{problemSubmissionId:guid}")]
    public async Task<IActionResult> GetProblemSubmitByIdAsync(Guid problemSubmissionId)
    {
        var query = new GetProblemSubmissionByIdQuery(problemSubmissionId);
        var result = await _mediator.Send(query);

        return ToResult(result);
    }
    
    [HttpGet("GetByExamId/{examId}/{accountId}")]
    public async Task<IActionResult> GetAllProblemSubmitsByExamIdAsync(Guid examId, Guid accountId)
    {
        var query = new GetAllProblemQuesWithSubmissionQuery(examId, accountId);
        var result = await _mediator.Send(query);

        return ToResult(result);
    }
}