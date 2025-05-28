using OPS.Domain.Entities.Exam;
using OPS.Domain.Entities.Submit;
using OPS.Domain.Interfaces.Common;

namespace OPS.Domain.Interfaces.Submissions;

public interface IWrittenSubmissionRepository : IBaseRepository<WrittenSubmission>
{
    Task<WrittenSubmission?> GetWithQuestionAsync(Guid submissionId, CancellationToken cancellationToken);
    Task<List<WrittenSubmission>> GetByQuestionIdAsync(Guid questionId, CancellationToken cancellationToken);
    Task<WrittenSubmission?> GetByAccountIdAsync(Guid questionId, Guid accountId, CancellationToken cancellationToken);
    Task<List<Question>> GetQuesWithSubmission(Guid examId, Guid accountId, CancellationToken cancellationToken);
    Task<List<WrittenSubmission>> GetAllAsync(Guid examId, Guid accountId, CancellationToken cancellationToken);
}