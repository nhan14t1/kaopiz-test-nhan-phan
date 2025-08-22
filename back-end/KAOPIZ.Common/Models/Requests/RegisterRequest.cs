using KAOPIZ.Common.Constants;
using System.ComponentModel.DataAnnotations;

namespace KAOPIZ.Common.Models.Requests
{
    public class RegisterRequest : LoginRequest
    {
        [Required]
        public UserType Type { get; set; }
    }
}
