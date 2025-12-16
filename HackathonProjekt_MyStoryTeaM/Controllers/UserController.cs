namespace HackathonProjekt_MyStoryTeaM.Controllers
{
    using HackathonProjekt_MyStoryTeaM.Data;
    using HackathonProjekt_MyStoryTeaM.DTOs;
    using HackathonProjekt_MyStoryTeaM.Models;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;

    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Name and password are required.");
            }

            var user = new UserData
            {
                Name = request.Name,
                Password = request.Password
            };

            bool exists = await _context.UserData
            .AnyAsync(u => u.Name == user.Name);

            if (exists)
            {
                return BadRequest("User name already exists.");
            }

            _context.UserData.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(CreateUser),
                new { id = user.IdUser },
                user
            );
        }
    }
}
