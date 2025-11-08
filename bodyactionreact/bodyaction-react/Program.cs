using System;
using System.Linq;
using BodyAction.Data;
using BodyAction.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configurar o DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=BodyAction.db"));

var app = builder.Build();

// Garantir que o banco seja criado
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureDeleted(); // Apaga banco antigo (se existir)
    db.Database.EnsureCreated(); // Cria o banco do zero

    // Inserir planos iniciais
    if (!db.Planos.Any())
    {
        var planos = new[]
        {
            new Plano { Nome = "1 mês", Preco = 179.90m, DuracaoMeses = 1 },
            new Plano { Nome = "3 meses", Preco = 149.90m, DuracaoMeses = 3 },
            new Plano { Nome = "12 meses", Preco = 119.90m, DuracaoMeses = 12 }
        };
        db.Planos.AddRange(planos);
        db.SaveChanges();
        Console.WriteLine("Planos iniciais criados no banco!");
    }
}

// Mapear rotas (exemplo)
app.MapPost("/cadastros", async (AppDbContext db, Cadastro cadastro) =>
{
    db.Cadastros.Add(cadastro);
    await db.SaveChangesAsync();
    return Results.Ok(cadastro);
});

app.Run();
