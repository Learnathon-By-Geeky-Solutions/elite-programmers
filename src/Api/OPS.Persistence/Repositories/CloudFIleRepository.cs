using Microsoft.EntityFrameworkCore;
using OPS.Domain.Contracts.Repository;
using OPS.Domain.Entities.Core;

namespace OPS.Persistence.Repositories;

internal class CloudFIleRepository(AppDbContext dbContext) : Repository<CloudFile>(dbContext), ICloudFileRepository
{
    private readonly AppDbContext _dbContext = dbContext;
    
    public async Task<bool> IsExistsAsync(Guid cloudFileId, CancellationToken cancellationToken)
    {
        return await _dbContext.CloudFiles
            .AsNoTracking()
            .Where(cf => cf.Id == cloudFileId)
            .AnyAsync(cancellationToken);
    }
}