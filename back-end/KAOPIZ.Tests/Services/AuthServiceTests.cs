using KAOPIZ.Common.Models.Businesses;
using KAOPIZ.Common.Models.Requests;
using KAOPIZ.Common.Securities;
using KAOPIZ.Services;
using Moq;
using System.Security.Claims;

namespace KAOPIZ.Tests.Services
{
    public class AuthServiceTests
    {
        private readonly AuthService _authService;
        private readonly Mock<IJwtProvider> _jwtProviderMock;

        public AuthServiceTests()
        {
            _jwtProviderMock = new Mock<IJwtProvider>();
            _authService = new AuthService(_jwtProviderMock.Object);
        }

        [Fact]
        public async Task Login_UserNotFound_ThrowsUnauthorizedAccessException()
        {
            // Arrange
            var emptyloginRequest = new LoginRequest { UserName = "", Password = "" };
            var failedloginRequest = new LoginRequest { UserName = "admin", Password = "123" };

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _authService.LoginAsync(emptyloginRequest));
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _authService.LoginAsync(failedloginRequest));
        }

        [Fact]
        public async Task Login_UserFound_ReturnUser()
        {
            // Arrange
            var trueUser = new LoginRequest { UserName = "admin", Password = "123456" };
            _jwtProviderMock.Setup(x => x.GenerateTokens(It.IsAny<string>(), It.IsAny<Claim[]>(), It.IsAny<DateTime>()))
                .Returns(new JwtAuthResult
                { });

            // Act
            var result = await _authService.LoginAsync(trueUser);

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public async Task Register_UserExisted_ThrowsInvalidOperationException()
        {
            // Arrange
            var registerRequest = new RegisterRequest { UserName = "admin", Password = "123", Type = Common.Constants.UserType.Admin };

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _authService.RegisterAsync(registerRequest));
        }

        [Fact]
        public async Task Register_UserNotExisted_ReturnNothing()
        {
            // Arrange
            var registerRequest = new RegisterRequest { UserName = $"admin{Guid.NewGuid()}", Password = "123123", Type = Common.Constants.UserType.Admin };

            // Act
            await _authService.RegisterAsync(registerRequest);
            var newUser = AuthService.MOCK_USERS.FirstOrDefault(u => u.UserName == registerRequest.UserName);

            // Assert
            Assert.Equal(newUser?.UserName, registerRequest.UserName);
        }
    }
}
