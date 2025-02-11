﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OPS.Domain.Entities.Exam;
using OPS.Persistence.Configurations.Common;

namespace OPS.Persistence.Configurations.Exam;

public class McqOptionConfiguration : IEntityTypeConfiguration<McqOption>
{
    public void Configure(EntityTypeBuilder<McqOption> entity)
    {
        entity.ToTable("McqOptions", "Exam");
        entity.HasKey(e => e.Id);

        entity.Property(e => e.OptionMarkdown).IsRequired();

        new BaseEntityConfig<McqOption>().Configure(entity);

        entity.HasOne(d => d.Question)
            .WithMany(p => p.McqQptions)
            .HasForeignKey(d => d.QuestionId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}