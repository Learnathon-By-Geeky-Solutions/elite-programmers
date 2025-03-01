using Microsoft.Extensions.DependencyInjection;
using OPS.Domain;
using OPS.Domain.Contracts;
using OPS.Domain.Contracts.Repository;
using OPS.Persistence.Repositories;

namespace OPS.Persistence;

public static class DependencyInjection
{
    public static IServiceCollection AddPersistence(this IServiceCollection services)
    {
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddScoped<IAccountRepository, AccountRepository>();
        services.AddScoped<IOtpRepository, OtpRepository>();
        services.AddScoped<IExamRepository, ExamRepository>();
        services.AddScoped<IExamCandidatesRepository, ExamCandidatesRepository>();
        services.AddScoped<IQuestionRepository, QuestionRepository>();
        services.AddScoped<IWrittenSubmissionRepository, WrittenSubmissionRepository>();
        services.AddScoped<IMcqSubmissionRepository, McqSubmissionRepository>();
        services.AddScoped<IMcqOptionRepository, McqOptionRepository>();
        services.AddScoped<IProfileRepository, ProfileRepository>();
        services.AddScoped<IProfileSocialRepository, ProfileSocialRepository>();
        services.AddScoped<IProblemSubmissionRepository, ProblemSubmissionRepository>();
        services.AddScoped<ICloudFileRepository, CloudFIleRepository>();

        return services;
    }
}