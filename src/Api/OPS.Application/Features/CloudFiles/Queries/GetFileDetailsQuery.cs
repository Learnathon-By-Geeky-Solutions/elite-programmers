using ErrorOr;
using FluentValidation;
using MediatR;
using OPS.Application.Dtos;
using OPS.Application.Mappers;
using OPS.Domain;

namespace OPS.Application.Features.CloudFiles.Queries;

public record GetFileDetailsQuery(Guid CloudFileId) : IRequest<ErrorOr<CloudFileResponse>>;

public class GetFileDetailsQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetFileDetailsQuery, ErrorOr<CloudFileResponse>>
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    /// <summary>
    /// Handles a query to retrieve details of a cloud file by its unique identifier.
    /// </summary>
    /// <param name="request">The query containing the cloud file identifier.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>
    /// An <see cref="ErrorOr{CloudFileResponse}"/> containing the file details if found, or a not found error if the file does not exist.
    /// </returns>
    public async Task<ErrorOr<CloudFileResponse>> Handle(GetFileDetailsQuery request,
        CancellationToken cancellationToken)
    {
        var fileInfo = await _unitOfWork.CloudFile.GetAsync(request.CloudFileId, cancellationToken);

        return fileInfo is null
            ? Error.NotFound()
            : fileInfo.MapToDto();
    }
}

public class GetFileDetailsQueryValidator : AbstractValidator<GetFileDetailsQuery>
{
    /// <summary>
    /// Validates that the <c>CloudFileId</c> property of a <see cref="GetFileDetailsQuery"/> is not empty.
    /// </summary>
    public GetFileDetailsQueryValidator()
    {
        RuleFor(x => x.CloudFileId).NotEmpty();
    }
}