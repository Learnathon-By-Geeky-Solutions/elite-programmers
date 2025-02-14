﻿namespace OPS.Infrastructure.Authentication.TokenGenerator;

public class JwtSettings
{
    public string Secret { get; init; } = null!;
    public string Issuer { get; init; } = null!;
    public string Audience { get; init; } = null!;
    public int TokenExpirationInMinutes { get; init; }
}