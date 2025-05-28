using ErrorOr;
using FluentAssertions;
using FluentValidation.TestHelper;
using NSubstitute;
using OPS.Application.Features.Exams.Commands;
using OPS.Domain;
using OPS.Domain.Entities.Exam;

namespace OPS.Application.Tests.Unit.Features.Exams.Commands;

public class PublishExamCommandTests
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly PublishExamCommandHandler _sut;
    private readonly PublishExamCommandValidator _validator = new();
    private readonly Examination _existingExam;

    public PublishExamCommandTests()
    {
        _unitOfWork = Substitute.For<IUnitOfWork>();
        _sut = new PublishExamCommandHandler(_unitOfWork);

        _existingExam = new Examination
        {
            Id = Guid.NewGuid(),
            Title = "Test Exam",
            IsPublished = false,
            TotalPoints = 100,
            Questions = new List<Question>
            {
                new() { Id = Guid.NewGuid(), Points = 50 },
                new() { Id = Guid.NewGuid(), Points = 50 }
            }
        };
    }

    [Fact]
    public async Task Handle_WhenValidRequest_ShouldPublishExam()
    {
        // Arrange
        var command = new PublishExamCommand(_existingExam.Id);

        _unitOfWork.Exam.GetWithQuestionsAsync(command.ExamId, Arg.Any<CancellationToken>())
            .Returns(_existingExam);

        _unitOfWork.CommitAsync(Arg.Any<CancellationToken>())
            .Returns(1);

        // Act
        var result = await _sut.Handle(command, CancellationToken.None);

        // Assert
        result.IsError.Should().BeFalse();
        result.Value.Should().Be(Result.Success);
        _existingExam.IsPublished.Should().BeTrue();

        await _unitOfWork.Received(1).CommitAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_WhenExamNotFound_ShouldReturnNotFoundError()
    {
        // Arrange
        var command = new PublishExamCommand(Guid.NewGuid());

        _unitOfWork.Exam.GetWithQuestionsAsync(command.ExamId, Arg.Any<CancellationToken>())
            .Returns((Examination?)null);

        // Act
        var result = await _sut.Handle(command, CancellationToken.None);

        // Assert
        result.IsError.Should().BeTrue();
        result.FirstError.Type.Should().Be(ErrorType.NotFound);

        await _unitOfWork.DidNotReceive().CommitAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_WhenPointsMismatch_ShouldReturnConflictError()
    {
        // Arrange
        var examWithMismatchedPoints = new Examination
        {
            Id = Guid.NewGuid(),
            Title = "Mismatched Points Exam",
            IsPublished = false,
            TotalPoints = 100,
            Questions = new List<Question>
            {
                new() { Id = Guid.NewGuid(), Points = 40 },
                new() { Id = Guid.NewGuid(), Points = 40 }
            }
        };

        var command = new PublishExamCommand(examWithMismatchedPoints.Id);

        _unitOfWork.Exam.GetWithQuestionsAsync(command.ExamId, Arg.Any<CancellationToken>())
            .Returns(examWithMismatchedPoints);

        // Act
        var result = await _sut.Handle(command, CancellationToken.None);

        // Assert
        result.IsError.Should().BeTrue();
        result.FirstError.Type.Should().Be(ErrorType.Conflict);

        await _unitOfWork.DidNotReceive().CommitAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public void Validate_WhenValidCommand_ShouldNotHaveValidationErrors()
    {
        // Arrange
        var command = new PublishExamCommand(Guid.NewGuid());

        // Act & Assert
        _validator.TestValidate(command).ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_WhenExamIdIsEmpty_ShouldHaveValidationError()
    {
        // Arrange
        var command = new PublishExamCommand(Guid.Empty);

        // Act & Assert
        _validator.TestValidate(command)
            .ShouldHaveValidationErrorFor(x => x.ExamId);
    }
}