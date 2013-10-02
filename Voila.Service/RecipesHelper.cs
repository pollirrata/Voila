using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
//using Windows.Data.Json;
using Newtonsoft.Json;


namespace Voila.Service
{
    public static class RecipesHelper
    {
        private static object _locker = new object();

        private const string server = "https://voila.cloudant.com/";

        private static HttpClient httpClient = null;

        static RecipesHelper()
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

        public static void TestConnection()
        {
            var response = httpClient.GetAsync("voila").Result;
            if (!response.IsSuccessStatusCode)
            {
                throw new HttpRequestException();
            }
        }

        public static string GetRecipes(string[] ingredients)
        {
            int qty = ingredients.Length;
            string parameter;
            if (qty > 1)
            {
                var builder = new StringBuilder();
                builder.Append("keys=[");
                int items = 0;
                foreach (var ingredient in ingredients)
                {
                    builder.Append('"');
                    builder.Append(ingredient);
                    builder.Append('"');
                    if (++items < qty)
                        builder.Append(',');
                }

                builder.Append(']');

                parameter = builder.ToString();

            }
            else
            {
                parameter = String.Format("?key={0}", ingredients[0]);
            }

            var response = httpClient.GetAsync(String.Format("voila/_design/recipes/_view/byingredient?{0}", parameter)).Result;

            if (!response.IsSuccessStatusCode)
                throw new HttpRequestException(response.ReasonPhrase);

            //var parsed = JsonObject.Parse(response.Content.ReadAsStringAsync().Result);


            //var type = new
            //{
            //    rows = new[]
            //    {
            //        new {
            //        key = string.Empty, 
            //        value = new []{
            //            new []{
            //                new []{
            //                    new {
            //                        _id = string.Empty,
            //                        nombre = string.Empty,
            //                        ingredientes = string.Empty,
            //                        porciones = 0,
            //                        tiempo = string.Empty,
            //                        dificultad = string.Empty,
            //                        preparacion = string.Empty,
            //                        favoritos = 0,
            //                        etiquetas = new [] {string.Empty},
            //                        cantidadIngredientes = 0
            //                    }
            //                }
            //            }
            //        }
            //    }
            //    }
            //};

            var type = new
            {
                total_rows = 0,
                offset = 0,
                rows = new[]
                {
                    new{
                        id = string.Empty,
                        key = string.Empty,
                        value = new {
                        _id = string.Empty,
                        nombre = string.Empty,
                        ingredientes = string.Empty,
                        porciones = 0,
                        tiempo = string.Empty,
                        dificultad = string.Empty,
                        preparacion = string.Empty,
                        favoritos = 0,
                        etiquetas = new [] {string.Empty},
                        cantidadIngredientes = 0
                    }
                    }
                }

            };
            var parsed = JsonConvert.DeserializeAnonymousType(response.Content.ReadAsStringAsync().Result, type);

            //si no hay resultados regresamos cadena vacia
            if (!parsed.rows.Any())
                return string.Empty;

            var recipes = new SortedDictionary<string, object>();

            foreach (var row in parsed.rows)
            {
                var recipe = row.value;

                if (recipes.ContainsKey(recipe._id)) continue;

                var add = false;
                foreach (var ingredient in ingredients)
                {
                    //checar si el ingrediente esta en la lista
                    add = recipe.etiquetas.Contains(ingredient);
                    //en el momento que encontremos que el ingrediente proporcionado no existe
                    //salimos del ciclo
                    if (!add) break;
                }

                if (add)
                    recipes.Add(recipe._id, recipe);

            }

            return JsonConvert.SerializeObject(recipes.Values);
        }

    }
}
