﻿using MediatR;
using Microsoft.AspNetCore.Mvc;
using OPS.Api.Common;
using OPS.Application.CrossCutting.Attributes;
using OPS.Application.Features.Accounts.Commands;
using OPS.Application.Features.Accounts.Queries;
using OPS.Domain.Enums;

namespace OPS.Api.Controllers;

[AuthorizeRoles(RoleType.Admin)]
public class AccountController(IMediator mediator) : BaseApiController
{
    private readonly IMediator _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAllAccounts()
    {
        var accounts = await _mediator.Send(new GetAllAccountsQuery());

        return ToResult(accounts);
    }

    // [HttpGet]
    // public async Task<IActionResult> GetAllAccountsByThisMonth()
    // {
    //     var accounts = await _mediator.Send(new GetAllAccountsByThisMonthQuery());
    //
    //     return ToResult(accounts);
    // }

    [HttpPatch("ChangeStatus")]
    public async Task<IActionResult> ChangeStatus(ChangeAccountStatusCommand command)
    {
        var account = await _mediator.Send(command);

        return ToResult(account);
    }

    [HttpPut]
    public async Task<IActionResult> Update(UpdateAccountCommand command)
    {
        var updatedAccount = await _mediator.Send(command);

        return ToResult(updatedAccount);
    }
}