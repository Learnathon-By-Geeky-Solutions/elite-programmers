using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OPS.Api.Common;
using OPS.Api.Common.ErrorResponses;
using OPS.Application.Dtos;
using OPS.Application.Features.CloudFiles.Commands;
using OPS.Application.Features.CloudFiles.Queries;
using OPS.Domain.Contracts.Core.GoogleCloud;
using static Microsoft.AspNetCore.Http.StatusCodes;

namespace OPS.Api.Controllers;

[Route("CloudFile")]
[ProducesResponseType<ValidationErrorResponse>(Status400BadRequest)]
[ProducesResponseType<ExceptionResponse>(Status500InternalServerError)]
public class CloudController(IMediator mediator) : BaseApiController
{
    private readonly IMediator _mediator = mediator;

    /// <summary>Uploads a file to Google Cloud.</summary>
    /// <param name="file">File to upload (Max file size: 100 KB).</param>
    /// <param name="cancellationToken">Request cancellation token.</param>
    /// <summary>
    /// Handles uploading a file to Google Cloud storage.
    /// </summary>
    /// <param name="file">The file to upload (maximum size 100 KB).</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>Information about the uploaded file.</returns>
    [AllowAnonymous]
    [HttpPost("Upload")]
    [Consumes("multipart/form-data")]
    [EndpointDescription("Uploads a file to Google Cloud.")]
    [ProducesResponseType<CloudFileResponse>(Status200OK)]
    [ProducesResponseType<UnauthorizedResponse>(Status401Unauthorized)]
    public async Task<IActionResult> UploadAsync(IFormFile file, CancellationToken cancellationToken)
    {
        var command = new UploadFileCommand(file);
        var response = await _mediator.Send(command, cancellationToken);
        return ToResult(response);
    }

    /// <summary>Gets file details from Google Cloud.</summary>
    /// <param name="cloudFileId">Cloud File ID.</param>
    /// <param name="cancellationToken">Request cancellation token.</param>
    /// <summary>
    /// Retrieves details for a cloud file by its unique identifier.
    /// </summary>
    /// <param name="cloudFileId">The GUID of the cloud file to retrieve.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>The file details if found; otherwise, a not found response.</returns>
    [AllowAnonymous]
    [HttpGet("Details/{cloudFileId:guid}")]
    [ProducesResponseType<CloudFileResponse>(Status200OK)]
    [ProducesResponseType<NotFoundResponse>(Status404NotFound)]
    public async Task<IActionResult> GetFileDetailsAsync(Guid cloudFileId, CancellationToken cancellationToken)
    {
        var query = new GetFileDetailsQuery(cloudFileId);
        var response = await _mediator.Send(query, cancellationToken);
        return ToResult(response);
    }

    /// <summary>Edits a file from Google Cloud.</summary>
    /// <param name="cloudFileId">Cloud File ID.</param>
    /// <param name="file">File to edit.</param>
    /// <param name="cancellationToken">Request cancellation token.</param>
    /// <summary>
    /// Updates an existing file in Google Cloud storage with a new file.
    /// </summary>
    /// <param name="cloudFileId">The unique identifier of the file to edit.</param>
    /// <param name="file">The new file to replace the existing content.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>The updated file information if successful; otherwise, an appropriate error response.</returns>
    [Authorize]
    [HttpPut("Edit/{cloudFileId}")]
    [Consumes("multipart/form-data")]
    [EndpointDescription("Edits a file in Google Cloud.")]
    [ProducesResponseType<CloudFileResponse>(Status200OK)]
    [ProducesResponseType<UnauthorizedResponse>(Status401Unauthorized)]
    [ProducesResponseType<NotFoundResponse>(Status404NotFound)]
    public async Task<IActionResult> EditFileAsync(Guid cloudFileId, IFormFile file,
        CancellationToken cancellationToken)
    {
        var command = new EditFileCommand(cloudFileId, file);
        var response = await _mediator.Send(command, cancellationToken);
        return ToResult(response);
    }

    /// <summary>Downloads a file from Google Cloud.</summary>
    /// <param name="fileId">File ID.</param>
    /// <param name="cancellationToken">Request cancellation token.</param>
    /// <summary>
    /// Downloads a file from cloud storage by its identifier.
    /// </summary>
    /// <param name="fileId">The unique identifier of the file to download.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>The file content as a downloadable response, or a not found result if the file does not exist.</returns>
    [AllowAnonymous]
    [HttpGet("Download/{fileId}")]
    [ProducesResponseType<GoogleFileDownload>(Status200OK)]
    [ProducesResponseType<NotFoundResponse>(Status404NotFound)]
    public async Task<IActionResult> DownloadFileAsync(string fileId, CancellationToken cancellationToken)
    {
        var command = new FileDownloadCommand(fileId);
        var response = await _mediator.Send(command, cancellationToken);

        if (response.IsError)
        {
            return ToResult(response);
        }

        var file = response.Value;
        return File(file.Bytes, file.ContentType, file.FileName);
    }

    /// <summary>Deletes a file from Google Cloud.</summary>
    /// <param name="cloudFileId">Cloud File ID.</param>
    /// <param name="cancellationToken">Request cancellation token.</param>
    /// <summary>
    /// Deletes a cloud file identified by its GUID.
    /// </summary>
    /// <param name="cloudFileId">The unique identifier of the cloud file to delete.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>An HTTP result indicating success, unauthorized access, or not found.</returns>
    [Authorize]
    [HttpDelete("Delete/{cloudFileId}")]
    [ProducesResponseType(Status200OK)]
    [ProducesResponseType<UnauthorizedResponse>(Status401Unauthorized)]
    [ProducesResponseType<NotFoundResponse>(Status404NotFound)]
    public async Task<IActionResult> DeleteFileAsync(Guid cloudFileId, CancellationToken cancellationToken)
    {
        var command = new DeleteFileCommand(cloudFileId);
        var response = await _mediator.Send(command, cancellationToken);
        return ToResult(response);
    }
}