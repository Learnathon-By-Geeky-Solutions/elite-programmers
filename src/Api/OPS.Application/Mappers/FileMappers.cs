using OPS.Application.Dtos;
using OPS.Domain.Contracts.Core.GoogleCloud;
using OPS.Domain.Entities.Core;

namespace OPS.Application.Mappers;

public static class FileMappers
{
    /// <summary>
    /// Maps a <see cref="GoogleFile"/> object to a <see cref="CloudFile"/> entity, optionally associating it with an account ID.
    /// </summary>
    /// <param name="googleFile">The Google file to map, or <c>null</c> to return <c>null</c>.</param>
    /// <param name="accountId">Optional account identifier to associate with the cloud file.</param>
    /// <returns>A new <see cref="CloudFile"/> instance with properties copied from <paramref name="googleFile"/>, or <c>null</c> if <paramref name="googleFile"/> is <c>null</c>.</returns>
    public static CloudFile? MapToCloudFile(this GoogleFile? googleFile, Guid? accountId = null)
    {
        return googleFile is null
            ? null
            : new CloudFile
            {
                FileId = googleFile.CloudFileId,
                Name = googleFile.Name,
                ContentType = googleFile.ContentType,
                Size = googleFile.Size,
                AccountId = accountId
            };
    }

    /// <summary>
    /// Maps a <see cref="CloudFile"/> entity to a <see cref="CloudFileResponse"/> DTO, including generated Google Drive URLs for content download, web view, and direct access.
    /// </summary>
    /// <param name="imageFile">The cloud file entity to map.</param>
    /// <returns>A <see cref="CloudFileResponse"/> containing file metadata and related Google Drive links.</returns>
    public static CloudFileResponse MapToDto(this CloudFile imageFile)
    {
        return new CloudFileResponse(
            imageFile.Id,
            imageFile.FileId,
            imageFile.Name,
            imageFile.ContentType,
            imageFile.Size,
            imageFile.FileId.ToWebContentLink(),
            imageFile.FileId.ToWebViewLink(),
            imageFile.FileId.ToDirectLink(),
            imageFile.CreatedAt
        );
    }

    /// <summary>
    /// Maps a <see cref="GoogleFileDownload"/> object to a <see cref="FileDownloadResponse"/> DTO containing file metadata and content.
    /// </summary>
    /// <param name="googleFile">The Google file download object to map.</param>
    /// <returns>A <see cref="FileDownloadResponse"/> with the file's name, content type, size, and byte content.</returns>
    public static FileDownloadResponse MapToDto(this GoogleFileDownload googleFile)
    {
        return new FileDownloadResponse(
            googleFile.Name,
            googleFile.ContentType,
            googleFile.Size,
            googleFile.Bytes
        );
    }

    /// <summary>
        /// Generates a Google Drive direct download URL for the specified file ID.
        /// </summary>
        /// <param name="fileId">The Google Drive file identifier.</param>
        /// <returns>A URL string for downloading the file's content.</returns>
        private static string ToWebContentLink(this string fileId) =>
        $"https://drive.google.com/uc?id={fileId}&export=download";

    /// <summary>
        /// Generates a Google Drive web view URL for the specified file ID.
        /// </summary>
        /// <param name="fileId">The unique identifier of the Google Drive file.</param>
        /// <returns>A URL string for viewing the file in Google Drive.</returns>
        private static string ToWebViewLink(this string fileId) =>
        $"https://drive.google.com/file/d/{fileId}/view?usp=drivesdk";

    /// <summary>
        /// Generates a direct image link URL for a Google Drive file using its file ID.
        /// </summary>
        /// <param name="fileId">The unique identifier of the Google Drive file.</param>
        /// <returns>A direct image link URL for the specified file.</returns>
        private static string ToDirectLink(this string fileId) =>
        $"https://lh3.googleusercontent.com/d/{fileId}";
}