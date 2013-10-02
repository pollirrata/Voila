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
            var recipes = RecipesHelper.GetRecipes(new string[] { "chile", "tomate" });
            Assert.IsNotNull(recipes);
        }
    }
}
