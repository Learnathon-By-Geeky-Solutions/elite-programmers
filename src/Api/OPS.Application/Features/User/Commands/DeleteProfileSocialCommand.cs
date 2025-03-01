using ErrorOr;
using MediatR;
using OPS.Domain;

namespace OPS.Application.Features.User.Commands;

public record DeleteProfileSocialCommand(Guid ProfileSocialId) : IRequest<ErrorOr<Success>>;

public class DeleteProfileSocialCommandHandler(IUnitOfWork unitOfWork) : IRequestHandler<DeleteProfileSocialCommand, ErrorOr<Success>>
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    public async Task<ErrorOr<Success>> Handle(DeleteProfileSocialCommand request, CancellationToken cancellationToken)
    {
        var profileSocial = await _unitOfWork.ProfileSocial.GetAsync(request.ProfileSocialId, cancellationToken);

        if (profileSocial is null) return Error.NotFound();

        _unitOfWork.ProfileSocial.Remove(profileSocial);
        var result = await _unitOfWork.CommitAsync(cancellationToken);

        return result > 0
            ? Result.Success
            : Error.Failure();
    }
}