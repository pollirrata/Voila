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

namespace Voila.Component
{
    public sealed class Recipes
    {
        private static HttpClient httpClient = new HttpClient();
        private static IEnumerable<RecipePoco> favorites;
        private static string favoritesString;
        private Task<string> cacheUpdateTask;

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

        public string GetFavorites(string uuid)
        {
            return RecipesHelper.GetFavorites(uuid);
        }

        public async void UpdateFavoritesCache()
        {
            cacheUpdateTask = RecipesHelper.GetLocalStorageFile("favorites.txt");

            var settingValue = await cacheUpdateTask;

            var type = new[] { new RecipePoco { } };
            if (!string.IsNullOrEmpty(settingValue.ToString()))
            {
                favoritesString = settingValue.ToString();
                favorites = JsonConvert.DeserializeAnonymousType(favoritesString, type);
            }
        }

        public string GetFavoritesCacheString()
        {
            return favoritesString;
        }

        public bool CheckIfFavorited(string id)
        {
            //Windows.Storage.StorageFolder localFolder = Windows.Storage.ApplicationData.Current.LocalFolder;

            //if (favorites != null && favorites.Any())
            //    return favorites.Select(x => x._id).Contains(id);

            //StorageFile sampleFile = localFolder.GetFileAsync("favorites.txt").GetResults();
            //String settingValue = FileIO.ReadTextAsync(sampleFile).GetResults();

            //var type = new[] { new RecipePoco { } };
            //if (!string.IsNullOrEmpty(settingValue.ToString()))
            //{
            //    favoritesString = settingValue.ToString();
            //    favorites = JsonConvert.DeserializeAnonymousType(favoritesString, type);
            //}

            if (cacheUpdateTask != null)
                cacheUpdateTask.Wait();

            if (favorites != null && favorites.Any())
            {

            }

            if (favorites != null && favorites.Any())
                return favorites.Select(f => f._id).Contains(id);

            return false;

        }
    }
}
