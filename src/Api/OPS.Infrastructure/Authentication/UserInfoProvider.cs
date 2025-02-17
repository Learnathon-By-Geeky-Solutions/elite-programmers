﻿using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using OPS.Domain.Contracts.Core.Authentication;
using OPS.Domain.Enums;

namespace OPS.Infrastructure.Authentication;

public class UserInfoProvider(IHttpContextAccessor httpContextAccessor) : IUserInfoProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

    public string? AccountId()
    {
        return _httpContextAccessor.HttpContext?.User.FindFirst("accountId")?.Value;
    }

    public string? Username()
    {
        return _httpContextAccessor.HttpContext?.User.FindFirst("username")?.Value;
    }

    public string? Email()
    {
        return _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Email)?.Value;
    }

    public List<RoleType> Roles()
    {
        return _httpContextAccessor.HttpContext?.User
            .FindAll(ClaimTypes.Role)
            .Select(x => Enum.Parse<RoleType>(x.Value))
            .ToList() ?? [];
    }
}