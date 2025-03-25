using OPS.Application.Contracts.DtoExtensions;
using OPS.Application.Contracts.Dtos;
using OPS.Application.Interfaces;
using OPS.Domain.Contracts.Core.Authentication;
using OPS.Domain.Entities.User;

namespace OPS.Application.Services;

internal class AuthService(IJwtGenerator jwtGenerator) : IAuthService
{
    private readonly IJwtGenerator _jwtGenerator = jwtGenerator;

    public AuthenticationResponse AuthenticateUser(Account account)
    {
        return new AuthenticationResponse(_jwtGenerator.CreateToken(account), account.ToDto());
    }
}
