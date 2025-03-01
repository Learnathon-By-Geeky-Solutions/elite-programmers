using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OPS.Api.Common;
using OPS.Application.Features.Authentication.Commands;
using OPS.Application.Features.Authentication.Queries;

namespace OPS.Api.Controllers;

[AllowAnonymous]
public class AuthController(IMediator mediator) : BaseApiController
{
    private readonly IMediator _mediator = mediator;

    [HttpPost("Login")]
    public async Task<IActionResult> LoginAsync(LoginQuery query)
    {
        var login = await _mediator.Send(query);

        return ToResult(login);
    }

    [HttpPost("Register")]
    public async Task<IActionResult> RegisterAsync(RegisterCommand command)
    {
        var registration = await _mediator.Send(command);

        return ToResult(registration);
    }

    [HttpPost("PasswordRecovery")]
    public async Task<IActionResult> PasswordRecoveryAsync(PasswordRecoveryCommand command)
    {
        var result = await _mediator.Send(command);

        return ToResult(result);
    }

    [HttpPost("IsUserUnique")]
    public async Task<IActionResult> IsUserUniqueAsync(IsUserUniqueQuery query)
    {
        var result = await _mediator.Send(query);

        return result.IsError
            ? Problem(result.Errors)
            : Ok(new { isUnique = result.Value });
    }

    [HttpPost("SendOtp")]
    public async Task<IActionResult> SendOtpAsync(SendOtpCommand command)
    {
        var otpSent = await _mediator.Send(command);

        return ToResult(otpSent);
    }

    [HttpPost("IsValidOtp")]
    public async Task<IActionResult> IsValidOtpAsync(IsValidOtpQuery query)
    {
        var result = await _mediator.Send(query);

        return result.IsError
            ? Problem(result.Errors)
            : Ok(new { isValidOtp = result.Value });
    }
}