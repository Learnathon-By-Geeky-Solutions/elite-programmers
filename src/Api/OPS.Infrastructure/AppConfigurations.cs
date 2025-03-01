using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore.Diagnostics;
using OPS.Application.CrossCutting.Constants;
using OPS.Domain.Contracts.Core.Authentication;
using OPS.Domain.Contracts.Core.EmailSender;
using OPS.Domain.Enums;
using OPS.Infrastructure.Authentication;
using OPS.Infrastructure.EmailSender;
using OPS.Persistence;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.MSSqlServer;

namespace OPS.Infrastructure;

public static class AppConfigurations
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration,
        IHostEnvironment environment,
        IHostBuilder hostBuilder)
    {
        services
            .AddDatabase(configuration)
            .AddAuthentication(configuration)
            .AddAuthorization()
            .AddEmailSettings(configuration)
            .AddMemoryCache()
            .AddDependencies()
            .AddHealthChecks();

        hostBuilder.AddSerilog(configuration, environment);

        return services;
    }

    public static void UseInfrastructure(this IApplicationBuilder app)
    {
        app.UseSerilogRequestLogging();
    }


    #region Database

    private static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(connectionString, m => m.MigrationsHistoryTable("Migrations", "Core"))
                .ConfigureWarnings(builder => { builder.Ignore(CoreEventId.PossibleIncorrectRequiredNavigationWithQueryFilterInteractionWarning); })
        );

        return services;
    }


    public static void ApplyMigration(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();

        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var databaseCreator = dbContext.GetService<IRelationalDatabaseCreator>();

        if (!databaseCreator.Exists()) dbContext.Database.Migrate();
    }

    #endregion


    #region Authentication & Authorization

    private static IServiceCollection AddAuthentication(
        this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtSettings>(configuration.GetSection(nameof(JwtSettings)));
        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddSingleton<IJwtGenerator, JwtGenerator>();

        var jwtSettings = configuration.GetSection(nameof(JwtSettings)).Get<JwtSettings>();

        if (jwtSettings == null || string.IsNullOrEmpty(jwtSettings.Secret))
            throw new ArgumentNullException(nameof(jwtSettings), "JWT settings are not configured properly.");

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.ASCII.GetBytes(jwtSettings.Secret)
                    )
                };
            });

        return services;
    }

    private static IServiceCollection AddAuthorization(this IServiceCollection services)
    {
        foreach (var role in Enum.GetValues<RoleType>())
        {
            var roleName = Enum.GetName(role)!;

            services
                .AddAuthorizationBuilder()
                .AddPolicy(roleName, policy => policy
                    .RequireRole(roleName)
                );
        }

        return services;
    }

    #endregion


    #region Email Settings

    private static IServiceCollection AddEmailSettings(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IAccountEmails, AccountEmails>();

        var settings = new EmailSettings();
        configuration.Bind(nameof(EmailSettings), settings);

        services
            .AddFluentEmail(settings.Email, ProjectConstants.ProjectName)
            .AddSmtpSender(settings.Server, settings.Port, settings.Email, settings.Password);

        return services;
    }

    #endregion


    #region Serilog

    private static void AddSerilog(this IHostBuilder hostBuilder, IConfiguration configuration, IHostEnvironment env)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        hostBuilder.UseSerilog((context, config) =>
            config.ReadFrom.Configuration(context.Configuration)
                .WriteTo.Console(env.IsDevelopment() ? LogEventLevel.Information : LogEventLevel.Error)
                .WriteTo.MSSqlServer(
                    restrictedToMinimumLevel: LogEventLevel.Warning,
                    connectionString: connectionString,
                    sinkOptions: new MSSqlServerSinkOptions
                    {
                        TableName = "LogEvents",
                        SchemaName = "Core",
                        AutoCreateSqlTable = false
                    }
                )
        );
    }

    #endregion
}