using System.Text.RegularExpressions;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OPS.Application.Dtos;
using OPS.Application.Interfaces;
using OPS.Infrastructure.Gemini.Configuration;
using OPS.Infrastructure.Gemini.Refit;
using Serilog;

namespace OPS.Infrastructure.Gemini;

/// <summary>
/// Implementation of the <see cref="IAiService"/> interface for interacting with the Gemini AI model.
/// </summary>
internal class GeminiService(IGeminiClient geminiClient, IOptions<GeminiSettings> settings) : IAiService
{
    private readonly IGeminiClient _geminiClient = geminiClient;
    private readonly string _apiKey = settings.Value.ApiKey;
    private readonly string _model = settings.Value.Model;

    /// <inheritdoc />
    public async Task<T?> PromptAsync<T>(PromptRequest prompt)
    {
        try
        {
            var geminiRequest = new
            {
                systemInstruction = new
                {
                    parts = new[] { new { text = prompt.Instruction } }
                },
                contents = new[]
                {
                    new
                    {
                        role = "user",
                        parts = prompt.Contents.Select(part => new { text = part }).ToArray()
                    }
                }
            };

            var jsonPayload = JsonConvert.SerializeObject(geminiRequest);

            var response = await _geminiClient.SendRequestAsync(jsonPayload, _model, _apiKey);

            if (string.IsNullOrEmpty(response))
            {
                Log.Error("Received empty response from Gemini API.");
                return default;
            }

            var parsedResponse = JObject.Parse(response);
            var error = parsedResponse["error"];

            if (error != null)
            {
                var errorMessage = error["message"]?.ToString();
                Log.Error("Gemini API returned an error: {ErrorMessage}", errorMessage);
                return default;
            }

            var reviewText = parsedResponse["candidates"]?
                .FirstOrDefault()?
                .SelectToken("content.parts[0].text")?.ToString();

            if (!string.IsNullOrEmpty(reviewText))
            {
                // Remove the enclosing Markdown JSON code block markers (```json and ```)
                var cleanJson = Regex.Replace(reviewText, @"```json\n|\n```", string.Empty);

                // Escape inline LaTeX-style math expressions ($...$) by wrapping them with
                // backticks and doubling the dollar signs
                cleanJson = Regex.Replace(cleanJson, @"\$(.*?)\$", match => $"`$${match.Groups[1].Value}$$`");

                return typeof(T) == typeof(string)
                    ? (T)(object)cleanJson
                    : JsonConvert.DeserializeObject<T>(cleanJson);
            }

            Log.Error("Review text not found in the response.");
            return default;
        }
        catch (Exception ex)
        {
            Log.Error("An error occurred while processing the Gemini request: {Message}", ex.Message);
            return default;
        }
    }
}