namespace OPS.Infrastructure.EmailSender;

public class EmailSettings
{
    private readonly string _password = null!;

    public string Server { get; init; } = null!;
    public int Port { get; init; }
    public string Email { get; init; } = null!;

    public string Password
    {
        get => _password;
        init => _password = value.Replace(" ", "");
    }
}