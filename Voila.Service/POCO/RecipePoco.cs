using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Voila.Service.POCO
{
    public struct RecipePoco
    {
        public string _id;
        public string nombre;
        public string[] ingredientes;
        public int porciones;
        public string tiempo;
        public string dificultad;
        public string[] preparacion;
        public int favoritos;
        public string[] etiquetas;
        public int cantidadIngredientes;
    }
}
