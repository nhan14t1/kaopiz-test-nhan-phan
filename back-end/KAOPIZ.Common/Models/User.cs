using KAOPIZ.Common.Constants;

namespace KAOPIZ.Common.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public UserType Type { get; set; }
    }
}
