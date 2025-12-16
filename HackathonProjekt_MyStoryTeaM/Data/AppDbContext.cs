using Microsoft.EntityFrameworkCore;

namespace HackathonProjekt_MyStoryTeaM.Data
{

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
        public DbSet<Models.UserData> UserData { get; set; }
    }
}
