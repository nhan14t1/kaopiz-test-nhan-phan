using KAOPIZ.Common.Models;
using KAOPIZ.Common.Models.Businesses;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace KAOPIZ.Common.Securities
{
    public interface IJwtProvider
    {
        JwtAuthResult GenerateTokens(string email, Claim[] claims, DateTime now);
        JwtAuthResult Refresh(string accessToken, DateTime now);
        (ClaimsPrincipal, JwtSecurityToken) DecodeJwtToken(string token, bool ignoreLifetime = false);
        Claim[] GetClaims(User user);
    }
}
