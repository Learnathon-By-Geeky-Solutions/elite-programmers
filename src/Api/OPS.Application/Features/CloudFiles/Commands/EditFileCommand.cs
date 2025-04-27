using ErrorOr;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using OPS.Application.Dtos;
using OPS.Application.Mappers;
using OPS.Application.Services.CloudService;
using OPS.Domain;

namespace OPS.Application.Features.CloudFiles.Commands;

public record EditFileCommand(Guid CloudFileId, IFormFile File) : IRequest<ErrorOr<CloudFileResponse>>;

public class EditFileCommandHandler(ICloudFileService cloudFileService, IUnitOfWork unitOfWork)
    : IRequestHandler<EditFileCommand, ErrorOr<CloudFileResponse>>
{
    private readonly ICloudFileService _cloudFileService = cloudFileService;
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    /// <summary>
    /// Handles the edit file command by uploading a new file, replacing the existing cloud file, and returning the updated file information.
    /// </summary>
    /// <param name="request">The command containing the ID of the file to replace and the new file to upload.</param>
    /// <param name="cancellationToken">Token for cancelling the operation.</param>
    /// <returns>An <see cref="ErrorOr{CloudFileResponse}"/> containing the updated file information or an error if the operation fails.</returns>
    public async Task<ErrorOr<CloudFileResponse>> Handle(EditFileCommand request, CancellationToken cancellationToken)
    {
        var cloudFile = await _cloudFileService.UploadAsync(request.File, cancellationToken);

        if (cloudFile is null)
        {
            return Error.Failure("Failed to upload file");
        }

        _unitOfWork.CloudFile.Add(cloudFile);
        var oldFile = await _unitOfWork.CloudFile.GetAsync(request.CloudFileId, cancellationToken);

        if (oldFile is not null)
        {
            _unitOfWork.CloudFile.Remove(oldFile);
        }

        var result = await _unitOfWork.CommitAsync(cancellationToken);

        if (result <= 0)
        {
            return Error.Failure("Failed to save file information");
        }

        _ = _cloudFileService.DeleteAsync(oldFile?.FileId);
        return cloudFile.MapToDto();
    }
}

public class EditFileCommandValidator : AbstractValidator<EditFileCommand>
{
    /// <summary>
    /// Validates the <see cref="EditFileCommand"/> to ensure the cloud file ID is provided and the uploaded file is not null or empty.
    /// </summary>
    public EditFileCommandValidator()
    {
        RuleFor(x => x.CloudFileId)
            .NotEmpty();

        RuleFor(x => x.File)
            .NotNull()
            .Must(file => file.Length > 0);
    }
}