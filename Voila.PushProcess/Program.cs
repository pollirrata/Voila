using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using LinqToExcel;
using System.IO;
using Newtonsoft.Json;

namespace Voila.PushProcess
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
                if (path == string.Empty) path = "recetas.xlsx";

                if (File.Exists(path))
                {

                    var excel = new ExcelQueryFactory(path);

                    var httpClient = new HttpClient(new HttpClientHandler { Credentials = new NetworkCredential("voila", "receta") });
                    httpClient.BaseAddress = new Uri("https://voila.cloudant.com/");
                    httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));


                    //obtener los nombres de las recetas existentes para validar si existen repetidos
                    #region
                    var response = httpClient.GetAsync("voila/_design/recipes/_view/names").Result;

                    if (!response.IsSuccessStatusCode)
                        throw new HttpRequestException(response.ReasonPhrase);

                    var type = new
                    {
                        total_rows = 0,
                        offset = 0,
                        rows = new[]{
                        new { id = string.Empty, key = string.Empty, value = string.Empty }
                        }
                    };

                    var parsed = JsonConvert.DeserializeAnonymousType(response.Content.ReadAsStringAsync().Result, type);

                    var names = parsed.rows.Select(r => r.key);

                    #endregion


                    foreach (var values in excel.Worksheet(0))
                    {
                        Console.WriteLine("Agregando {0}", values[0].Value);
                        //checar si la receta existe ya en el servidor
                        if (names.Contains(values[0]))
                        {
                            Console.Beep();
                            Console.Write("La receta '{0}' ya existe en el servidor, agregar otra con el mismo nombre? S/N: ", values[0].Value);
                            var key = Console.ReadKey().KeyChar.ToString();
                            Console.WriteLine();
                            if (key.ToLower() != "s")
                                continue;
                        }

                        var documentId = String.Format("voila/{0}", Guid.NewGuid().ToString().Replace("-", ""));

                        var requestMessage = new HttpRequestMessage(HttpMethod.Put, documentId);

                        var recipe = new
                        {
                            nombre = values[0].Value,
                            ingredientes = values[1].Value.ToString().Split('|').Select(x => x.Trim()).Where(x => !string.IsNullOrEmpty(x)).ToArray(),
                            porciones = values[2].Value,
                            tiempo = values[3].Value,
                            dificultad = values[4].Value,
                            preparacion = values[5].Value.ToString().Split('|').Select(x => x.Trim()).Where(x => !string.IsNullOrEmpty(x)).ToArray(),
                            etiquetas = values[6].Value.ToString().Split(',').Select(x => x.Trim()).Where(x => !string.IsNullOrEmpty(x)).ToArray()
                        };

                        var jsonparsed = JsonConvert.SerializeObject(recipe);
                        requestMessage.Content = new StringContent(jsonparsed, Encoding.UTF8, "application/json");

                        //response = httpClient.PutAsync(documentId, requestMessage.Content).Result;

                        response = httpClient.SendAsync(requestMessage).Result;

                        if (!response.IsSuccessStatusCode)
                            Console.WriteLine("Error al agregar la receta: {0}", response.ReasonPhrase);
                        else
                            Console.WriteLine("Receta agregada correctamente");


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
