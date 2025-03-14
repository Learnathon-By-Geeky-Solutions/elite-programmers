﻿using OPS.Domain.Entities.Common;
using OPS.Domain.Entities.Exam;
using OPS.Domain.Entities.User;

namespace OPS.Domain.Entities.Submit;

public class WrittenSubmission : BaseEntity
{
    public string Answer { get; set; } = null!;
    public decimal? Score { get; set; }
    public bool IsFlagged { get; set; }
    public string? FlagReason { get; set; }

    public Guid QuestionId { get; set; }
    public Guid AccountId { get; set; }
    public Question Question { get; set; } = null!;
    public Account Account { get; set; } = null!;
}