using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Net.Http;
using System.Net;
using System.Net.Http.Headers;
namespace Voila.Component
{
    public sealed class Info
    {
        private IList<Tuple<string, string, string>> advices;

        private const string server = "https://voila.cloudant.com/";

        private static object _locker = new object();

        private static HttpClient httpClient = null;

        public Info()
        {
            //singleton
            if (httpClient != null) return;

            lock (_locker)
            {
                if (httpClient != null) return;
                httpClient = new HttpClient(new HttpClientHandler { Credentials = new NetworkCredential("voila", "receta") });
                httpClient.BaseAddress = new Uri(server);
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            }
        }

        private void EnsureAdvices()
        {
            if (advices != null) return;

            var response = httpClient.GetAsync("consejos/_design/views/_view/consejos").Result;

            if (!response.IsSuccessStatusCode)
                throw new HttpRequestException(response.ReasonPhrase);

            var type = new
            {
                rows = new[] {
                new{ key = string.Empty, value = new { _id = string.Empty, titulo = string.Empty, consejo = string.Empty}}
            }
            };

            var parsed = JsonConvert.DeserializeAnonymousType(response.Content.ReadAsStringAsync().Result, type);

            advices = new List<Tuple<string, string, string>>();

            foreach (var row in parsed.rows.Select(r => r.value).OrderBy(r => r.titulo))
            {
                advices.Add(new Tuple<string, string, string>(row._id, row.titulo, row.consejo));
            }
        }

        public string GetAdviceTitles()
        {
            EnsureAdvices();
            return JsonConvert.SerializeObject(advices.Select(a => new { id = a.Item1, titulo = a.Item2, consejo = a.Item3 }).ToArray());
        }
    }
}
