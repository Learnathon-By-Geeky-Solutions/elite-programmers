using MediatR;
using Microsoft.AspNetCore.Mvc;
using OPS.Api.Common;
using OPS.Application.Features.User.Commands;
using OPS.Application.Features.User.Queries;
using OPS.Domain.Contracts.Core.Authentication;

namespace OPS.Api.Controllers;

public class UserController(
    IMediator mediator,
    IUserInfoProvider userInfoProvider) : BaseApiController
{
    private readonly IMediator _mediator = mediator;
    private readonly IUserInfoProvider _userInfoProvider = userInfoProvider;

    [HttpGet("Info")]
    public IActionResult GetInfo()
    {
        return Ok(new
        {
            AccountId = _userInfoProvider.AccountId(),
            Username = _userInfoProvider.Username(),
            Email = _userInfoProvider.Email(),
            Roles = _userInfoProvider.Roles()
        });
    }
    
    [HttpGet("Details")]
    public async Task<IActionResult> GetDetailsAsync()
    {
        var account = await _mediator.Send(new GetUserDetailsQuery());

        return ToResult(account);
    }
    
    [HttpPost("CreateOrUpdateProfile")]
    public async Task<IActionResult> CreateAsync(CreateOrUpdateProfileCommand command)
    {
        var result = await _mediator.Send(command);

        return ToResult(result);
    }
    
    [HttpDelete("Socials")]
    public async Task<IActionResult> DeleteSocialAsync(DeleteProfileSocialCommand command)
    {
        var result = await _mediator.Send(command);

        return ToResult(result);
    }
}