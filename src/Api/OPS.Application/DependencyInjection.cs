using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using OPS.Application.CrossCutting.BackgroundServices;
using OPS.Application.CrossCutting.Behaviors;
using OPS.Application.Interfaces;
using OPS.Application.Services;

namespace OPS.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssemblyContaining(typeof(DependencyInjection));
            config.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        services.AddValidatorsFromAssemblyContaining(typeof(DependencyInjection), includeInternalTypes: true);

        services.AddHostedService<OtpCleanupService>();

        services.AddScoped<IAuthService, AuthService>();

        return services;
    }
}