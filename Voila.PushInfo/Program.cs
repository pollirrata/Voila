using LinqToExcel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Voila.PushInfo
{
    class Program
    {
        static void Main(string[] args)
        {
            var complete = false;



            do
            {
                Console.WriteLine("Ruta completa del archivo de excel (Default: Recetas.xlsx)");
                var path = Console.ReadLine();
                if (path == string.Empty) path = "informacion.xlsx";

                if (File.Exists(path))
                {

                    var excel = new ExcelQueryFactory(path);

                    var httpClient = new HttpClient(new HttpClientHandler { Credentials = new NetworkCredential("voila", "receta") });
                    httpClient.BaseAddress = new Uri("https://voila.cloudant.com/");
                    httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));



                    foreach (var values in excel.Worksheet(0))
                    {
                        Console.WriteLine("Agregando {0}", values[0].Value);

                        var documentId = String.Format("consejos/{0}", Guid.NewGuid().ToString().Replace("-", ""));

                        var requestMessage = new HttpRequestMessage(HttpMethod.Put, documentId);

                        var recipe = new
                        {
                            titulo = values[0].Value,
                            consejo = values[1].Value
                        };

                        var jsonparsed = JsonConvert.SerializeObject(recipe);
                        requestMessage.Content = new StringContent(jsonparsed, Encoding.UTF8, "application/json");

                        var response = httpClient.SendAsync(requestMessage).Result;

                        if (!response.IsSuccessStatusCode)
                            Console.WriteLine("Error al agregar el consejo: {0}", response.ReasonPhrase);
                        else
                            Console.WriteLine("Consejo agregado correctamente");


                    }//for

                    Environment.Exit(0);
                }
                else
                {
                    Console.WriteLine("El archivo especificado no existe");
                }
            } while (!complete);
        }
    }
}
