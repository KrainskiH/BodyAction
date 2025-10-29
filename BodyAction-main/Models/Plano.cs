namespace AlphaFit.Models;

// Enum dos planos + extensão com preço mensal (ajuda nas estatísticas)
public enum Plano
{
    Basico = 1,
    Plus = 2,
    Premium = 3
}

public static class PlanoPrecoExtensions
{
    public static decimal PrecoMensal(this Plano plano) => plano switch
    {
        Plano.Basico  => 79.90m,
        Plano.Plus    => 109.90m,
        Plano.Premium => 149.90m,
        _ => 0m
    };
}
