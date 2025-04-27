using System.Diagnostics.CodeAnalysis;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using OPS.Application.CrossCutting.BackgroundServices;
using OPS.Application.CrossCutting.Behaviors;
using OPS.Application.Services.AuthService;
using OPS.Application.Services.CloudService;

namespace OPS.Application;

[ExcludeFromCodeCoverage]
public static class DependencyInjection
{
    /// <summary>
    /// Registers core application services, MediatR handlers, validation behaviors, and background services into the dependency injection container.
    /// </summary>
    /// <param name="services">The service collection to configure.</param>
    /// <returns>The updated service collection.</returns>
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
        services.AddScoped<ICloudFileService, CloudFileService>();

        return services;
    }
}