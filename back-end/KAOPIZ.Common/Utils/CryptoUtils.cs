using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace KAOPIZ.Common.Utils
{
    public class CryptoUtils
    {
        private const string MOCK_SALT = "GJ4vn1eLgXw=";

        public static string HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                throw new ArgumentException("Password cannot be null or empty", nameof(password));
            }
            byte[] salt = Convert.FromBase64String(MOCK_SALT);

            return SHA256Crypt(password, salt);
        }

        public static string SHA256Crypt(string input, byte[] salt)
        {
            return Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: input!,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));
        }
    }
}
