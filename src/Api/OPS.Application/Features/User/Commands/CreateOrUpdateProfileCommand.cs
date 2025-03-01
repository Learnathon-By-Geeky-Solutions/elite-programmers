using ErrorOr;
using FluentValidation;
using MediatR;
using OPS.Application.Contracts.DtoExtensions;
using OPS.Application.Contracts.Dtos;
using OPS.Domain;
using OPS.Domain.Contracts.Core.Authentication;
using OPS.Domain.Entities.User;
using Throw;

namespace OPS.Application.Features.User.Commands;

public record CreateOrUpdateProfileCommand(
    string? FirstName,
    string? LastName,
    string? BioMarkdown,
    string? InstituteName,
    string? PhoneNumber,
    Guid? ImageFileId,
    List<ProfileSocialRequest> ProfileSocials) : IRequest<ErrorOr<ProfileResponse>>;

public class CreateOrUpdateProfileCommandHandler(IUnitOfWork unitOfWork, IUserInfoProvider userInfoProvider)
    : IRequestHandler<CreateOrUpdateProfileCommand, ErrorOr<ProfileResponse>>
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IUserInfoProvider _userInfoProvider = userInfoProvider;

    public async Task<ErrorOr<ProfileResponse>> Handle(CreateOrUpdateProfileCommand request, CancellationToken cancellationToken)
    {
        var accountId = _userInfoProvider.AccountId().ThrowIfNull("User is not authenticated");

        if (request.ImageFileId.HasValue)
        {
            var isExists = await _unitOfWork.CloudFile.IsExistsAsync(request.ImageFileId.Value, cancellationToken);
            if (!isExists) throw new ArgumentNullException(nameof(request.ImageFileId), "Image file does not exist.");
        }

        var profile = await _unitOfWork.Profile.GetByAccountId(accountId, cancellationToken);

        if (profile is null)
        {
            profile = new Profile
            {
                AccountId = accountId,
                FirstName = request.FirstName,
                LastName = request.LastName,
                BioMarkdown = request.BioMarkdown,
                InstituteName = request.InstituteName,
                PhoneNumber = request.PhoneNumber,
                ImageFileId = request.ImageFileId,
                ProfileSocials = request.ProfileSocials
                    .Select(x => new ProfileSocial { Name = x.Name!, Link = x.Link! })
                    .ToList()
            };

            _unitOfWork.Profile.Add(profile);
        }
        else
        {
            profile.FirstName = request.FirstName ?? profile.FirstName;
            profile.LastName = request.LastName ?? profile.LastName;
            profile.BioMarkdown = request.BioMarkdown ?? profile.BioMarkdown;
            profile.InstituteName = request.InstituteName ?? profile.InstituteName;
            profile.PhoneNumber = request.PhoneNumber ?? profile.PhoneNumber;

            if (request.ImageFileId.HasValue)
            {
                profile.ImageFileId = request.ImageFileId;
            }

            foreach (var profileSocial in request.ProfileSocials)
            {
                if (!profileSocial.Id.HasValue)
                {
                    var social = new ProfileSocial
                    {
                        ProfileId = profile.Id,
                        Name = profileSocial.Name!,
                        Link = profileSocial.Link!
                    };

                    _unitOfWork.ProfileSocial.Add(social);
                }
                else
                {
                    var social = await _unitOfWork.ProfileSocial.GetAsync(profileSocial.Id!.Value, cancellationToken);
                    social.ThrowIfNull("Profile social not found.");

                    social.Name = profileSocial.Name ?? social.Name;
                    social.Link = profileSocial.Link ?? social.Link;
                }
            }
        }

        var result = await _unitOfWork.CommitAsync(cancellationToken);

        if (result <= 0) return Error.Failure();
        profile = await _unitOfWork.Profile.GetByAccountId(accountId, cancellationToken);

        return profile.ToDto()!;

    }
}

public class CreateProfileCommandValidator : AbstractValidator<CreateOrUpdateProfileCommand>
{
    public CreateProfileCommandValidator()
    {
        RuleFor(command => command.FirstName)
            .MaximumLength(20)
            .When(command => !string.IsNullOrEmpty(command.FirstName));

        RuleFor(command => command.LastName)
            .MaximumLength(20)
            .When(command => !string.IsNullOrEmpty(command.LastName));

        RuleFor(command => command.BioMarkdown)
            .MaximumLength(200)
            .When(command => !string.IsNullOrEmpty(command.BioMarkdown));

        RuleFor(command => command.InstituteName)
            .MaximumLength(50)
            .When(command => !string.IsNullOrEmpty(command.InstituteName));

        RuleFor(command => command.PhoneNumber)
            .MaximumLength(20)
            .When(command => !string.IsNullOrEmpty(command.PhoneNumber));

        RuleForEach(command => command.ProfileSocials)
            .SetValidator(new ProfileSocialRequestValidator());
    }
}

public class ProfileSocialRequestValidator : AbstractValidator<ProfileSocialRequest>
{
    public ProfileSocialRequestValidator()
    {
        RuleFor(social => social.Id)
            .Must(id => !id.HasValue || id.Value != Guid.Empty)
            .When(social => social.Id.HasValue);

        RuleFor(social => social.Name)
            .NotEmpty()
            .MaximumLength(20)
            .When(social => !string.IsNullOrEmpty(social.Name));

        RuleFor(social => social.Link)
            .NotEmpty()
            .MaximumLength(200)
            .When(social => !string.IsNullOrEmpty(social.Link));
    }
}