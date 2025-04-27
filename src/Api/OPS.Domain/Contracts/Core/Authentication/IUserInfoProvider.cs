namespace OPS.Domain.Contracts.Core.Authentication;

public interface IUserInfoProvider
{
    bool IsAuthenticated();
    /// <summary>
/// Retrieves the current user's information.
/// </summary>
/// <returns>A <see cref="CurrentUser"/> instance representing the current user.</returns>
CurrentUser GetCurrentUser();
    /// <summary>
/// Retrieves the list of permissions assigned to the current user.
/// </summary>
/// <returns>A list of permission names.</returns>
List<string> GetPermissions();
    /// <summary>
/// Retrieves the unique identifier of the current user's account.
/// </summary>
/// <returns>The account ID as a <see cref="Guid"/>.</returns>
Guid AccountId();
    /// <summary>
/// Attempts to retrieve the user's account identifier.
/// </summary>
/// <returns>The account ID as a <see cref="Guid"/> if available; otherwise, <c>null</c>.</returns>
Guid? TryGetAccountId();
    /// <summary>
/// Decodes and returns the current user's authentication token as a dynamic object.
/// </summary>
/// <returns>A dynamic object containing the decoded token information.</returns>
dynamic DecodeToken();
}