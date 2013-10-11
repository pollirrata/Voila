using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Voila.Service;
using Windows.Data.Json;
using Windows.Storage;
using Newtonsoft.Json;
using System.Collections;
using Voila.Service.POCO;
using Windows.Foundation;

namespace Voila.Component
{
    public sealed class Recipes
    {
        private static HttpClient httpClient = new HttpClient();
        private static IEnumerable<RecipePoco> favorites;
        private static IEnumerable<PopularPoco> popular;

        private static string favoritesString;
        private static string popularString;

        private Task<string> cacheUpdateTask;
        private Task<string> popularUpdateTask;

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

        public IAsyncOperation<string> GetFavoritesAsync(string uuid)
        {
            return RecipesHelper.GetFavorites(uuid).AsAsyncOperation<string>();
        }

        public IAsyncOperation<string> GetPopularAsync()
        {
            return RecipesHelper.GetPopular().AsAsyncOperation<string>();
        }

        public string GetPopularList(int limit)
        {
            return RecipesHelper.GetPopular(limit);
        }

        public async void UpdateFavoritesCache()
        {
            cacheUpdateTask = WindowsStorageHelper.GetLocalStorageFile("favorites.txt");

            var settingValue = await cacheUpdateTask;

            var type = new[] { new RecipePoco { } };
            if (!string.IsNullOrEmpty(settingValue.ToString()))
            {
                favoritesString = settingValue.ToString();
                favorites = JsonConvert.DeserializeAnonymousType(favoritesString, type);
            }
        }

        public async void UpdatePopularCache()
        {
            popularUpdateTask = WindowsStorageHelper.GetLocalStorageFile("popular.txt");

            var settingValue = await popularUpdateTask;

            var type = new[] { new PopularPoco() };
            if (!string.IsNullOrEmpty(settingValue.ToString()))
            {
                popularString = settingValue.ToString();
                popular = JsonConvert.DeserializeAnonymousType(popularString, type);
            }
        }

        public string GetFavoritesCacheString()
        {
            return favoritesString;
        }

        public string GetPopularCacheString()
        {
            return popularString;
        }

        public bool CheckIfFavorited(string id)
        {
            if (cacheUpdateTask != null)
                cacheUpdateTask.Wait();

            if (favorites != null && favorites.Any())
                return favorites.Select(f => f._id).Contains(id);

            return false;

        }

        public int GetStars(string id)
        {
            if (popularUpdateTask != null)
                popularUpdateTask.Wait();

            if (popular != null && popular.Any())
            {
                var recipe = popular.FirstOrDefault(p => p.id == id);
                if (recipe != null)
                {
                    return recipe.stars;
                }
            }

            return 0;
        }
    }
}
