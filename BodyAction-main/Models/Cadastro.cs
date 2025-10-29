using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BodyAction.Models
{
    public class Cadastro
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public required string Nome { get; set; }

        [Required, MaxLength(14)]
        public required string Cpf { get; set; }

        [Required, EmailAddress]
        public required string Email { get; set; }

        [Required, DataType(DataType.Date)]
        public DateTime DataNascimento { get; set; }

        [Required, Phone]
        public required string Telefone { get; set; }

        // Ligação com o Plano escolhido
        [Required]
        public int PlanoId { get; set; }

        [ForeignKey("PlanoId")]
        public Plano Plano { get; set; } = null!;
    }
}
