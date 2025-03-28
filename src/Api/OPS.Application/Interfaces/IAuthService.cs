using OPS.Application.Contracts.Dtos;
using OPS.Domain.Entities.User;

namespace OPS.Application.Interfaces;

public interface IAuthService
{
    AuthenticationResponse AuthenticateUser(Account account);
}