using KAOPIZ.Common.Models;
using KAOPIZ.Common.Models.Requests;
using KAOPIZ.Common.Models.Responses;

namespace KAOPIZ.Common.Interfaces
{
    public interface IAuthService
    {
        Task<UserResponse> LoginAsync(LoginRequest request);
        Task RegisterAsync(RegisterRequest request);
    }
}
