using Microsoft.EntityFrameworkCore;
using OPS.Domain.Contracts.Repository.Users;
using OPS.Domain.Entities.User;
using OPS.Persistence.Repositories.Common;

namespace OPS.Persistence.Repositories.Users;

internal class ProfileRepository(AppDbContext dbContext) : Repository<Profile>(dbContext), IProfileRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    /// <summary>
    /// Retrieves a profile by account ID, including its profile links and image file.
    /// </summary>
    /// <param name="accountId">The unique identifier of the account.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>The matching <see cref="Profile"/> with related links and image file, or <c>null</c> if not found.</returns>
    public async Task<Profile?> GetByAccountId(Guid accountId, CancellationToken cancellationToken)
    {
        return await _dbContext.Profiles
            .Where(p => p.AccountId == accountId)
            .Include(p => p.ProfileLinks)
            .Include(p => p.ImageFile)
            .SingleOrDefaultAsync(cancellationToken);
    }
}