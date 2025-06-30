using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class OpenapiController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public OpenapiController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpGet("locations")]
        public async Task<IActionResult> GetLocations()
        {
            try
            {
                var response = await _httpClient.GetAsync("https://provinces.open-api.vn/api?depth=3");
                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode(500, new { message = $"External API error: {(int)response.StatusCode} {response.ReasonPhrase}" });
                }

                var data = await response.Content.ReadAsStringAsync();
                return Content(data, "application/json");
            }
            catch
            {
                return StatusCode(500, new { message = "Error fetching provinces" });
            }
        }
    }
}
