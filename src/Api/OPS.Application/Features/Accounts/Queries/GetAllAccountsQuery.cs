using ErrorOr;
using MediatR;
using OPS.Application.Contracts.DtoExtensions;
using OPS.Application.Contracts.Dtos;
using OPS.Domain;

namespace OPS.Application.Features.Accounts.Queries;

public record GetAllAccountsQuery : IRequest<ErrorOr<List<AccountResponse>>>;

public class GetAllAccountsQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetAllAccountsQuery, ErrorOr<List<AccountResponse>>>
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    public async Task<ErrorOr<List<AccountResponse>>> Handle(GetAllAccountsQuery request, CancellationToken cancellationToken)
    {
        var accounts = await _unitOfWork.Account.GetAllWithDetails(cancellationToken);

        return accounts.Select(a => a.ToDto()).ToList();
    }
}