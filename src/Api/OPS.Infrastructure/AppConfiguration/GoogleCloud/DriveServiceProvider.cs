using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Microsoft.Extensions.Caching.Memory;
using Serilog;

namespace OPS.Infrastructure.AppConfiguration.GoogleCloud;

public class DriveServiceProvider(IMemoryCache memoryCache, GoogleCloudSettings googleCloudOptions, ILogger logger)
{
    private readonly IMemoryCache _memoryCache = memoryCache;
    private readonly GoogleCloudSettings _settings = googleCloudOptions;
    private readonly ILogger _logger = logger;

    /// <summary>
    /// Creates and configures a Google Drive service client using credentials from the configured file.
    /// </summary>
    /// <returns>
    /// A <see cref="DriveService"/> instance authenticated with the provided credentials, or an uninitialized instance if the credentials file is missing or invalid.
    /// </returns>
    public DriveService GetDriveService()
    {
        if (!File.Exists(_settings.Credentials) || File.ReadAllLines(_settings.Credentials).Length < 10)
        {
            _logger.Error("Google credentials file not found or invalid.");
            return new DriveService();
        }

        var credential = GoogleCredential.FromFile(_settings.Credentials)
            .CreateScoped(DriveService.Scope.Drive);

        var driveService = new DriveService(
            new BaseClientService.Initializer
            {
                HttpClientInitializer = credential,
                ApplicationName = "TrueTest",
            }
        );

        SetFolderId(driveService);

        return driveService;
    }

    /// <summary>
    /// Searches for a Google Drive folder by name and caches its ID if found.
    /// </summary>
    /// <param name="driveService">The DriveService instance used to query Google Drive.</param>
    private void SetFolderId(DriveService driveService)
    {
        const string cacheKey = "TT_FolderId";

        var request = driveService.Files.List();
        request.Q = $"name='{_settings.FolderName}'";
        request.Fields = "files(id)";

        var files = request.Execute();

        if (files.Files.Count <= 0) return;

        var fileId = files.Files.FirstOrDefault()?.Id;
        _memoryCache.Set(cacheKey, fileId);
    }
}