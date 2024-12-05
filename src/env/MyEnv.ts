import { Environment } from "./Environment";

const ENV_ME: Environment = {
    name: "local",
    apiEndPoint: "http://192.168.2.105:3000/v1",
    assetEndPoint: "http://192.168.2.105:3000",
    ssl: false,
    host: "192.168.2.105",
    port: 3000,
  };
  
  export {ENV_ME};