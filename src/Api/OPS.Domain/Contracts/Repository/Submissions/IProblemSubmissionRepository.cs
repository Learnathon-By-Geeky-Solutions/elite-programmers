﻿using OPS.Domain.Contracts.Repository.Common;
using OPS.Domain.Entities.Exam;
using OPS.Domain.Entities.Submit;

namespace OPS.Domain.Contracts.Repository.Submissions;

public interface IProblemSubmissionRepository : IBaseRepository<ProblemSubmission>
{
    Task<ProblemSubmission?> GetAsync(Guid questionId, Guid accountId, CancellationToken cancellationToken);
    Task<ProblemSubmission?> GetWithOutputsAsync(Guid questionId, Guid accountId, CancellationToken cancellationToken);
    Task<ProblemSubmission?> GetWithOutputsAsync(Guid problemSubmissionId, CancellationToken cancellationToken);
    Task<List<Question>> GetAllProblemsWithSubmission(Guid examId, Guid accountId, CancellationToken cancellationToken);
    Task<List<ProblemSubmission>> GetAllAsync(Guid examId, Guid accountId, CancellationToken cancellationToken);
}