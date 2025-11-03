namespace BodyAction.Models
{
    public class Contato
    {
        public int Id { get; set; }                 // Chave primária
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Mensagem { get; set; } = string.Empty;

        public DateTime DataEnvio { get; set; } = DateTime.Now;
    }
}
