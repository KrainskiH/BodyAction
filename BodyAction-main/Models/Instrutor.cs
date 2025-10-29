namespace AlphaFit.Models;

public class Instrutor
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Nome { get; set; } = default!;
    public string Especialidade { get; set; } = default!;

    public Instrutor() { }
    public Instrutor(string nome, string especialidade)
    {
        Nome = nome;
        Especialidade = especialidade;
    }

    public Treino CriarTreino(string nome, NivelTreino nivel, IEnumerable<string> exercicios)
        => new Treino(nome, nivel, this, exercicios);
}