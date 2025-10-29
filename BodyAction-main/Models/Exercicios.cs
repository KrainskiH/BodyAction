namespace AlphaFit.Models;

public class Exercicio
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Nome { get; set; } = default!;

    // FK para Treino
    public Guid TreinoId { get; set; }
    public Treino? Treino { get; set; }

    public Exercicio() { }
    public Exercicio(string nome) => Nome = nome;
}