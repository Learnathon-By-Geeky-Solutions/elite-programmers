﻿using OPS.Domain.Contracts;
using OPS.Domain.Contracts.Repository;

namespace OPS.Domain;

public interface IUnitOfWork : IDisposable
{
    IAccountRepository Account { get; }
    IOtpRepository Otp { get; }
    IExamRepository Exam { get; }
    IExamCandidatesRepository ExamCandidate { get; }
    IQuestionRepository Question { get; }
    IWrittenSubmissionRepository WrittenSubmission { get; }

    Task<int> CommitAsync(CancellationToken cancellationToken = default);
}