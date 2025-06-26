// Configuration for Azure services
export const configs = {
  embedding: {
    apiKey: '3acad7a85d04465498db3ac29f0d7630',
    azureEndpoint: 'https://oai-eur-ww-prd-jpnaimpub.openai.azure.com',
    apiVersion: '2023-05-15',
    modelName: 'text-embedding-3-large',
  },
  
  chat: {
    apiKey: '3acad7a85d04465498db3ac29f0d7630',
    azureEndpoint: 'https://oai-eur-ww-prd-jpnaimpub.openai.azure.com',
    apiVersion: '2025-01-01-preview',
    modelName: 'o3-mini',
  },
  
  search: {
    serviceEndpoint: 'https://srch-eur-ww-prd-jpnaimpub.search.windows.net',
    indexName: 'vector-skillmaster-csv',
    key: 'ECmPhHcoFcVN0amRaJ3FmPsSTLLFhY30ArnY3feJN5AzSeBbhgvs'
  },
  
  databricks: {
    serverHostname: 'adb-509019224610609.9.azuredatabricks.net',
    httpPath: '/sql/1.0/warehouses/be36b2948c3dbcd4',
    accessToken: 'dapi95204641bca5f4dc2d5f055b8f15c50a-2'
  }
};
