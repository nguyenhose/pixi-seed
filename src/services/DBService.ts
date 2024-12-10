export const DBService =  {
    getAccessTokenByKey(key: string, provider?: any): string | null {
        const keyName = `key_${key}`;
        //todo: save to local storage
        provider = provider ? provider : localStorage;
        return provider.getItem(keyName);
    },

    setAccessTokenByKey(key: string, value: string, provider?: any) {
      const keyName = `key_${key}`;
      provider = provider ? provider : localStorage;
      console.log(`save ${keyName} with value: ${value}`);
      provider.setItem(keyName, value);
    }
}