﻿namespace OPS.Domain.Entities.Common;

public interface ISoftDeletable
{
    bool IsActive { get; set; }
    bool IsDeleted { get; set; }
    DateTime? DeletedAt { get; set; }
}