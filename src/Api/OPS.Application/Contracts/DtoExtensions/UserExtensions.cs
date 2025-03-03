﻿using OPS.Application.Contracts.Dtos;
using OPS.Domain.Entities.User;

namespace OPS.Application.Contracts.DtoExtensions;

public static class AccountExtensions
{
    public static AccountResponse ToDto(this Account account)
    {
        return new AccountResponse(
            account.Id,
            account.Username,
            account.Email,
            account.CreatedAt,
            account.UpdatedAt,
            account.IsActive
        );
    }
}