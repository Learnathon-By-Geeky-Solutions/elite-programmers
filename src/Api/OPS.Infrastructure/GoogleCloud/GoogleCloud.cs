using Google.Apis.Drive.v3;
using Google.Apis.Drive.v3.Data;
using Google.Apis.Upload;
using Microsoft.Extensions.Caching.Memory;
using OPS.Domain.Contracts.Core.GoogleCloud;
using Serilog;

namespace OPS.Infrastructure.GoogleCloud;

using File = Google.Apis.Drive.v3.Data.File;

internal class GoogleCloudService(IMemoryCache cache, DriveService driveService) : IGoogleCloudService
{
    private readonly IMemoryCache _cache = cache;
    private readonly DriveService _driveService = driveService;

    /// <summary>
    /// Asynchronously uploads a file stream to Google Drive, sets its permissions to public read, and returns metadata for the uploaded file.
    /// </summary>
    /// <param name="stream">The file content to upload.</param>
    /// <param name="fileName">The name to assign to the uploaded file.</param>
    /// <param name="contentType">The MIME type of the file.</param>
    /// <returns>A <see cref="GoogleFile"/> representing the uploaded file, or <c>null</c> if the upload fails.</returns>
    public async Task<GoogleFile?> UploadAsync(Stream stream, string fileName, string contentType)
    {
        try
        {
            var metaData = CreateMetaData(fileName);
            var request = _driveService.Files.Create(metaData, stream, contentType);

            request.Fields = "id, name, mimeType, size, webContentLink, webViewLink, createdTime";
            var result = await request.UploadAsync();

            if (result.Status == UploadStatus.Failed)
            {
                Log.Error("Error uploading file: {FileName}, Error: {Error}", fileName, result.Exception);
                return null;
            }

            SetPermissions(request.ResponseBody.Id);

            return MapToGoogleFile(request.ResponseBody);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error uploading file: {FileName}", fileName);
            return null;
        }
    }

    /// <summary>
    /// Grants public read access to the specified file on Google Drive.
    /// </summary>
    /// <param name="fileId">The ID of the file to update permissions for.</param>
    private void SetPermissions(string fileId)
    {
        var permission = new Permission
        {
            Type = "anyone",
            Role = "reader"
        };

        _driveService.Permissions
            .Create(permission, fileId)
            .ExecuteAsync();
    }

    /// <summary>
    /// Retrieves metadata for a Google Drive file by its ID.
    /// </summary>
    /// <param name="fileId">The unique identifier of the file in Google Drive.</param>
    /// <returns>A <see cref="GoogleFile"/> object containing file metadata, or null if retrieval fails.</returns>
    public async Task<GoogleFile?> InfoAsync(string fileId)
    {
        try
        {
            var request = _driveService.Files.Get(fileId);
            request.Fields = "id, name, mimeType, size, webContentLink, webViewLink, createdTime";
            var response = await request.ExecuteAsync();
            return MapToGoogleFile(response);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error retrieving file info for file with ID: {FileId}", fileId);
            return null;
        }
    }

    /// <summary>
    /// Downloads a file from Google Drive by its ID and returns its metadata and content.
    /// </summary>
    /// <param name="fileId">The unique identifier of the file to download.</param>
    /// <returns>
    /// A <see cref="GoogleFileDownload"/> object containing the file's metadata and content as a byte array,
    /// or <c>null</c> if the download fails.
    /// </returns>
    public async Task<GoogleFileDownload?> DownloadAsync(string fileId)
    {
        try
        {
            var request = _driveService.Files.Get(fileId);
            request.Fields = "id, name, mimeType, size, createdTime";
            var fileInfo = await request.ExecuteAsync();

            using var stream = new MemoryStream();
            await request.DownloadAsync(stream);

            return new GoogleFileDownload(
                fileInfo.Id,
                fileInfo.Name,
                fileInfo.MimeType,
                fileInfo.Size ?? 0,
                stream.ToArray(),
                fileInfo.CreatedTimeDateTimeOffset?.UtcDateTime ?? DateTime.UtcNow
            );
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error downloading file with ID: {FileId}", fileId);
            return null;
        }
    }

    /// <summary>
    /// Deletes a file from Google Drive by its file ID.
    /// </summary>
    /// <param name="fileId">The unique identifier of the file to delete.</param>
    public async Task DeleteAsync(string fileId)
    {
        try
        {
            await _driveService.Files.Delete(fileId).ExecuteAsync();

        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error deleting file with ID: {FileId}", fileId);
        }
    }

    /// <summary>
    /// Creates Google Drive file metadata with the specified file name, optionally assigning a parent folder if a cached folder ID is available.
    /// </summary>
    /// <param name="fileName">The name to assign to the file in Google Drive.</param>
    /// <returns>A <see cref="File"/> metadata object for use with Google Drive API operations.</returns>
    private File CreateMetaData(string fileName)
    {
        const string cacheKey = "TT_FolderId";
        var metaData = new File { Name = fileName, };

        if (_cache.TryGetValue(cacheKey, out string? fileId) && fileId is not null)
        {
            metaData.Parents = new List<string> { fileId };
        }

        return metaData;
    }

    /// <summary>
    /// Converts a Google Drive API <see cref="File"/> object to a <see cref="GoogleFile"/> domain object.
    /// </summary>
    /// <param name="file">The Google Drive API file metadata to convert.</param>
    /// <returns>A <see cref="GoogleFile"/> containing the mapped file information.</returns>
    private static GoogleFile MapToGoogleFile(File file)
    {
        return new GoogleFile(
            file.Id,
            file.Name,
            file.MimeType,
            file.Size ?? 0,
            file.CreatedTimeDateTimeOffset?.UtcDateTime ?? DateTime.Now
        );
    }
}