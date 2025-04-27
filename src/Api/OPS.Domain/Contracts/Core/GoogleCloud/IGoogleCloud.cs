namespace OPS.Domain.Contracts.Core.GoogleCloud;

public interface IGoogleCloudService
{
    /// <summary>
/// Asynchronously uploads a file to Google Cloud storage from the provided stream.
/// </summary>
/// <param name="stream">The data stream containing the file to upload.</param>
/// <param name="fileName">The name to assign to the uploaded file.</param>
/// <param name="contentType">The MIME type of the file.</param>
/// <returns>A <see cref="GoogleFile"/> object representing the uploaded file, or null if the upload fails.</returns>
Task<GoogleFile?> UploadAsync(Stream stream, string fileName, string contentType);
    /// <summary>
/// Retrieves metadata information for a file in Google Cloud storage by its file ID.
/// </summary>
/// <param name="fileId">The unique identifier of the file.</param>
/// <returns>A <see cref="GoogleFile"/> object containing file metadata, or null if the file does not exist.</returns>
Task<GoogleFile?> InfoAsync(string fileId);
    /// <summary>
/// Downloads a file from Google Cloud storage by its file ID.
/// </summary>
/// <param name="fileId">The unique identifier of the file to download.</param>
/// <returns>A <see cref="GoogleFileDownload"/> object containing the file's data and metadata, or null if the file does not exist.</returns>
Task<GoogleFileDownload?> DownloadAsync(string fileId);
    /// <summary>
/// Deletes a file from Google Cloud storage by its file ID.
/// </summary>
/// <param name="fileId">The unique identifier of the file to delete.</param>
Task DeleteAsync(string fileId);
}