﻿using Microsoft.EntityFrameworkCore;
using OPS.Domain.Contracts;
using OPS.Domain.Entities.Exam;
using OPS.Domain.Entities.Submit;
using OPS.Domain.Enums;

namespace OPS.Persistence.Repositories;

internal class McqSubmissionRepository(AppDbContext dbContext) : Repository<McqSubmission>(dbContext), IMcqSubmissionRepository
{
    private readonly AppDbContext _dbContext = dbContext;
    
    public async Task<McqSubmission?> GetByAccountIdAsync(Guid questionId, Guid accountId, CancellationToken cancellationToken)
    {
        return await _dbContext.McqSubmissions
            .Where(submission => submission.AccountId == accountId && submission.QuestionId == questionId)
            .SingleOrDefaultAsync(cancellationToken);
    }

    public async Task<List<Question>> GetAllMcqWithSubmission(Guid examId, Guid accountId, CancellationToken cancellationToken)
    {
        return await _dbContext.Questions
            .Where(q => q.ExaminationId == examId && q.QuestionTypeId == (int)QuestionType.MCQ)
            .Include(q => q.McqOption)
            .Include(q => q.McqSubmissions.Where(submission => submission.AccountId == accountId))
            .ToListAsync(cancellationToken);
    }
}