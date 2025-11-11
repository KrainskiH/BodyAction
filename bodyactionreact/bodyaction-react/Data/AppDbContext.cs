using Microsoft.EntityFrameworkCore;
using BodyAction.Models;

namespace BodyAction.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // Apenas as entidades que realmente existem:
        public DbSet<Cadastro> Cadastros => Set<Cadastro>();
        public DbSet<Contato> Contatos => Set<Contato>();
        public DbSet<Plano> Planos => Set<Plano>();
    }
}
