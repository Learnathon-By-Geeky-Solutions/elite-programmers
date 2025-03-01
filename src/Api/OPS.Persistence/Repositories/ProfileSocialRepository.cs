using Microsoft.EntityFrameworkCore;
using OPS.Domain.Contracts;
using OPS.Domain.Entities.User;

namespace OPS.Persistence.Repositories;

internal class ProfileSocialRepository(AppDbContext dbContext) : Repository<ProfileSocial>(dbContext), IProfileSocialRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public async Task<List<ProfileSocial>> GetByProfileIdAsync(Guid profileId, CancellationToken cancellationToken)
    {
        return await _dbContext.ProfileSocials
            .Where(q => q.ProfileId == profileId)
            .ToListAsync(cancellationToken);
    }
}