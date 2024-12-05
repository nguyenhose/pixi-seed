import { ENV_ME } from "./MyEnv";

declare namespace globalThis {
  var ENV: any
}

const CurrentENV: Environment = {
  name: "prod",
  apiEndPoint: "https://lb.thitranbaovui.com/v1",
  assetEndPoint: "https://lb.thitranbaovui.com/v1",
  ssl: true,
  host: "lb.thitranbaovui.com",
  port: 80,
};

export function applyEnv(env: Environment) {
  CurrentENV.name = env.name;
  CurrentENV.apiEndPoint = env.apiEndPoint;
  CurrentENV.assetEndPoint = env.assetEndPoint;
  CurrentENV.host = env.host;
  CurrentENV.port = env.port;
  CurrentENV.ssl = env.ssl;
}

export function getEnv(): Environment {
  const _env = globalThis.ENV;
  if (_env) {
    return {
      name: _env.name,
      apiEndPoint: _env.apiEndPoint,
      assetEndPoint: _env.assetEndPoint || _env.assetsEndPoint,
      ssl: _env.ssl,
      host: _env.host,
      port: _env.port,
    };
  }

  return CurrentENV;
}

export type EnvName = "" | "local" | "dev" | "lab" | "test" | "stag" | "prod";

export type Environment = {
  name: EnvName | string;
  apiEndPoint: string;
  assetEndPoint: string;
  host: string;
  port: number;
  ssl: boolean;
};

export { ENV_ME as ENV_DEV };

