using Microsoft.EntityFrameworkCore;
using OPS.Domain.Contracts;
using OPS.Domain.Entities.User;

namespace OPS.Persistence.Repositories;

internal class ProfileRepository(AppDbContext dbContext) : Repository<Profile>(dbContext), IProfileRepository
{
    private readonly AppDbContext _dbContext = dbContext;
    
    public async Task<Profile?> GetByAccountId(Guid accountId, CancellationToken cancellationToken)
    {
        return await _dbContext.Profiles
            .Where(p => p.AccountId == accountId)
            .Include(p => p.ProfileSocials)
            .SingleOrDefaultAsync(cancellationToken);
    }
}