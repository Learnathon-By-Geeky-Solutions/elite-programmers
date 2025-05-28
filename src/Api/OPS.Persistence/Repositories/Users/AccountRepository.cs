using Microsoft.EntityFrameworkCore;
using OPS.Domain.Entities.Common;
using OPS.Domain.Entities.User;
using OPS.Domain.Enums;
using OPS.Domain.Interfaces.Users;
using OPS.Persistence.Repositories.Common;
using static OPS.Domain.Enums.RoleType;

namespace OPS.Persistence.Repositories.Users;

internal class AccountRepository(AppDbContext dbContext) : Repository<Account>(dbContext), IAccountRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public async Task<bool> IsUsernameOrEmailUniqueAsync(
        string? username, string? email, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(username) && string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Both username and email cannot be null or empty.");

        var exists = await _dbContext.Accounts
            .IgnoreQueryFilters()
            .AsNoTracking()
            .Where(a =>
                (!string.IsNullOrEmpty(username) && a.Username == username) ||
                (!string.IsNullOrEmpty(email) && a.Email == email))
            .AnyAsync(cancellationToken);

        return !exists;
    }

    public async Task<Account?> GetByEmailAsync(string email, CancellationToken cancellationToken)
    {
        return await _dbContext.Accounts
            .Where(a => a.Email == email)
            .Include(a => a.AccountRoles)
            .SingleOrDefaultAsync(cancellationToken);
    }

    public async Task<List<Account>> GetByEmailsAsync(List<string> emails, CancellationToken cancellationToken)
    {
        return await _dbContext.Accounts
            .AsNoTracking()
            .Where(a => emails.Contains(a.Email))
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Account>> GetByEmailsWithRoleAsync(List<string> emails, CancellationToken cancellationToken)
    {
        return await _dbContext.Accounts
            .AsNoTracking()
            .Where(a => emails.Contains(a.Email))
            .Include(a => a.AccountRoles)
            .ToListAsync(cancellationToken);
    }

    public async Task<PaginatedList<Account>> GetAllWithDetails(int pageIndex, int pageSize,
        string? searchTerm = null, RoleType? role = null, CancellationToken cancellationToken = default)
    {
        var query = GetWithDetailsQuery().AsNoTracking();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var trimmedSearch = searchTerm.Trim();
            query = query.Where(a => a.Username.Contains(trimmedSearch) || a.Email.Contains(trimmedSearch));
        }

        query = role switch
        {
            Candidate => query.Where(
                a => a.AccountRoles.Count == 1 &&
                     a.AccountRoles.Any(ar => ar.RoleId == (int)Candidate)),
            Admin => query.Where(a => a.AccountRoles.Any(ar => ar.RoleId == (int)Admin)),
            _ => query
        };

        query = query.OrderBy(a => a.CreatedAt);

        return await PaginatedList<Account>.CreateAsync(query, pageIndex, pageSize, cancellationToken);
    }

    public async Task<Account?> GetWithDetails(string usernameOrEmail, CancellationToken cancellationToken)
    {
        return await GetWithDetailsQuery()
            .Where(a => a.Username == usernameOrEmail || a.Email == usernameOrEmail)
            .SingleOrDefaultAsync(cancellationToken);
    }

    public async Task<Account?> GetWithDetails(Guid accountId, CancellationToken cancellationToken)
    {
        return await GetWithDetailsQuery()
            .Where(a => a.Id == accountId)
            .SingleOrDefaultAsync(cancellationToken);
    }

    private IQueryable<Account> GetWithDetailsQuery()
    {
        return _dbContext.Accounts
            .AsSplitQuery()
            .Include(a => a.AccountRoles)
            .ThenInclude(ar => ar.Role)
            .Include(a => a.Profile)
            .ThenInclude(a => a!.ImageFile)
            .Include(a => a.Profile)
            .ThenInclude(p => p!.ProfileLinks);
    }

    public async Task<List<Account>> GetNonAdminAccounts(List<Guid> accountIds, CancellationToken cancellationToken)
    {
        return await _dbContext.Accounts
            .Where(a => accountIds.Contains(a.Id) && a.AccountRoles.All(ar => ar.RoleId != (int)Admin))
            .ToListAsync(cancellationToken);
    }
}