using Microsoft.AspNetCore.Http;
using OPS.Application.Dtos;
using OPS.Application.Mappers;
using OPS.Domain.Contracts.Core.GoogleCloud;
using OPS.Domain.Entities.Core;

namespace OPS.Application.Services.CloudService;

internal class CloudFileService(IGoogleCloudService googleCloudService) : ICloudFileService
{
    private readonly IGoogleCloudService _googleCloudService = googleCloudService;

    /// <summary>
    /// Uploads a file to cloud storage and returns its metadata.
    /// </summary>
    /// <param name="formFile">The file to upload.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>A <see cref="CloudFile"/> representing the uploaded file, or null if the upload fails.</returns>
    public async Task<CloudFile?> UploadAsync(IFormFile formFile, CancellationToken cancellationToken = default)
    {
        using var stream = new MemoryStream();
        await formFile.CopyToAsync(stream, cancellationToken);

        var uploadedFile = await _googleCloudService.UploadAsync(
            stream,
            Path.GetFileName(formFile.FileName),
            formFile.ContentType
        );

        return uploadedFile.MapToCloudFile();
    }

    /// <summary>
    /// Downloads a file from cloud storage by its identifier and returns a file download response, or null if not found.
    /// </summary>
    /// <param name="fileId">The unique identifier of the file to download.</param>
    /// <returns>A <see cref="FileDownloadResponse"/> containing file data if found; otherwise, null.</returns>
    public async Task<FileDownloadResponse?> DownloadAsync(string fileId)
    {
        var file = await _googleCloudService.DownloadAsync(fileId);
        return file?.MapToDto();
    }

    /// <summary>
    /// Deletes a file from cloud storage if a file identifier is provided.
    /// </summary>
    /// <param name="fileId">The identifier of the file to delete. If null, no action is taken.</param>
    public async Task DeleteAsync(string? fileId)
    {
        if (fileId is not null)
        {
            await _googleCloudService.DeleteAsync(fileId);
        }
    }
}