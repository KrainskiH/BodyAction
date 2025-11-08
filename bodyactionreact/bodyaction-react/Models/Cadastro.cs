using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BodyAction.Models
{
    public class Cadastro
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(100)]
        [JsonPropertyName("nome")]
        public string Nome { get; set; } = string.Empty;

        [MaxLength(14)]
        [JsonPropertyName("cpf")]
        public string Cpf { get; set; } = string.Empty;

        [EmailAddress]
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [DataType(DataType.Date)]
        [JsonPropertyName("dataNascimento")]
        public DateTime DataNascimento { get; set; }

        [Phone]
        [JsonPropertyName("telefone")]
        public string Telefone { get; set; } = string.Empty;

        [MinLength(6)]
        [JsonPropertyName("senha")]
        public string Senha { get; set; } = string.Empty;

        // Ligação com o Plano escolhido
        [JsonPropertyName("planoId")]
        public int PlanoId { get; set; }

        [ForeignKey("PlanoId")]
        public Plano Plano { get; set; } = null!;
    }
}
