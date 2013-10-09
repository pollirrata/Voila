using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Voila.Service;
using Windows.Data.Json;

namespace Voila.Component
{
    public sealed class Recipes
    {
        private static HttpClient httpClient = new HttpClient();

        public Recipes()
        {


        }
        public string SearchByIngredients(string ingredients)
        {
            return RecipesHelper.SearchRecipes(ingredients.Split(',').Select(i => i.Trim().ToLower()).ToArray<string>());
        }

        public bool AddToFavorites(string uuid, string recipeId)
        {
            return RecipesHelper.AddToFavorites(uuid, recipeId);
        }

        public string GetFavorites(string uuid) {
            return RecipesHelper.GetFavorites(uuid);
        }
    }
}
