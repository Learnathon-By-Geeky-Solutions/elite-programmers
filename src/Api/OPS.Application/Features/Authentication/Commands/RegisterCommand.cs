using ErrorOr;
using FluentValidation;
using MediatR;
using OPS.Application.Contracts.Dtos;
using OPS.Application.CrossCutting.Constants;
using OPS.Application.Interfaces;
using OPS.Domain;
using OPS.Domain.Contracts.Core.Authentication;
using OPS.Domain.Entities.User;
using OPS.Domain.Enums;

namespace OPS.Application.Features.Authentication.Commands;

public record RegisterCommand(
    string Username,
    string Email,
    string Password,
    string Otp) : IRequest<ErrorOr<AuthenticationResult>>;

public class RegisterCommandHandler(
    IUnitOfWork unitOfWork,
    IPasswordHasher passwordHasher,
    IAuthService authService) : IRequestHandler<RegisterCommand, ErrorOr<AuthenticationResult>>
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IPasswordHasher _passwordHasher = passwordHasher;
    private readonly IAuthService _authService = authService;

    public async Task<ErrorOr<AuthenticationResult>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var isUserUnique =
            await _unitOfWork.Account.IsUsernameOrEmailUniqueAsync(
                request.Username,
                request.Email,
                cancellationToken
            );

        if (!isUserUnique)
            return Error.Conflict();

        var isValidOtp = await _unitOfWork.Otp.IsValidOtpAsync(request.Email, request.Otp, cancellationToken);

        if (!isValidOtp)
            return Error.Unauthorized(description: "Invalid OTP.");

        var (hashedPassword, salt) = _passwordHasher.HashPassword(request.Password);

        var account = new Account
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = hashedPassword,
            Salt = salt,
            AccountRoles = new List<AccountRole>
            {
                new() { RoleId = (int)RoleType.Candidate }
            }
        };

        _unitOfWork.Account.Add(account);
        var result = await _unitOfWork.CommitAsync(cancellationToken);

        return result > 0
            ? _authService.AuthenticateUser(account)
            : Error.Failure();
    }
}

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty()
            .MinimumLength(4)
            .MaximumLength(50);

        RuleFor(x => x.Email)
            .NotEmpty()
            .Matches(ValidationConstants.EmailRegex);

        RuleFor(x => x.Password)
            .NotEmpty()
            .Matches(ValidationConstants.PasswordRegex)
            .WithMessage("Password must be at least 8 chars long, contain at least 1x (lowercase, uppercase, digit, special char).");

        RuleFor(x => x.Otp)
            .NotEmpty()
            .Length(4);
    }
}