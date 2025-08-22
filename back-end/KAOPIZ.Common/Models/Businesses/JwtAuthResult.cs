namespace KAOPIZ.Common.Models.Businesses
{
    public class JwtAuthResult
    {
        public string AccessToken { get; set; } = string.Empty;
        public DateTime AccessTokenExpration { get; set; }
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime RefreshTokenExpration { get; set; }
    }
}
