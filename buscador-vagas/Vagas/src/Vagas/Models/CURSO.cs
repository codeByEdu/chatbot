using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vagas.Models
{
    [Table("VAGAS")]
    public class CURSO
    {
        [Key]
        [Column("ID_CURSO")]
        public int ID_CURSO { get; set; }
        [Column("NOME")]
        public string NOME { get; set; }
    }
}
