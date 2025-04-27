using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace OPS.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CreateDatabase : Migration
    {
        /// <summary>
        /// Applies the initial migration to create all schemas, tables, relationships, seed data, and indexes required for the examination platform database.
        /// </summary>
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "User");

            migrationBuilder.EnsureSchema(
                name: "Core");

            migrationBuilder.EnsureSchema(
                name: "Enum");

            migrationBuilder.EnsureSchema(
                name: "Exam");

            migrationBuilder.EnsureSchema(
                name: "Submit");

            migrationBuilder.CreateTable(
                name: "Accounts",
                schema: "User",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NewId()"),
                    Username = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Salt = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "DateTime", nullable: false, defaultValueSql: "GetUtcDate()"),
                    UpdatedAt = table.Column<DateTime>(type: "DateTime", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedAt = table.Column<DateTime>(type: "DateTime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AdminInvites",
                schema: "User",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NewId()"),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "DateTime", nullable: false, defaultValueSql: "GetUtcDate()"),
                    UpdatedAt = table.Column<DateTime>(type: "DateTime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminInvites", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Difficulties",
                schema: "Enum",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DifficultyName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Difficulties", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Examinations",
                schema: "Exam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NewId()"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    DescriptionMarkdown = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TotalPoints = table.Column<decimal>(type: "decimal(10,2)", nullable: false, defaultValueSql: "((0))"),
                    ProblemSolvingPoints = table.Column<decimal>(type: "decimal(10,2)", nullable: false, defaultValueSql: "((0))"),
                    WrittenPoints = table.Column<decimal>(type: "decimal(10,2)", nullable: false, defaultValueSql: "((0))"),
                    McqPoints = table.Column<decimal>(type: "decimal(10,2)", nullable: false, defaultValueSql: "((0))"),
                    DurationMinutes = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    OpensAt = table.Column<DateTime>(type: "DateTime", nullable: false),
                    ClosesAt = table.Column<DateTime>(type: "DateTime", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "DateTime", nullable: false, defaultValueSql: "GetUtcDate()"),
                    UpdatedAt = table.Column<DateTime>(type: "DateTime", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedAt = table.Column<DateTime>(type: "DateTime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Examinations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LogEvents",
                schema: "Core",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MessageTemplate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Level = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TimeStamp = table.Column<DateTime>(type: "datetime", nullable: true),
                    Exception = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Properties = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogEvents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Otps",
                schema: "User",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NewId()"),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "DateTime", nullable: false, defaultValueSql: "(DateAdd(minute, (5), GetUtcDate()))"),
                    Attempts = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    CreatedAt = table.Column<DateTime>(type: "DateTime", nullable: false, defaultValueSql: "GetUtcDate()"),
                    UpdatedAt = table.Column<DateTime>(type: "DateTime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Otps", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "QuestionTypes",
                schema: "Enum",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                schema: "Enum",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CloudFiles",
                schema: "Core",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NewId()"),
                    FileId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ContentType = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Size = table.Column<long>(type: "bigint", nullable: false),
                    AccountId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "DateTime", nullable: false, defaultValueSql: "GetUtcDate()"),
                    UpdatedAt = table.Column<DateTime>(type: "DateTime", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedAt = table.Column<DateTime>(type: "DateTime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CloudFiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CloudFiles_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalSchema: "User",
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ExamCandidates",
                schema: "Exam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NewId()"),
                    CandidateEmail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ProblemSolvingScore = table.Column<decimal>(type: "decimal(10,2)", nullable: false, defaultValueSql: "((0))"),
                    WrittenScore = table.Column<decimal>(type: "decimal(10,2)", nullable: false, defaultValueSql: "((0))"),
                    McqScore = table.Column<decimal>(type: "decimal(10,2)", nullable: false, defaultValueSql: "((0))"),
                    StartedAt = table.Column<DateTime>(type: "DateTime", nullable: true),
                    SubmittedAt = table.Column<DateTime>(type: "DateTime", nullable: true),
                    HasCheated = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsReviewed = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    AccountId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ExaminationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "DateTime", nullable: false, defaultValueSql: "GetUtcDate()"),
                    UpdatedAt = table.Column<DateTime>(type: "DateTime", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedAt = table.Column<DateTime>(type: "DateTime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExamCandidates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExamCandidates_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalSchema: "User",
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ExamCandidates_Examinations_ExaminationId",
                        column: x => x.ExaminationId,
                        principalSchema: "Exam",
                        principalTable: "Examinations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Questions",
                schema: "Exam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NewId()"),
                    StatementMarkdown = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Points = table.Column<decimal>(type: "decimal(10,2)", nullable: false, defaultValueSql: "((0))"),
                    HasLongAnswer = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    QuestionTypeId = table.Column<int>(type: "int", nullable: false),
                    DifficultyId = table.Column<int>(type: "int", nullable: false),
                    ExaminationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "DateTime", nullable: false, defaultValueSql: "GetUtcDate()"),
                    UpdatedAt = table.Column<DateTime>(type: "DateTime", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedAt = table.Column<DateTime>(type: "DateTime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Questions_Difficulties_DifficultyId",
                        column: x => x.DifficultyId,
                        principalSchema: "Enum",
                        principalTable: "Difficulties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Questions_Examinations_ExaminationId",
                        column: x => x.ExaminationId,
                        principalSchema: "Exam",
                        principalTable: "Examinations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Questions_QuestionTypes_QuestionTypeId",
                        column: x => x.QuestionTypeId,
                        principalSchema: "Enum",
                        principalTable: "QuestionTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AccountRoles",
                schema: "User",
                columns: table => new
                {
                    AccountId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccountRoles", x => new { x.AccountId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AccountRoles_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalSchema: "User",
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AccountRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "Enum",
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Profiles",
                schema: "User",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NewId()"),
                    FirstName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Bio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InstituteName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    AccountId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ImageFileId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "DateTime", nullable: false, defaultValueSql: "GetUtcDate()"),
                    UpdatedAt = table.Column<DateTime>(type: "DateTime", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedAt = table.Column<DateTime>(type: "DateTime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Profiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Profiles_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalSchema: "User",
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Profiles_CloudFiles_ImageFileId",
                        column: x => x.ImageFileId,
                        principalSchema: "Core",
                        principalTable: "CloudFiles",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "McqOption",
                schema: "Exam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NewId()"),
                    Option1 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Option2 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Option3 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Option4 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsMultiSelect = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    AnswerOptions = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    QuestionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "DateTime", nullable: false, defaultValueSql: "GetUtcDate()"),
                    UpdatedAt = table.Column<DateTime>(type: "DateTime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_McqOption", x => x.Id);
                    table.ForeignKey(
                        name: "FK_McqOption_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalSchema: "Exam",
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProblemSubmissions",
                schema: "Submit",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NewId()"),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LanguageId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Attempts = table.Column<int>(type: "int", nullable: false),
                    Score = table.Column<decimal>(type: "decimal(10,2)", nullable: false, defaultValueSql: "((0))"),
                    IsFlagged = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    FlagReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AccountId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    QuestionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "DateTime", nullable: false, defaultValueSql: "GetUtcDate()"),
                    UpdatedAt = table.Column<DateTime>(type: "DateTime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProblemSubmissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProblemSubmissions_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalSchema: "User",
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProblemSubmissions_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalSchema: "Exam",
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TestCases",
                schema: "Exam",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NewId()"),
                    Input = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExpectedOutput = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    QuestionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "DateTime", nullable: false, defaultValueSql: "GetUtcDate()"),
                    UpdatedAt = table.Column<DateTime>(type: "DateTime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestCases", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TestCases_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalSchema: "Exam",
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "WrittenSubmissions",
                schema: "Submit",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NewId()"),
                    Answer = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Score = table.Column<decimal>(type: "decimal(10,2)", nullable: false, defaultValueSql: "((0))"),
                    IsFlagged = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    FlagReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    QuestionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AccountId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "DateTime", nullable: false, defaultValueSql: "GetUtcDate()"),
                    UpdatedAt = table.Column<DateTime>(type: "DateTime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WrittenSubmissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WrittenSubmissions_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalSchema: "User",
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WrittenSubmissions_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalSchema: "Exam",
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProfileLinks",
                schema: "User",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NewId()"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Link = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "DateTime", nullable: false, defaultValueSql: "GetUtcDate()"),
                    UpdatedAt = table.Column<DateTime>(type: "DateTime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfileLinks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfileLinks_Profiles_ProfileId",
                        column: x => x.ProfileId,
                        principalSchema: "User",
                        principalTable: "Profiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "McqSubmissions",
                schema: "Submit",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NewId()"),
                    AnswerOptions = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Score = table.Column<decimal>(type: "decimal(10,2)", nullable: false, defaultValueSql: "((0))"),
                    AccountId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    McqOptionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    QuestionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "DateTime", nullable: false, defaultValueSql: "GetUtcDate()"),
                    UpdatedAt = table.Column<DateTime>(type: "DateTime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_McqSubmissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_McqSubmissions_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalSchema: "User",
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_McqSubmissions_McqOption_McqOptionId",
                        column: x => x.McqOptionId,
                        principalSchema: "Exam",
                        principalTable: "McqOption",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_McqSubmissions_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalSchema: "Exam",
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TestCaseOutputs",
                schema: "Submit",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NewId()"),
                    ReceivedOutput = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsAccepted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    TestCaseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProblemSubmissionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "DateTime", nullable: false, defaultValueSql: "GetUtcDate()"),
                    UpdatedAt = table.Column<DateTime>(type: "DateTime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestCaseOutputs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TestCaseOutputs_ProblemSubmissions_ProblemSubmissionId",
                        column: x => x.ProblemSubmissionId,
                        principalSchema: "Submit",
                        principalTable: "ProblemSubmissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TestCaseOutputs_TestCases_TestCaseId",
                        column: x => x.TestCaseId,
                        principalSchema: "Exam",
                        principalTable: "TestCases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                schema: "Enum",
                table: "Difficulties",
                columns: new[] { "Id", "DifficultyName" },
                values: new object[,]
                {
                    { 1, "Easy" },
                    { 2, "Medium" },
                    { 3, "Hard" }
                });

            migrationBuilder.InsertData(
                schema: "Enum",
                table: "QuestionTypes",
                columns: new[] { "Id", "Type" },
                values: new object[,]
                {
                    { 1, "Problem Solving" },
                    { 2, "Written" },
                    { 3, "MCQ" }
                });

            migrationBuilder.InsertData(
                schema: "Enum",
                table: "Roles",
                columns: new[] { "Id", "RoleName" },
                values: new object[,]
                {
                    { 1, "Candidate" },
                    { 2, "Moderator" },
                    { 3, "Admin" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AccountRoles_RoleId",
                schema: "User",
                table: "AccountRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_Email",
                schema: "User",
                table: "Accounts",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_IsActive",
                schema: "User",
                table: "Accounts",
                column: "IsActive",
                filter: "[IsActive] = 1");

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_IsDeleted",
                schema: "User",
                table: "Accounts",
                column: "IsDeleted",
                filter: "[IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_Username",
                schema: "User",
                table: "Accounts",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CloudFiles_AccountId",
                schema: "Core",
                table: "CloudFiles",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_CloudFiles_IsActive",
                schema: "Core",
                table: "CloudFiles",
                column: "IsActive",
                filter: "[IsActive] = 1");

            migrationBuilder.CreateIndex(
                name: "IX_CloudFiles_IsDeleted",
                schema: "Core",
                table: "CloudFiles",
                column: "IsDeleted",
                filter: "[IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_Difficulties_DifficultyName",
                schema: "Enum",
                table: "Difficulties",
                column: "DifficultyName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ExamCandidates_AccountId",
                schema: "Exam",
                table: "ExamCandidates",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamCandidates_ExaminationId",
                schema: "Exam",
                table: "ExamCandidates",
                column: "ExaminationId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamCandidates_IsActive",
                schema: "Exam",
                table: "ExamCandidates",
                column: "IsActive",
                filter: "[IsActive] = 1");

            migrationBuilder.CreateIndex(
                name: "IX_ExamCandidates_IsDeleted",
                schema: "Exam",
                table: "ExamCandidates",
                column: "IsDeleted",
                filter: "[IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_Examinations_IsActive",
                schema: "Exam",
                table: "Examinations",
                column: "IsActive",
                filter: "[IsActive] = 1");

            migrationBuilder.CreateIndex(
                name: "IX_Examinations_IsDeleted",
                schema: "Exam",
                table: "Examinations",
                column: "IsDeleted",
                filter: "[IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_McqOption_QuestionId",
                schema: "Exam",
                table: "McqOption",
                column: "QuestionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_McqSubmissions_AccountId",
                schema: "Submit",
                table: "McqSubmissions",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_McqSubmissions_McqOptionId",
                schema: "Submit",
                table: "McqSubmissions",
                column: "McqOptionId");

            migrationBuilder.CreateIndex(
                name: "IX_McqSubmissions_QuestionId",
                schema: "Submit",
                table: "McqSubmissions",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_ProblemSubmissions_AccountId",
                schema: "Submit",
                table: "ProblemSubmissions",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_ProblemSubmissions_QuestionId",
                schema: "Submit",
                table: "ProblemSubmissions",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfileLinks_ProfileId",
                schema: "User",
                table: "ProfileLinks",
                column: "ProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_Profiles_AccountId",
                schema: "User",
                table: "Profiles",
                column: "AccountId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Profiles_ImageFileId",
                schema: "User",
                table: "Profiles",
                column: "ImageFileId",
                unique: true,
                filter: "[ImageFileId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Profiles_IsActive",
                schema: "User",
                table: "Profiles",
                column: "IsActive",
                filter: "[IsActive] = 1");

            migrationBuilder.CreateIndex(
                name: "IX_Profiles_IsDeleted",
                schema: "User",
                table: "Profiles",
                column: "IsDeleted",
                filter: "[IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_DifficultyId",
                schema: "Exam",
                table: "Questions",
                column: "DifficultyId");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_ExaminationId",
                schema: "Exam",
                table: "Questions",
                column: "ExaminationId");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_IsActive",
                schema: "Exam",
                table: "Questions",
                column: "IsActive",
                filter: "[IsActive] = 1");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_IsDeleted",
                schema: "Exam",
                table: "Questions",
                column: "IsDeleted",
                filter: "[IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_QuestionTypeId",
                schema: "Exam",
                table: "Questions",
                column: "QuestionTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionTypes_Type",
                schema: "Enum",
                table: "QuestionTypes",
                column: "Type",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Roles_RoleName",
                schema: "Enum",
                table: "Roles",
                column: "RoleName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TestCaseOutputs_ProblemSubmissionId",
                schema: "Submit",
                table: "TestCaseOutputs",
                column: "ProblemSubmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_TestCaseOutputs_TestCaseId",
                schema: "Submit",
                table: "TestCaseOutputs",
                column: "TestCaseId");

            migrationBuilder.CreateIndex(
                name: "IX_TestCases_QuestionId",
                schema: "Exam",
                table: "TestCases",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_WrittenSubmissions_AccountId",
                schema: "Submit",
                table: "WrittenSubmissions",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_WrittenSubmissions_QuestionId",
                schema: "Submit",
                table: "WrittenSubmissions",
                column: "QuestionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AccountRoles",
                schema: "User");

            migrationBuilder.DropTable(
                name: "AdminInvites",
                schema: "User");

            migrationBuilder.DropTable(
                name: "ExamCandidates",
                schema: "Exam");

            migrationBuilder.DropTable(
                name: "LogEvents",
                schema: "Core");

            migrationBuilder.DropTable(
                name: "McqSubmissions",
                schema: "Submit");

            migrationBuilder.DropTable(
                name: "Otps",
                schema: "User");

            migrationBuilder.DropTable(
                name: "ProfileLinks",
                schema: "User");

            migrationBuilder.DropTable(
                name: "TestCaseOutputs",
                schema: "Submit");

            migrationBuilder.DropTable(
                name: "WrittenSubmissions",
                schema: "Submit");

            migrationBuilder.DropTable(
                name: "Roles",
                schema: "Enum");

            migrationBuilder.DropTable(
                name: "McqOption",
                schema: "Exam");

            migrationBuilder.DropTable(
                name: "Profiles",
                schema: "User");

            migrationBuilder.DropTable(
                name: "ProblemSubmissions",
                schema: "Submit");

            migrationBuilder.DropTable(
                name: "TestCases",
                schema: "Exam");

            migrationBuilder.DropTable(
                name: "CloudFiles",
                schema: "Core");

            migrationBuilder.DropTable(
                name: "Questions",
                schema: "Exam");

            migrationBuilder.DropTable(
                name: "Accounts",
                schema: "User");

            migrationBuilder.DropTable(
                name: "Difficulties",
                schema: "Enum");

            migrationBuilder.DropTable(
                name: "Examinations",
                schema: "Exam");

            migrationBuilder.DropTable(
                name: "QuestionTypes",
                schema: "Enum");
        }
    }
}
