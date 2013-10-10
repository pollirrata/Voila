using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.VisualStudio.TestPlatform.UnitTestFramework;
using Voila.Service;

namespace Voila.Test
{
    [TestClass]
    public class RecipesHelperTest
    {
        [TestMethod]
        public void ServerConnection()
        {
            RecipesHelper.TestConnection();
            Assert.IsTrue(true);
        }

        [TestMethod]
        public void GetByIngredients()
        {
            var recipes = RecipesHelper.SearchRecipes(new string[] { "chile", "tomate" });
            Assert.IsNotNull(recipes);
        }

        [TestMethod]
        public void AddToFavorites() {

            var result = RecipesHelper.AddToFavorites("x", "y");

            Assert.IsTrue(result);
        }

        [TestMethod]
        public void GetFavorites() {
            var result = RecipesHelper.GetFavorites("f5e9ee55-a7f2-4b08-8382-99562f384143").Result;

            Assert.IsNotNull(result);
        }

        [TestMethod]
        public void GetPopular()
        {
            var result = RecipesHelper.GetPopular().Result;

            Assert.IsNotNull(result);
        }


    }
}
