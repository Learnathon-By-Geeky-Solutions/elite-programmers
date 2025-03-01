using OPS.Domain.Entities.User;

namespace OPS.Domain.Contracts.Repository;

public interface IAccountRepository : IBaseRepository<Account>
{
    Task<bool> IsUsernameOrEmailUniqueAsync(string? username, string? email, CancellationToken cancellationToken);
    Task<Account?> GetByEmailAsync(string email, CancellationToken cancellationToken);
    Task<List<Account>> GetAllWithDetails(CancellationToken cancellationToken);
    Task<bool> IsExistsAsync(string? username, string? email, CancellationToken cancellationToken);
    Task<Account?> GetWithProfile(string usernameOrEmail, CancellationToken cancellationToken);
    Task<Account?> GetWithProfile(Guid accountId, CancellationToken cancellationToken);
}