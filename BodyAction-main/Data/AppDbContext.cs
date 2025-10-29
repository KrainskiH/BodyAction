using Microsoft.EntityFrameworkCore;
using AlphaFit.Models;

namespace AlphaFit.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Aluno> Alunos => Set<Aluno>();
    public DbSet<Instrutor> Instrutores => Set<Instrutor>();
    public DbSet<Treino> Treinos => Set<Treino>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Exercicio> Exercicios => Set<Exercicio>(); // 👈 novo

    protected override void OnModelCreating(ModelBuilder mb)
    {
        // Treino -> Instrutor (muitos Treinos para 1 Instrutor)
        mb.Entity<Treino>()
          .HasOne(t => t.Responsavel)
          .WithMany() // se tiver coleção de treinos no Instrutor, troque por .WithMany(i => i.Treinos)
          .HasForeignKey(t => t.InstrutorId)
          .OnDelete(DeleteBehavior.Restrict);

        // Treino (1) -> (N) Exercicios
        mb.Entity<Exercicio>()
          .HasOne(e => e.Treino)
          .WithMany(t => t.Exercicios)
          .HasForeignKey(e => e.TreinoId);

        base.OnModelCreating(mb);
    }
}