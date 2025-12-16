using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace HackathonProjekt_MyStoryTeaM.Models
{

    [Table("USER_DATA")]
    public class UserData
    {
        [Key]
        [NotNull]
        [Column("ID_USER")]
        public int IdUser { get; set; }

        [Required]
        [NotNull]
        [Column("NAME")]
        public string Name { get; set; }

        [Required]
        [NotNull]
        [Column("PASSWORD")]
        public string Password { get; set; }
    }

}
