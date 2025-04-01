﻿namespace OPS.Application.Dtos;

public record ExamResponse(
    Guid ExamId,
    string Title,
    string Description,
    int DurationMinutes,
    string Status,
    DateTime OpensAt,
    DateTime ClosesAt
);

public record ExamWithQuestionsResponse(
    Guid ExamId,
    string Title,
    string Description,
    int DurationMinutes,
    string Status,
    DateTime OpensAt,
    DateTime ClosesAt,
    QuestionResponses Questions
);

public record QuestionResponses(
    List<ProblemQuestionResponse> Problem,
    List<WrittenQuestionResponse> Written,
    List<McqQuestionResponse> Mcq
);

public record ExamQuesWithSubmissionResponse(
    Guid ExamId,
    string Title,
    int DurationMinutes,
    int TotalPoints,
    AccountResponse Account,
    ExamResultsResponse Results,
    QuestionsWithSubmissionResponse QuestionsWithSubmission
);

public record ExamResultsResponse(
    decimal Score,
    DateTime? StartedAt,
    DateTime? SubmittedAt,
    bool HasCheated
);

public record QuestionsWithSubmissionResponse(
    List<ProblemQuesWithSubmissionResponse?> Problem,
    List<WrittenQuesWithSubmissionResponse?> Written,
    List<McqQuesWithSubmissionResponse?> Mcq
);

public record ExamStartResponse(
    Guid ExamId,
    DateTime StartedAt,
    DateTime ClosesAt,
    QuestionResponses Questions,
    SubmitResponse Submits
);

public record ExamSubmissionResponse(
    Guid ExamId,
    Guid AccountId,
    SubmissionResponse Submission
);

public record ExamCandidatesResponse(
    Guid AccountId,
    string Username,
    string Email,
    
    int DurationMinutes,
    DateTime OpensAt,
    DateTime ClosesAt,
    List<CandidateResultResponse> Candidates
);

public record CandidateResultResponse(
    Guid AccountId,
    string Username,
    string Email,
    Guid ExamId,
    int DurationMinutes,
    bool IsReviewed,
    DateTime StartedAt,
    DateTime? SubmittedAt,
    bool HasCheated,
    decimal TotalPoints,
    decimal? TotalScore,
    decimal ProblemSolvingPoints,
    decimal? ProblemSolvingScore,
    decimal WrittenPoints,
    decimal? WrittenScore,
    decimal McqPoints,
    decimal? McqScore
);