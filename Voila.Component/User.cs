using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Voila.Component
{
    public sealed class User
    {
        public string GetNewUUID() {
            return Guid.NewGuid().ToString();
        }
    }
}
