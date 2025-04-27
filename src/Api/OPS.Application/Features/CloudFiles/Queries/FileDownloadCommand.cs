using ErrorOr;
using FluentValidation;
using MediatR;
using OPS.Application.Dtos;
using OPS.Application.Services.CloudService;

namespace OPS.Application.Features.CloudFiles.Queries;

public record FileDownloadCommand(string FileId) : IRequest<ErrorOr<FileDownloadResponse>>;

public class FileDownloadCommandHandler(ICloudFileService cloudFileService)
    : IRequestHandler<FileDownloadCommand, ErrorOr<FileDownloadResponse>>
{
    private readonly ICloudFileService _cloudFileService = cloudFileService;

    /// <summary>
    /// Handles a file download request by retrieving the file with the specified ID.
    /// </summary>
    /// <param name="request">The file download command containing the file ID.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>
    /// An <see cref="ErrorOr{FileDownloadResponse}"/> containing the file download response if found, or a not found error if the file does not exist.
    /// </returns>
    public async Task<ErrorOr<FileDownloadResponse>> Handle(FileDownloadCommand request,
        CancellationToken cancellationToken)
    {
        var file = await _cloudFileService.DownloadAsync(request.FileId);

        return file is null
            ? Error.NotFound()
            : file;
    }
}

public class FileDownloadCommandValidator : AbstractValidator<FileDownloadCommand>
{
    /// <summary>
    /// Validates that the <c>FileId</c> property of a <see cref="FileDownloadCommand"/> is not empty.
    /// </summary>
    public FileDownloadCommandValidator()
    {
        RuleFor(x => x.FileId).NotEmpty();
    }
}