namespace AlphaFit.Models;

public class Aluno
{
    // Encapsulamento: Id e alguns sets são privados para manter consistência
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string Nome { get; set; }
    public string Email { get; private set; }

    // Relacionamentos
    public Plano?  PlanoAtual  { get; private set; }
    public Treino? TreinoAtual { get; private set; }

    // Construtor com validação mínima
    public Aluno(string nome, string email)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("Nome é obrigatório.");
        if (string.IsNullOrWhiteSpace(email) || !email.Contains('@'))
            throw new ArgumentException("Email inválido.");

        Nome  = nome.Trim();
        Email = email.Trim();
    }

    public void AtualizarEmail(string novoEmail)
    {
        if (string.IsNullOrWhiteSpace(novoEmail) || !novoEmail.Contains('@'))
            throw new ArgumentException("Email inválido.");
        Email = novoEmail.Trim();
    }

    // Regras simples
    public void Matricular(Plano plano) => PlanoAtual = plano;

    public void AtribuirTreino(Treino treino)
    {
        TreinoAtual = treino ?? throw new ArgumentNullException(nameof(treino));
    }

    public void Apresentar()
        => Console.WriteLine($"Aluno: {Nome} | Email: {Email} | Plano: {PlanoAtual?.ToString() ?? "—"}");
}
