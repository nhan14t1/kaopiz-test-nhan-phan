using KAOPIZ.Common.Interfaces;
using KAOPIZ.Common.Models;
using KAOPIZ.Common.Models.Requests;
using KAOPIZ.Common.Models.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

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

        [HttpGet("test-data")]
        [Authorize(Roles = "Admin, Partner, User")]
        public async Task<IActionResult> TestData()
        {
            await Task.Delay(10); // Simulate async operation
            return Ok("Ok");
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                var accessToken = await _authService.RefreshTokenAsync(request);

                return Ok(new UserResponse
                {
                    AccessToken = accessToken,
                });
            }
            catch (SecurityTokenException e)
            {
                return Unauthorized(e.Message);
            }
        }
    }
}
