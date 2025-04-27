using OPS.Application.Dtos;
using OPS.Domain.Entities.User;
using OPS.Domain.Enums;

namespace OPS.Application.Mappers;

public static class AccountMappers
{
    public static AccountResponse MapToDto(this Account account)
    {
        return new AccountResponse(
            account.Id,
            account.Username,
            account.Email,
            account.CreatedAt,
            account.UpdatedAt,
            account.IsActive
        );
    }

    public static AccountBasicInfoResponse MapToBasicInfoDto(this Account account)
    {
        return new AccountBasicInfoResponse(
            account.Id,
            account.Username,
            account.Email
        );
    }

    public static AccountWithDetailsResponse MapToDtoWithDetails(this Account account)
    {
        var roles = account.AccountRoles
            .Select(accountRole => (RoleType)accountRole.RoleId)
            .ToList();

        return new AccountWithDetailsResponse(
            account.Id,
            account.Username,
            account.Email,
            account.CreatedAt,
            account.UpdatedAt,
            account.IsActive,
            roles,
            account.Profile.MapToDto()
        );
    }

    /// <summary>
    /// Maps a <see cref="Profile"/> entity to a <see cref="ProfileResponse"/> DTO, including image and profile links. Returns null if the profile is null.
    /// </summary>
    /// <param name="profile">The profile entity to map, or null.</param>
    /// <returns>A <see cref="ProfileResponse"/> DTO representing the profile, or null if the input is null.</returns>
    public static ProfileResponse? MapToDto(this Profile? profile)
    {
        return profile is null
            ? null
            : new ProfileResponse(
                profile.Id,
                profile.FirstName,
                profile.LastName,
                profile.Bio,
                profile.InstituteName,
                profile.PhoneNumber,
                profile.ImageFile?.MapToDto(),
                profile.ProfileLinks
                    .Select(pl => new ProfileLinkRequest(pl.Id, pl.Name, pl.Link)).ToList()
            );
    }
}