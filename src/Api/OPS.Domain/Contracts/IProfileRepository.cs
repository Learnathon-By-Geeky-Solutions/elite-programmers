using OPS.Domain.Contracts.Repository;
using OPS.Domain.Entities.User;

namespace OPS.Domain.Contracts;

public interface IProfileRepository : IBaseRepository<Profile>
{
    Task<Profile?> GetByAccountId(Guid accountId, CancellationToken cancellationToken);
}