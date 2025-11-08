using System;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using BodyAction.Data;
using BodyAction.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configurar JSON com opções mais flexíveis
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.SerializerOptions.PropertyNameCaseInsensitive = true;
    options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

// Configurar o DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=BodyAction.db"));

// Adicionar CORS para permitir requisições do frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5000", "http://127.0.0.1:5000", "http://localhost:5001", "http://127.0.0.1:5001")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Usar CORS
app.UseCors("AllowFrontend");

// Health Check Endpoint para o start.bat
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.Now }));

// Garantir que o banco seja criado com nova estrutura
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    // Apenas criar o banco se não existir
    db.Database.EnsureCreated(); // Cria o banco com nova estrutura

    // Verificar quantos cadastros existem
    var totalCadastros = db.Cadastros.Count();
    Console.WriteLine($"📊 Total de cadastros no banco: {totalCadastros}");

    // Inserir planos iniciais apenas se não existirem
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

// Endpoint de teste simples para debug de JSON
app.MapPost("/api/test-json", async (HttpContext context) =>
{
    try
    {
        // Ler o corpo da requisição como string primeiro
        using var reader = new StreamReader(context.Request.Body);
        var body = await reader.ReadToEndAsync();
        
        Console.WriteLine($"🔬 TESTE JSON - Corpo recebido: '{body}'");
        Console.WriteLine($"🔬 TESTE JSON - Content-Type: {context.Request.ContentType}");
        Console.WriteLine($"🔬 TESTE JSON - Headers: {string.Join(", ", context.Request.Headers.Keys)}");
        
        // Sempre retornar JSON válido
        return Results.Json(new { 
            success = true, 
            message = "Endpoint teste funcionando!", 
            received_body = body,
            content_type = context.Request.ContentType,
            body_length = body.Length
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ ERRO no teste: {ex}");
        return Results.Json(new { 
            success = false, 
            message = "Erro no teste: " + ex.Message 
        });
    }
});

// Endpoint de teste simples
app.MapPost("/api/test-cadastro", async (object dados) =>
{
    Console.WriteLine($"🔬 TESTE RECEBIDO: {dados}");
    return Results.Json(new { 
        success = true, 
        message = "Teste funcionando!", 
        received = dados 
    });
});

// Mapear rotas (exemplo)
app.MapPost("/api/cadastro", async (HttpContext context, AppDbContext db) =>
{
    Console.WriteLine("🔄 ENDPOINT CADASTRO ACESSADO");
    
    try
    {
        // Primeiro, ler o body da requisição como string
        using var reader = new StreamReader(context.Request.Body);
        var body = await reader.ReadToEndAsync();
        Console.WriteLine($"🔄 BODY RAW RECEBIDO: {body}");
        Console.WriteLine($"🔄 CONTENT-TYPE: {context.Request.ContentType}");
        
        // Tentar deserializar manualmente
        Cadastro? cadastro = null;
        try
        {
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };
            
            // Debug: tentar parsear como JSON primeiro para ver a estrutura
            var jsonDocument = JsonDocument.Parse(body);
            Console.WriteLine($"🔬 JSON ESTRUTURA:");
            foreach (var property in jsonDocument.RootElement.EnumerateObject())
            {
                Console.WriteLine($"   - {property.Name}: {property.Value}");
            }
            
            // Tentar deserialização com debugging extra
            try
            {
                cadastro = JsonSerializer.Deserialize<Cadastro>(body, options);
                Console.WriteLine($"🔄 DESERIALIAZÇÃO SUCESSO: Nome={cadastro?.Nome}, Email={cadastro?.Email}, Senha={(!string.IsNullOrEmpty(cadastro?.Senha) ? "PREENCHIDA" : "VAZIA")}, PlanoId={cadastro?.PlanoId}");
            }
            catch (Exception deserEx)
            {
                Console.WriteLine($"❌ ERRO na deserialização automática: {deserEx.Message}");
                
                // Fallback: mapear manualmente
                var root = jsonDocument.RootElement;
                cadastro = new Cadastro
                {
                    Nome = root.TryGetProperty("nome", out var nomeEl) ? nomeEl.GetString() ?? string.Empty : string.Empty,
                    Cpf = root.TryGetProperty("cpf", out var cpfEl) ? cpfEl.GetString() ?? string.Empty : string.Empty,
                    Email = root.TryGetProperty("email", out var emailEl) ? emailEl.GetString() ?? string.Empty : string.Empty,
                    DataNascimento = root.TryGetProperty("dataNascimento", out var dataEl) ? DateTime.Parse(dataEl.GetString() ?? "1900-01-01") : DateTime.MinValue,
                    Telefone = root.TryGetProperty("telefone", out var telEl) ? telEl.GetString() ?? string.Empty : string.Empty,
                    Senha = root.TryGetProperty("senha", out var senhaEl) ? senhaEl.GetString() ?? string.Empty : string.Empty,
                    PlanoId = root.TryGetProperty("planoId", out var planoEl) ? planoEl.GetInt32() : 0
                };
                
                Console.WriteLine($"🔄 MAPEAMENTO MANUAL SUCESSO: Nome={cadastro.Nome}, Email={cadastro.Email}, Senha={(!string.IsNullOrEmpty(cadastro.Senha) ? "PREENCHIDA" : "VAZIA")}, PlanoId={cadastro.PlanoId}");
            }
        }
        catch (JsonException jsonEx)
        {
            Console.WriteLine($"❌ ERRO DE DESERIALIZAÇÃO: {jsonEx}");
            Console.WriteLine($"❌ DETALHES DO ERRO: {jsonEx.Message}");
            Console.WriteLine($"❌ PATH DO ERRO: {jsonEx.Path}");
            Console.WriteLine($"❌ LINE NUMBER: {jsonEx.LineNumber}");
            return Results.Json(new {
                success = false,
                message = "Erro na deserialização: " + jsonEx.Message,
                receivedBody = body,
                errorPath = jsonEx.Path,
                lineNumber = jsonEx.LineNumber
            }, statusCode: 400);
        }
        
        Console.WriteLine($"🔄 CADASTRO PROCESSADO: Nome={cadastro?.Nome}, Email={cadastro?.Email}, Senha={(string.IsNullOrEmpty(cadastro?.Senha) ? "VAZIA" : "PREENCHIDA")}, PlanoId={cadastro?.PlanoId}");
        
        if (cadastro == null)
        {
            Console.WriteLine("❌ ERRO: Cadastro é null");
            var errorResponse = new {
                success = false,
                message = "Dados de cadastro não fornecidos"
            };
            Console.WriteLine($"🔄 Retornando erro: {System.Text.Json.JsonSerializer.Serialize(errorResponse)}");
            return Results.Json(errorResponse, statusCode: 400);
        }
        
        // Validações programáticas
        if (string.IsNullOrEmpty(cadastro.Nome))
        {
            Console.WriteLine("❌ ERRO: Nome é obrigatório");
            return Results.Json(new {
                success = false,
                message = "Nome é obrigatório"
            }, statusCode: 400);
        }
        
        if (string.IsNullOrEmpty(cadastro.Email))
        {
            Console.WriteLine("❌ ERRO: Email é obrigatório");
            return Results.Json(new {
                success = false,
                message = "Email é obrigatório"
            }, statusCode: 400);
        }
        
        if (string.IsNullOrEmpty(cadastro.Senha))
        {
            Console.WriteLine("❌ ERRO: Senha é obrigatória");
            return Results.Json(new {
                success = false,
                message = "Senha é obrigatória"
            }, statusCode: 400);
        }
        
        if (cadastro.Senha.Length < 6)
        {
            Console.WriteLine("❌ ERRO: Senha deve ter pelo menos 6 caracteres");
            return Results.Json(new {
                success = false,
                message = "Senha deve ter pelo menos 6 caracteres"
            }, statusCode: 400);
        }
        
        // Verificar se email já existe
        var emailExiste = await db.Cadastros.AnyAsync(c => c.Email == cadastro.Email);
        if (emailExiste)
        {
            Console.WriteLine($"❌ ERRO: Email {cadastro.Email} já existe");
            return Results.Json(new {
                success = false,
                message = "Este email já está cadastrado"
            }, statusCode: 400);
        }
        
        // Validar se o plano existe
        var planoExiste = await db.Planos.AnyAsync(p => p.Id == cadastro.PlanoId);
        if (!planoExiste)
        {
            Console.WriteLine($"❌ ERRO: Plano {cadastro.PlanoId} não existe");
            return Results.Json(new {
                success = false,
                message = $"Plano com ID {cadastro.PlanoId} não encontrado"
            }, statusCode: 400);
        }
        
        db.Cadastros.Add(cadastro);
        var result = await db.SaveChangesAsync();
        
        Console.WriteLine($"✅ SUCESSO: Cadastro salvo! Registros afetados: {result}");
        
        return Results.Json(new { 
            success = true, 
            message = "Cadastro realizado com sucesso!",
            data = new {
                cadastro.Id,
                cadastro.Nome,
                cadastro.Email,
                cadastro.Cpf,
                cadastro.DataNascimento,
                cadastro.Telefone,
                cadastro.PlanoId
            }
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ ERRO DETALHADO: {ex}");
        return Results.Json(new {
            success = false,
            message = "Erro ao realizar cadastro: " + ex.Message
        }, statusCode: 500);
    }
});

app.MapGet("/api/planos", async (AppDbContext db) =>
{
    var planos = await db.Planos.ToListAsync();
    return Results.Ok(planos);
});

// Endpoint para listar todos os cadastros (para verificação)
app.MapGet("/api/cadastros", async (AppDbContext db) =>
{
    var cadastros = await db.Cadastros.Include(c => c.Plano).ToListAsync();
    return Results.Ok(new { 
        total = cadastros.Count, 
        cadastros = cadastros.Select(c => new {
            c.Id,
            c.Nome,
            c.Email,
            c.Cpf,
            c.DataNascimento,
            c.Telefone,
            Plano = c.Plano?.Nome,
            PlanoId = c.PlanoId
        })
    });
});

// Login - verificar se usuário existe com nome/email e senha
app.MapPost("/api/login", async (LoginRequest request, AppDbContext db) =>
{
    try 
    {
        Console.WriteLine($"🔄 LOGIN TENTATIVA: Identificador={request.Identificador}, Email={request.Email}, Nome={request.Nome}");
        
        // Buscar usuário por email, nome ou identificador
        var usuario = await db.Cadastros.Include(c => c.Plano)
            .FirstOrDefaultAsync(c => 
                (c.Email == request.Email && !string.IsNullOrEmpty(request.Email)) ||
                (c.Nome == request.Nome && !string.IsNullOrEmpty(request.Nome)) ||
                (c.Email == request.Identificador || c.Nome == request.Identificador) &&
                c.Senha == request.Senha);
            
        if (usuario == null)
        {
            Console.WriteLine("❌ LOGIN FALHOU: Credenciais inválidas");
            return Results.Json(new { 
                success = false, 
                message = "Nome/Email ou senha incorretos" 
            }, statusCode: 401);
        }
        
        Console.WriteLine($"✅ LOGIN SUCESSO: {usuario.Nome} ({usuario.Email})");
        
        return Results.Json(new { 
            success = true, 
            message = "Login realizado com sucesso!",
            usuario = new {
                usuario.Id,
                usuario.Nome,
                usuario.Email,
                usuario.Cpf,
                usuario.DataNascimento,
                usuario.Telefone,
                Plano = usuario.Plano?.Nome,
                usuario.PlanoId
            }
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ ERRO LOGIN: {ex}");
        return Results.Json(new { 
            success = false, 
            message = "Erro no login: " + ex.Message 
        }, statusCode: 500);
    }
});

// Atualizar dados do usuário
app.MapPut("/api/cadastro/{id}", async (int id, Cadastro cadastroAtualizado, AppDbContext db) =>
{
    try 
    {
        var cadastroExistente = await db.Cadastros.FindAsync(id);
        if (cadastroExistente == null)
        {
            return Results.NotFound(new { success = false, message = "Usuário não encontrado" });
        }
        
        cadastroExistente.Nome = cadastroAtualizado.Nome;
        cadastroExistente.Email = cadastroAtualizado.Email;
        cadastroExistente.Telefone = cadastroAtualizado.Telefone;
        cadastroExistente.PlanoId = cadastroAtualizado.PlanoId;
        // CPF e DataNascimento não alteramos por segurança
        
        await db.SaveChangesAsync();
        
        return Results.Ok(new { 
            success = true, 
            message = "Dados atualizados com sucesso!",
            usuario = cadastroExistente
        });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { success = false, message = "Erro ao atualizar: " + ex.Message });
    }
});

// Deletar conta
app.MapDelete("/api/cadastro/{id}", async (int id, AppDbContext db) =>
{
    try 
    {
        var cadastro = await db.Cadastros.FindAsync(id);
        if (cadastro == null)
        {
            return Results.NotFound(new { success = false, message = "Usuário não encontrado" });
        }
        
        db.Cadastros.Remove(cadastro);
        await db.SaveChangesAsync();
        
        return Results.Ok(new { success = true, message = "Conta excluída com sucesso!" });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { success = false, message = "Erro ao excluir: " + ex.Message });
    }
});

// Endpoint de teste simples
app.MapGet("/api/test", () =>
{
    return Results.Ok(new { message = "API funcionando!", timestamp = DateTime.Now });
});

// Endpoint de POST de teste
app.MapPost("/api/test", (object data) =>
{
    Console.WriteLine($"Dados recebidos no teste: {data}");
    return Results.Ok(new { message = "POST funcionando!", receivedData = data });
});

// Configurar para rodar na porta 5001
app.Run("http://localhost:5001");
