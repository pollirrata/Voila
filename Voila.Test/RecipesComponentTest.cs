using Microsoft.VisualStudio.TestPlatform.UnitTestFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Voila.Component;

namespace Voila.Test
{
    [TestClass]
    public class RecipesComponentTest
    {
        [TestMethod]
        public void GetRecipes()
        {
            var component = new Recipes();
            var recipes = component.SearchByIngredients("Jitomate, Cebolla, Lechuga");
            Assert.IsNotNull(recipes);
        }

        [TestMethod]
        public void CacheTest()
        {
            var component = new Recipes();

            component.UpdateFavoritesCache();


            component.CheckIfFavorited("x");



        }
    }
}
