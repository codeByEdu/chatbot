using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vagas.Models
{
    [Table("VAGAS")]
    public class VAGA
    {

        [Key]
        [Column("ID_VAGA")]
        public int ID_VAGA { get; set; }

        [Column("NOME")]
        public string NOME { get; set; }

        [Column("LINK")]
        public string LINK { get; set; }

        [Column("ID_CURSO")]
        public int ID_CURSO { get; set; }

        [Column("COD_VAGA")]
        public int COD_VAGA { get; set; }

        [Column("STATUS")]
        public bool STATUS { get; set; }
    }
}
