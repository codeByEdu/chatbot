using Xunit;
using Amazon.Lambda.Core;
using Amazon.Lambda.TestUtilities;

namespace Vagas.Tests;

public class FunctionTest
{
    [Fact]
    public void TestToUpperFunction()
    {

        // Configuração do teste
        string id = "1"; // ID de teste
        ILambdaContext context = new TestLambdaContext();

        // Executa a função Lambda e armazena o resultado
        var result = Function.FunctionHandler(id, context);

        // Asserts para verificar o resultado
        Assert.NotNull(result);
        Assert.NotEmpty(result);
        Assert.True(result.Count > 0);

    }
}
