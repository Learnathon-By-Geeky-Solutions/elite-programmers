using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OPS.Domain.Entities.Core;
using OPS.Persistence.Configurations.Common;

namespace OPS.Persistence.Configurations.Core;

public class CloudFileConfiguration : IEntityTypeConfiguration<CloudFile>
{
    /// <summary>
    /// Configures the Entity Framework Core mapping for the <see cref="CloudFile"/> entity, including table schema, property constraints, and relationships.
    /// </summary>
    /// <param name="entity">The builder used to configure the <see cref="CloudFile"/> entity type.</param>
    public void Configure(EntityTypeBuilder<CloudFile> entity)
    {
        entity.ToTable("CloudFiles", "Core");
        entity.HasKey(e => e.Id);

        entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
        entity.Property(e => e.ContentType).HasMaxLength(255);
        entity.Property(e => e.FileId).IsRequired();

        new BaseEntityConfig<CloudFile>().Configure(entity);
        new SoftDeletableEntityConfig<CloudFile>().Configure(entity);

        entity.HasOne(d => d.Account)
            .WithMany(p => p.CloudFiles)
            .HasForeignKey(d => d.AccountId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}