using Microsoft.EntityFrameworkCore;
using OPS.Domain;
using OPS.Domain.Contracts;
using OPS.Domain.Contracts.Repository;
using OPS.Domain.Entities.Common;

namespace OPS.Persistence;

internal class UnitOfWork(
    AppDbContext dbContext,
    IAccountRepository accountRepository,
    IOtpRepository otpRepository,
    IExamRepository examRepository,
    IExamCandidatesRepository examCandidatesRepository,
    IQuestionRepository questionRepository,
    IWrittenSubmissionRepository writtenSubmissionRepository,
    IMcqSubmissionRepository mcqSubmissionRepository,
    IMcqOptionRepository mcqOptionRepository,
    IProfileRepository profileRepository,
    IProfileSocialRepository profileSocialRepository,
    IProblemSubmissionRepository problemSubmissionRepository,
    ICloudFileRepository cloudFileRepository) : IUnitOfWork
{
    private readonly AppDbContext _dbContext = dbContext;

    public IAccountRepository Account { get; } = accountRepository;
    public IOtpRepository Otp { get; } = otpRepository;
    public IExamRepository Exam { get; } = examRepository;
    public IExamCandidatesRepository ExamCandidate { get; } = examCandidatesRepository;
    public IQuestionRepository Question { get; } = questionRepository;
    public IWrittenSubmissionRepository WrittenSubmission { get; } = writtenSubmissionRepository;
    public IMcqSubmissionRepository McqSubmission { get; } = mcqSubmissionRepository;
    public IMcqOptionRepository McqOption { get; } = mcqOptionRepository;
    public IProfileRepository Profile { get; } = profileRepository;
    public IProfileSocialRepository ProfileSocial { get; } = profileSocialRepository;
    public IProblemSubmissionRepository ProblemSubmission { get; } = problemSubmissionRepository;
    public ICloudFileRepository CloudFile { get; } = cloudFileRepository;

    public async Task<int> CommitAsync(CancellationToken cancellationToken = default)
    {
        var softDeletableEntities = _dbContext.ChangeTracker
            .Entries<ISoftDeletable>()
            .Where(entry => entry.State == EntityState.Deleted);

        foreach (var entityEntry in softDeletableEntities)
        {
            entityEntry.Property(nameof(ISoftDeletable.IsDeleted)).CurrentValue = true;
            entityEntry.State = EntityState.Modified;
        }

        var updatedEntities = _dbContext.ChangeTracker
            .Entries<IBaseEntity>()
            .Where(entry => entry.State == EntityState.Modified)
            .ToList();

        foreach (var entityEntry in updatedEntities) entityEntry.Property(nameof(IBaseEntity.UpdatedAt)).CurrentValue = DateTime.UtcNow;

        return await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        _dbContext.Dispose();
    }
}