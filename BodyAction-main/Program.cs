using AlphaFit.Models;
using AlphaFit.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

//  ADICIONE SERVIÇOS AQUI (antes do Build)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("http://127.0.0.1:5500", "http://localhost:5500")
     .AllowAnyHeader()
     .AllowAnyMethod()
));

//  NÃO ADICIONE NADA EM builder.Services DEPOIS DESTE PONTO
var app = builder.Build();

app.UseCors();

// Health-check
app.MapGet("/", () => Results.Ok(new { api = "AlphaFit Minimal API", status = "ok" }));

// --- endpoints (iguais aos que já passamos) ---
app.MapGet("/alunos", async (AppDbContext db) =>
    Results.Ok(await db.Alunos.ToListAsync()));

app.MapGet("/alunos/{email}", async (string email, AppDbContext db) =>
{
    var a = await db.Alunos.FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower());
    return a is null ? Results.NotFound() : Results.Ok(a);
});

app.MapPost("/alunos", async (AlunoDto dto, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(dto.Nome) || string.IsNullOrWhiteSpace(dto.Email))
        return Results.BadRequest(new { erro = "Nome e Email são obrigatórios." });

    var existe = await db.Alunos.AnyAsync(a => a.Email.ToLower() == dto.Email.ToLower());
    if (existe) return Results.Conflict(new { erro = "Já existe aluno com esse email." });

    var novo = new Aluno(dto.Nome, dto.Email);
    if (dto.Plano is not null) novo.Matricular(dto.Plano.Value);

    await db.Alunos.AddAsync(novo);
    await db.SaveChangesAsync();

    return Results.Created($"/alunos/{novo.Email}", novo);
});

app.MapPut("/alunos/{email}", async (string email, AtualizarAlunoDto dto, AppDbContext db) =>
{
    var a = await db.Alunos.FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower());
    if (a is null) return Results.NotFound();

    if (!string.IsNullOrWhiteSpace(dto.Nome)) a.Nome = dto.Nome!;
    if (dto.Plano is not null) a.Matricular(dto.Plano.Value);

    await db.SaveChangesAsync();
    return Results.Ok(a);
});

app.MapDelete("/alunos/{email}", async (string email, AppDbContext db) =>
{
    var a = await db.Alunos.FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower());
    if (a is null) return Results.NotFound();

    db.Alunos.Remove(a);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();

/* DTOs */
public record AlunoDto(string Nome, string Email, Plano? Plano);
public record AtualizarAlunoDto(string? Nome, Plano? Plano);
public record InstrutorDto(string Nome, string Especialidade);
public record CriarTreinoDto(string Nome, NivelTreino Nivel, string InstrutorNome, string[]? Exercicios);