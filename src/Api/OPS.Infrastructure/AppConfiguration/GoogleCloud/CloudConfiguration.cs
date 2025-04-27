using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;

namespace OPS.Infrastructure.AppConfiguration.GoogleCloud;

public static class CloudConfiguration
{
    /// <summary>
    /// Registers Google Cloud Drive services and related configuration in the dependency injection container.
    /// </summary>
    /// <param name="services">The service collection to add the Google Cloud services to.</param>
    /// <param name="configuration">The application configuration containing Google Cloud settings.</param>
    /// <returns>The updated service collection with Google Cloud services registered.</returns>
    public static IServiceCollection AddGoogleCloudServices(this IServiceCollection services, IConfiguration configuration)
    {
        var settings = new GoogleCloudSettings();
        configuration.Bind(nameof(GoogleCloudSettings), settings);

        services.AddSingleton(serviceProvider => {
            var memoryCache = serviceProvider.GetRequiredService<IMemoryCache>();
            var logger = serviceProvider.GetRequiredService<ILogger>();

            return new DriveServiceProvider(memoryCache, settings, logger).GetDriveService();
        });

        return services;
    }
}