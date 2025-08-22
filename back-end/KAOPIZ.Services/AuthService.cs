using KAOPIZ.Common.Constants;
using KAOPIZ.Common.Interfaces;
using KAOPIZ.Common.Models;
using KAOPIZ.Common.Models.Requests;
using KAOPIZ.Common.Models.Responses;
using KAOPIZ.Common.Securities;
using KAOPIZ.Common.Utils;

namespace KAOPIZ.Services
{
    public class AuthService : IAuthService
    {
        private readonly IJwtProvider _jwtProvider;
        public AuthService(IJwtProvider jwtProvider)
        {
            _jwtProvider = jwtProvider;
        }

        public static List<User> MOCK_USERS = new List<User>
        {
            new User
            {
                Id = Guid.NewGuid(),
                UserName = "admin",
                Password = CryptoUtils.HashPassword("123456"),
                Type = UserType.Admin
            },
            new User
            {
                Id = Guid.NewGuid(),
                UserName = "user",
                Password = CryptoUtils.HashPassword("123456"),
                Type = UserType.User
            }
        };

        public async Task<UserResponse> LoginAsync(LoginRequest request)
        {
            await Task.Delay(10); // Simulate async operation
            var user = await ValidateAndGetUserAsync(request);
            var claims = _jwtProvider.GetClaims(user);
            var jwtResult = _jwtProvider.GenerateTokens(request.UserName, claims, DateTime.UtcNow);

            return new UserResponse
            {
                Id = user.Id,
                UserName = user.UserName,
                Type = user.Type,
                AccessToken = jwtResult.AccessToken,
                RefreshToken = jwtResult.RefreshToken
            };
        }

        private async Task<User> ValidateAndGetUserAsync(LoginRequest request)
        {
            await Task.Delay(10); // Simulate async operation
            var lowerUserName = request.UserName.ToLowerInvariant();
            var user = MOCK_USERS.FirstOrDefault(u => u.UserName == lowerUserName);

            if (user == null || CryptoUtils.HashPassword(request.Password) != user.Password)
            {
                throw new UnauthorizedAccessException("User not found");
            }

            return user;
        }

        public async Task RegisterAsync(RegisterRequest request)
        {
            await Task.Delay(10); // Simulate async operation
            ValidateRegisterRequest(request);
            var user = new User
            {
                Id = Guid.NewGuid(),
                UserName = request.UserName,
                Password = CryptoUtils.HashPassword(request.Password),
                Type = request.Type
            };
            MOCK_USERS.Add(user);
        }

        private void ValidateRegisterRequest(RegisterRequest request)
        {
            if (MOCK_USERS.Any(u => u.UserName.Equals(request.UserName, StringComparison.OrdinalIgnoreCase)))
            {
                throw new InvalidOperationException("User already exists");
            }
        }

        public async Task<string> RefreshTokenAsync(RefreshTokenRequest request)
        {
            await Task.Delay(10); // Simulate async operation
            var jwtResult = _jwtProvider.Refresh(request.AccessToken, DateTime.UtcNow);
            return jwtResult.AccessToken;
        }
    }
}
