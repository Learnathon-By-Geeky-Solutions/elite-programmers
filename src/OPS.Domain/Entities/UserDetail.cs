﻿namespace OPS.Domain.Entities;

public partial class UserDetail
{
    public long UserDetailsId { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Bio { get; set; } = null!;
    public string InstituteName { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public bool IsDeleted { get; set; }

    public long? UserId { get; set; }
    public virtual User User { get; set; } = null!;
}
