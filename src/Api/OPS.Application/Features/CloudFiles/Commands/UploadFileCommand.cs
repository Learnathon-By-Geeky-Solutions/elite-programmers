using ErrorOr;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using OPS.Application.Dtos;
using OPS.Application.Mappers;
using OPS.Application.Services.CloudService;
using OPS.Domain;
using OPS.Domain.Contracts.Core.Authentication;

namespace OPS.Application.Features.CloudFiles.Commands;

public record UploadFileCommand(IFormFile File) : IRequest<ErrorOr<CloudFileResponse>>;

public class UploadFileCommandHandler(
    ICloudFileService cloudFileService,
    IUserInfoProvider userInfoProvider,
    IUnitOfWork unitOfWork) : IRequestHandler<UploadFileCommand, ErrorOr<CloudFileResponse>>
{
    private readonly ICloudFileService _cloudFileService = cloudFileService;
    private readonly IUserInfoProvider _userInfoProvider = userInfoProvider;
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    /// <summary>
    /// Handles the upload of a file by saving it to cloud storage and persisting its metadata.
    /// </summary>
    /// <param name="request">The command containing the file to upload.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>
    /// An <see cref="ErrorOr{CloudFileResponse}"/> containing the uploaded file's details on success, or an error if the upload or persistence fails.
    /// </returns>
    public async Task<ErrorOr<CloudFileResponse>> Handle(UploadFileCommand request, CancellationToken cancellationToken)
    {
        var cloudFile = await _cloudFileService.UploadAsync(request.File, cancellationToken);

        if (cloudFile is null)
        {
            return Error.Failure("Failed to upload file");
        }

        cloudFile.AccountId = _userInfoProvider.TryGetAccountId();
        _unitOfWork.CloudFile.Add(cloudFile);

        var result = await _unitOfWork.CommitAsync(cancellationToken);

        return result > 0
            ? cloudFile.MapToDto()
            : Error.Failure("Failed to save file information");
    }
}

public class UploadFileCommandValidator : AbstractValidator<UploadFileCommand>
{
    /// <summary>
    /// Validates the <c>UploadFileCommand</c> to ensure a file is provided, is not empty, and does not exceed 100 KB in size.
    /// </summary>
    public UploadFileCommandValidator()
    {
        RuleFor(x => x.File)
            .NotNull()
            .Must(file => file.Length > 0)
            .WithMessage("No file uploaded.")
            .Must(file => file.Length <= 102400) // 100 KB limit
            .WithMessage("File size exceeds the 100 KB limit.");
    }
}