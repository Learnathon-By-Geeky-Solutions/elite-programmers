﻿using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace OPS.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(options => { options.RegisterServicesFromAssemblies(typeof(DependencyInjection).Assembly); });

        services.AddValidatorsFromAssemblyContaining(typeof(DependencyInjection));

        return services;
    }
}