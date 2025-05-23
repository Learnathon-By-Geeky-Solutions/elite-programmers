﻿using ErrorOr;
using FluentValidation;
using MediatR;
using OPS.Application.Dtos;
using OPS.Application.Mappers;
using OPS.Domain;
using OPS.Domain.Entities.Exam;

namespace OPS.Application.Features.Exams.Commands;

public record CreateExamCommand(
    string Title,
    string Description,
    int DurationMinutes,
    decimal TotalPoints,
    DateTime OpensAt,
    DateTime ClosesAt) : IRequest<ErrorOr<ExamResponse>>;

public class CreateExamCommandHandler(IUnitOfWork unitOfWork)
    : IRequestHandler<CreateExamCommand, ErrorOr<ExamResponse>>
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    public async Task<ErrorOr<ExamResponse>> Handle(CreateExamCommand request, CancellationToken cancellationToken)
    {
        var exam = new Examination
        {
            Title = request.Title,
            DescriptionMarkdown = request.Description,
            DurationMinutes = request.DurationMinutes,
            TotalPoints = request.TotalPoints,
            OpensAt = request.OpensAt,
            ClosesAt = request.ClosesAt
        };

        _unitOfWork.Exam.Add(exam);
        var result = await _unitOfWork.CommitAsync(cancellationToken);

        return result > 0 ? exam.MapToDto() : Error.Unexpected();
    }
}

public class CreateExamCommandValidator : AbstractValidator<CreateExamCommand>
{
    public CreateExamCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty();

        RuleFor(x => x.Description)
            .NotEmpty();

        RuleFor(x => x.DurationMinutes)
            .GreaterThan(0);

        RuleFor(x => x.ClosesAt)
            .GreaterThan(x => x.OpensAt);
    }
}