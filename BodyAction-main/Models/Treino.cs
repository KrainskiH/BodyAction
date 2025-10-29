namespace AlphaFit.Models;

public enum NivelTreino { Iniciante, Intermediario, Avancado }

public class Treino
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Nome { get; set; } = default!;
    public NivelTreino Nivel { get; set; }

    // Relacionamento com Instrutor
    public Guid InstrutorId { get; set; }
    public Instrutor? Responsavel { get; set; }

    // Coleção mapeável pelo EF
    public List<Exercicio> Exercicios { get; set; } = new();

    // ⚠️ Construtor sem parâmetros para o EF
    public Treino() { }

    // Construtor de conveniência para seu domínio (opcional)
    public Treino(string nome, NivelTreino nivel, Instrutor responsavel, IEnumerable<string> exerciciosIniciais)
    {
        Nome = nome;
        Nivel = nivel;
        Responsavel = responsavel;
        InstrutorId = responsavel.Id;
        if (exerciciosIniciais != null)
            Exercicios = exerciciosIniciais.Select(e => new Exercicio(e)).ToList();
    }

    public void AdicionarExercicio(string nome)
    {
        Exercicios.Add(new Exercicio(nome));
    }

    public override string ToString() => $"{Nome} ({Nivel}) - {Exercicios.Count} exercícios";
}