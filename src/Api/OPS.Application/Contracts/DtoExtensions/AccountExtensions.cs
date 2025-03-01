using OPS.Application.Contracts.Dtos;
using OPS.Domain.Entities.User;
using OPS.Domain.Enums;

namespace OPS.Application.Contracts.DtoExtensions;

public static class AccountExtensions
{
    public static AccountResponse ToDto(this Account account)
    {
        var roles = account.AccountRoles
            .Select(accountRole => (RoleType)accountRole.RoleId)
            .ToList();
        
        return new AccountResponse(
            account.Id,
            account.Username,
            account.Email,
            account.CreatedAt,
            account.UpdatedAt,
            account.IsActive,
            roles,
            account.Profile.ToDto()
        );
    }
    
    public static ProfileResponse? ToDto(this Profile? profile)
    {
        if (profile is null)
        {
            return null;
        }
        
        return new ProfileResponse(
            profile.Id,
            profile.FirstName,
            profile.LastName,
            profile.BioMarkdown,
            profile.InstituteName,
            profile.PhoneNumber,
            profile.ImageFileId,
            profile.ProfileSocials
                .Select(social => new ProfileSocialRequest(
                    social.Id,
                    social.Name,
                    social.Link)
                ).ToList()
        );
    }
    
    public static ProfileSocialRequest ToDto(this ProfileSocial profileSocial)
    {
        return new ProfileSocialRequest(
            profileSocial.Id,
            profileSocial.Name,
            profileSocial.Link
        );
    }
}
