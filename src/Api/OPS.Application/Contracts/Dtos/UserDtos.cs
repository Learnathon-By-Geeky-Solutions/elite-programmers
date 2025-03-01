using OPS.Domain.Enums;

namespace OPS.Application.Contracts.Dtos;

public record AuthenticationResult(
    string Token,
    AccountResponse Account
);

public record AccountResponse(
    Guid AccountId,
    string Username,
    string Email,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    bool IsActive,
    List<RoleType> Roles,
    ProfileResponse? Profile
);

public record ProfileResponse(
    Guid ProfileId,
    string? FirstName,
    string? LastName,
    string? BioMarkdown,
    string? InstituteName,
    string? PhoneNumber,
    Guid? ImageFileId,
    List<ProfileSocialRequest> ProfileSocials
);

public record ProfileSocialRequest(
    Guid? Id,
    string? Name,
    string? Link
);