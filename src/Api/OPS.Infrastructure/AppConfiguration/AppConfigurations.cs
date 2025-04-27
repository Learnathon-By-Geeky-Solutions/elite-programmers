using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OPS.Infrastructure.AppConfiguration.Auth;
using OPS.Infrastructure.AppConfiguration.Database;
using OPS.Infrastructure.AppConfiguration.Email;
using OPS.Infrastructure.AppConfiguration.GoogleCloud;
using OPS.Infrastructure.AppConfiguration.Logging;
using OPS.Infrastructure.AppConfiguration.OneCompiler;
using Serilog;

namespace OPS.Infrastructure.AppConfiguration;

public static class AppConfigurations
{
    /// <summary>
    /// Registers and configures infrastructure services, middleware, and logging for the application.
    /// </summary>
    /// <param name="configuration">Application configuration settings.</param>
    /// <param name="hostBuilder">The host builder to configure logging.</param>
    /// <returns>The updated service collection with infrastructure services registered.</returns>
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration,
        IHostBuilder hostBuilder)
    {
        services
            .AddDatabaseServices(configuration)
            .AddAuthorizationServices()
            .AddAuthenticationServices(configuration)
            .AddEmailServices(configuration)
            .AddOneCompilerServices(configuration)
            .AddMemoryCache()
            .AddGoogleCloudServices(configuration)
            .AddDependencies()
            .AddHealthChecks();

        hostBuilder.AddSerilog(configuration);

        return services;
    }

    public static void UseInfrastructure(this IApplicationBuilder app)
    {
        app.UseSerilogRequestLogging();
    }
}