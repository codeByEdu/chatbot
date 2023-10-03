using Microsoft.EntityFrameworkCore;
using Vagas.Models;

namespace Vagas.Context
{
    public class VagasContext : DbContext
    {
        public VagasContext(DbContextOptions<VagasContext> options) : base(options)
        {

        }

        public DbSet<VAGA> VAGAS { get; set; }
        public DbSet<CURSO> CURSOS { get; set; }
    }
}
