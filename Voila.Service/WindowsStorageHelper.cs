using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Storage;

namespace Voila.Service
{
    public static class WindowsStorageHelper
    {
        public static async Task<string> GetLocalStorageFile(string filename)
        {

            StorageFolder localFolder = Windows.Storage.ApplicationData.Current.LocalFolder;

            StorageFile sampleFile = await localFolder.GetFileAsync(filename);
            String settingValue = await FileIO.ReadTextAsync(sampleFile);

            return settingValue.ToString();

        }
    }
}
