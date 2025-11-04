using BodyAction.Models;
using BodyAction.Data;
using Microsoft.EntityFrameworkCore;

public partial class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        /*configurar o DbContext com SQlite*/
        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlite(builder.Configuration.GetConnectionString("Default")));
        /*Configurar CORS (caso vá usar frontend separado)*/
        builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
            p.AllowAnyOrigin() // Permite qualquer origem (localhost:5000 pode acessar)
             .AllowAnyHeader()
             .AllowAnyMethod()
        ));

        var app = builder.Build();

        app.UseCors();

        /* Health-check*/
        app.MapGet("/", () => Results.Ok(new { api = "BodyAction Minimal API", status = "ok" }));
        /* Endpoints para Cadastro | checar esse trecho de codigo depois, temporario para conserto do banco*/
        app.MapGet("/cadastros", async (AppDbContext db) =>
            Results.Ok(await db.Cadastros.ToListAsync()));

        app.MapGet("/cadastros/{id}", async (int id, AppDbContext db) =>
        {
            var c = await db.Cadastros.FindAsync(id);
            return c is null ? Results.NotFound() : Results.Ok(c);
        });

        app.MapPost("/cadastros", async (Cadastro dto, AppDbContext db) =>
        {
            await db.Cadastros.AddAsync(dto);
            await db.SaveChangesAsync();
            return Results.Created($"/cadastros/{dto.Id}", dto);
        });

        app.MapPut("/cadastros/{id}", async (int id, Cadastro dto, AppDbContext db) =>
        {
            var c = await db.Cadastros.FindAsync(id);
            if (c is null) return Results.NotFound();

            // Atualiza campos (exemplo: Nome e Email)
            c.Nome = dto.Nome;
            c.Email = dto.Email;

            await db.SaveChangesAsync();
            return Results.Ok(c);
        });

        app.MapDelete("/cadastros/{id}", async (int id, AppDbContext db) =>
        {
            var c = await db.Cadastros.FindAsync(id);
            if (c is null) return Results.NotFound();

            db.Cadastros.Remove(c);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        // --- Endpoints para Contato ---
        app.MapGet("/contatos", async (AppDbContext db) =>
            Results.Ok(await db.Contatos.ToListAsync()));

        app.MapPost("/contatos", async (Contato dto, AppDbContext db) =>
        {
            await db.Contatos.AddAsync(dto);
            await db.SaveChangesAsync();
            return Results.Created($"/contatos/{dto.Id}", dto);
        });

        // --- Endpoints para Plano ---
        app.MapGet("/planos", async (AppDbContext db) =>
            Results.Ok(await db.Planos.ToListAsync()));

        app.MapPost("/planos", async (Plano dto, AppDbContext db) =>
        {
            await db.Planos.AddAsync(dto);
            await db.SaveChangesAsync();
            return Results.Created($"/planos/{dto.Id}", dto);
        });

        app.Run();
    }
}