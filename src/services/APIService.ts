import { Environment, getEnv } from "../env/Environment";
import { Manager } from "../Manager";
import { CLIENT_EVENTS, pixiEmitter } from "./EventEmitter";
import { HttpService } from "./HttpService";
import { AccessTokenData } from "./Schema";


class APIService extends HttpService {
    _token: string | null | undefined = null;
    uid: string = "null";
    private _env: Environment | null = null;
    private _accessTokenData: any | null = null;

    constructor() {
        super();
        this._env = getEnv();
    }

    get environment(): Environment | null {
      return this._env;
    }
  
    set environment(value: Environment) {
      this._env = value;
    }

    getAPIEndPoint(): string {
      if (this._env) {
        return this._env.apiEndPoint;
      }
  
      return "";
    }

    private __signInSuccessHandler(accessTokenData: AccessTokenData) {
      this._accessTokenData = accessTokenData;
      this._token = accessTokenData.token || accessTokenData.accessToken;
      this.uid = accessTokenData.id;
      // check if user is new
      if (accessTokenData.isNew) {
        Manager.setNewUser(true);
      }
      //todo: save to client db
    }
    
    private __makeHeader(bearer: boolean = false) {
        if (bearer) {
            return {
                header: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this._token}`
                }
            }
        }
        return false;
    }

    private __parseResponse(rs: any): any {
        let result = rs.data;
        if ((rs.status === 200 || rs.status === 201) && result) {
            if (result.status) {
                return result;
            }
        }

        throw new Error("Invalid data format");
    }

    private __parseReponseWithError(rs: any): any {
        let result: any = this.__parseResponse(rs);
        if (result) {
          if (result.status.code === 401) {
            console.log("show error dialog");
            
            return null;
          }
    
          if (result.status.success) {
            return result;
          }
        }
    
        return null;
      }

    private __errorHandler(err: Error) {
      console.log(err.message);
    }

    // GET
    async signInByTapTap(credential_token: string): Promise<AccessTokenData | null>  {
      const url = `${this.getAPIEndPoint()}/auth/sign-in-taptap`;
      try {
        console.log("start calling", url, credential_token);
        
        let rs = await this.__httpPost(
          url,
          {
            token: credential_token,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("result", rs);
        
        let result = this.__parseResponse(rs);
        if (result) {
          if (result.status.success) {
            console.log('sign-in-taptap success');
            this.__signInSuccessHandler(result.data);
            return result.data;
          } else {
            pixiEmitter.emit(CLIENT_EVENTS.LOADING_MESSAGES, result.status.message)
          }
        }
        return null;
      } catch (ex: any) {
        console.log("catch", ex);
        
        this.__errorHandler(ex);
        return null;
      }
    }

    async checkToken(token: string): Promise<AccessTokenData | null> {
      const url = `${this.getAPIEndPoint()}/auth/token`;
      try {
        let rs = await this.__httpGet(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        let result = this.__parseResponse(rs);
        if (result) {
          if (result.status.success) {
            this._token = token;
            return result.data;
          }
          console.log(result.status.message);
        }
        return null;
      } catch (ex: any) {
        this.__errorHandler(ex);
        return null;
      }
    }

    // POST
  
    // PUT
}

const API = new APIService();
export { API };

