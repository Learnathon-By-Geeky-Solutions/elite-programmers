﻿using ErrorOr;
using FluentValidation;
using MediatR;
using OPS.Application.Contracts.DtoExtensions;
using OPS.Application.Contracts.Dtos;
using OPS.Application.CrossCutting.Constants;
using OPS.Domain;

namespace OPS.Application.Features.Accounts.Commands;

public record UpdateAccountCommand(
    Guid AccountId,
    string? Username,
    string? Email) : IRequest<ErrorOr<AccountResponse>>;

public class UpdateAccountCommandHandler(IUnitOfWork unitOfWork) : IRequestHandler<UpdateAccountCommand, ErrorOr<AccountResponse>>
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    public async Task<ErrorOr<AccountResponse>> Handle(UpdateAccountCommand command, CancellationToken cancellationToken)
    {
        var account = await _unitOfWork.Account.GetAsync(command.AccountId, cancellationToken);

        if (account is null) return Error.NotFound();

        var isUnique = await _unitOfWork.Account.IsUsernameOrEmailUniqueAsync(
            command.Username,
            command.Email,
            cancellationToken
        );

        if (!isUnique) return Error.Conflict();

        account.Username = command.Username ?? account.Username;
        account.Email = command.Email ?? account.Email;

        var result = await _unitOfWork.CommitAsync(cancellationToken);

        return result > 0
            ? account.ToDto()
            : Error.Failure();
    }
}

public class UpdateAccountCommandValidator : AbstractValidator<UpdateAccountCommand>
{
    public UpdateAccountCommandValidator()
    {
        RuleFor(x => x.AccountId)
            .NotEmpty()
            .Must(id => id != Guid.Empty);

        RuleFor(x => x.Username)
            .NotEmpty()
            .When(x => !string.IsNullOrEmpty(x.Username))
            .MinimumLength(4)
            .MaximumLength(50);

        RuleFor(x => x.Email)
            .NotEmpty()
            .When(x => !string.IsNullOrEmpty(x.Email))
            .Matches(ValidationConstants.EmailRegex);
    }
}