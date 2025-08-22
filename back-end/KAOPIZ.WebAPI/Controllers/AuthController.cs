using KAOPIZ.Common.Interfaces;
using KAOPIZ.Common.Models;
using KAOPIZ.Common.Models.Requests;
using Microsoft.AspNetCore.Mvc;

namespace KAOPIZ.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> SignUp([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            await _authService.RegisterAsync(request);
            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var res = await _authService.LoginAsync(request);
            return Ok(res);
        }
    }
}
