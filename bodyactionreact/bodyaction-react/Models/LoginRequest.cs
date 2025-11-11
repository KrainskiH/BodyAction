namespace BodyAction.Models
{
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public string Identificador { get; set; } = string.Empty; // Pode ser nome ou email
    }
}