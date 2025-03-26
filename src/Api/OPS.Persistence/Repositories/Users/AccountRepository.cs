﻿using Microsoft.EntityFrameworkCore;
using OPS.Domain.Contracts.Repository.Users;
using OPS.Domain.Entities.User;
using OPS.Persistence.Repositories.Common;

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

    public async Task<bool> IsExistsAsync(string? username, string? email, CancellationToken cancellationToken)
    {
        return await _dbContext.Accounts
            .AsNoTracking()
            .Where(a =>
                (!string.IsNullOrEmpty(username) && a.Username == username) ||
                (!string.IsNullOrEmpty(email) && a.Email == email))
            .AnyAsync(cancellationToken);
    }

    public async Task<List<Account>> GetAllWithDetails(CancellationToken cancellationToken)
    {
        return await GetWithDetailsQuery()
            .AsNoTracking()
            .ToListAsync(cancellationToken);
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
            .Include(a => a.AccountRoles)
            .ThenInclude(ar => ar.Role)
            .Include(a => a.Profile)
            .ThenInclude(p => p!.ProfileLinks);
    }
}