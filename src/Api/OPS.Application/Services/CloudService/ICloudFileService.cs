using Microsoft.AspNetCore.Http;
using OPS.Application.Dtos;
using OPS.Domain.Entities.Core;

namespace OPS.Application.Services.CloudService;

public interface ICloudFileService
{
    /// <summary>
/// Asynchronously uploads a file to cloud storage.
/// </summary>
/// <param name="formFile">The file to upload.</param>
/// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
/// <returns>The uploaded cloud file information, or null if the upload fails.</returns>
Task<CloudFile?> UploadAsync(IFormFile formFile, CancellationToken cancellationToken = default);
    /// <summary>
/// Asynchronously retrieves a file from cloud storage by its identifier.
/// </summary>
/// <param name="fileId">The unique identifier of the file to download.</param>
/// <returns>A task that resolves to a <see cref="FileDownloadResponse"/> if the file is found; otherwise, null.</returns>
Task<FileDownloadResponse?> DownloadAsync(string fileId);
    /// <summary>
/// Deletes a file from cloud storage by its identifier.
/// </summary>
/// <param name="fileId">The unique identifier of the file to delete, or null to indicate no file.</param>
Task DeleteAsync(string? fileId);
}