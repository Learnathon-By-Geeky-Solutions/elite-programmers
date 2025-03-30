﻿using ErrorOr;
using MediatR;
using OPS.Application.Dtos;
using OPS.Application.Mappers;
using OPS.Domain;

namespace OPS.Application.Features.Examinations.Queries;

public record GetAllExamsQuery : IRequest<ErrorOr<List<ExamResponse>>>;

public class GetAllExamsQueryHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<GetAllExamsQuery, ErrorOr<List<ExamResponse>>>
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    public async Task<ErrorOr<List<ExamResponse>>> Handle(GetAllExamsQuery request, CancellationToken cancellationToken)
    {
        var exams = await _unitOfWork.Exam.GetAsync(cancellationToken);

        return exams.Select(e => e.MapToDto()).ToList();
    }
}