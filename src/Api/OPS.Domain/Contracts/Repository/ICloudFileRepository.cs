using OPS.Domain.Entities.Core;

namespace OPS.Domain.Contracts.Repository;

public interface ICloudFileRepository : IBaseRepository<CloudFile>
{
    Task<bool> IsExistsAsync(Guid cloudFileId, CancellationToken cancellationToken);
}