using FluentAssertions;
using NSubstitute;
using OPS.Application.Dtos;
using OPS.Application.Features.AiPrompts.Queries;
using OPS.Application.Interfaces;

namespace OPS.Application.Tests.Unit.Features.AiPrompts.Queries;

public class AiGenerateProblemQueryQueryTests
{
    private readonly IAiService _aiService;
    private readonly AiGenerateProblemQueryHandler _sut;
    private readonly AiGenerateProblemQueryValidator _validator = new();

    public AiGenerateProblemQueryQueryTests()
    {
        _aiService = Substitute.For<IAiService>();
        _sut = new AiGenerateProblemQueryHandler(_aiService);
    }

    [Fact]
    public async Task Handle_WhenAiServiceReturnsResponse_ReturnsSuccess()
    {
        // Arrange
        var query = new AiGenerateProblemQuery("Test Prompt");
        var expectedResponse = new AiProblemQuestionResponse(
            "Test Statement Markdown",
            [
                new("Test Input 1", "Test Output 1"),
                new("Test Input 2", "Test Output 2")
            ]
        );

        _aiService.PromptAsync<AiProblemQuestionResponse>(Arg.Any<PromptRequest>())
            .Returns(expectedResponse);

        // Act
        var result = await _sut.Handle(query, CancellationToken.None);

        // Assert
        result.IsError.Should().BeFalse();
        result.Value.Should().BeEquivalentTo(expectedResponse);
    }

    [Fact]
    public async Task Handle_WhenAiServiceReturnsNull_ReturnsError()
    {
        // Arrange
        var query = new AiGenerateProblemQuery("Test Prompt");

        _aiService.PromptAsync<AiProblemQuestionResponse>(Arg.Any<PromptRequest>())
            .Returns((AiProblemQuestionResponse)null!);

        // Act
        var result = await _sut.Handle(query, CancellationToken.None);

        // Assert
        result.IsError.Should().BeTrue();
    }

    [Theory]
    [InlineData(null)]
    [InlineData("Test Prompt")]
    public async Task Handle_WithValidInput_ShouldNotThrowException(string? userPrompt)
    {
        // Arrange
        var query = new AiGenerateProblemQuery(userPrompt);
        var expectedResponse = new AiProblemQuestionResponse(
            "Test Statement Markdown",
            [
                new("Test Input 1", "Test Output 1"),
                new("Test Input 2", "Test Output 2")
            ]
        );

        _aiService.PromptAsync<AiProblemQuestionResponse>(Arg.Any<PromptRequest>())
            .Returns(expectedResponse);

        // Act
        var act = () => _sut.Handle(query, CancellationToken.None);

        // Assert
        await act.Should().NotThrowAsync();
    }

    [Theory]
    [InlineData(null)]
    [InlineData("Test Prompt")]
    public void Validate_WithValidInput_ShouldNotHaveErrors(string? userPrompt)
    {
        // Arrange
        var query = new AiGenerateProblemQuery(userPrompt);

        // Act
        var result = _validator.Validate(query);

        // Assert
        result.IsValid.Should().BeTrue();
    }
}