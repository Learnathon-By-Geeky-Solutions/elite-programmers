using OPS.Domain.Contracts.Repository;
using OPS.Domain.Entities.User;

namespace OPS.Domain.Contracts;

public interface IProfileSocialRepository : IBaseRepository<ProfileSocial>
{
    Task<List<ProfileSocial>> GetByProfileIdAsync(Guid profileId, CancellationToken cancellationToken);
}