namespace BodyAction.Models
{
    public class Plano
    {
        public int Id { get; set; }               // Chave primária
        public string Nome { get; set; } = string.Empty;  // Nome do plano (ex: "Mensal", "Anual")
        public decimal Preco { get; set; }                 // Valor do plano
        public int DuracaoMeses { get; set; }              // Quantos meses dura o plano
    }
}
