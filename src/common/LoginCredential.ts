import { Environment } from "../env/Environment";
import { API } from "../services/APIService";
import { DBService } from "../services/DBService";
import { CLIENT_EVENTS, pixiEmitter } from "../services/EventEmitter";
import { NetworkService } from "../services/NetworkService";

/**
    Login Flow
*/
class LoginCredentialImpl {
  async login(credentialToken: string, env: string | null) {
    try {
      if (env == "dev" && await this._loginWithExistToken()) {
        console.log(`_loginWithExistToken ->`);
        return;
      }

      let rs = await API.signInByTapTap(credentialToken);
      if (rs) {
        const token = rs.token || rs.accessToken;
        if (token && API.environment) {
          let success = await this.connectToServer(token, API.environment);
          if (success) {
            DBService.setAccessTokenByKey('token', token);
          }
        }
      }
    } catch (error: any) {
      console.log(error);
      if (error && error.message) {
        pixiEmitter.emit(CLIENT_EVENTS.LOADING_MESSAGES, error.message)
      }
    }
  }

  async _loginWithExistToken(): Promise<boolean> {
    let myAccessToken = DBService.getAccessTokenByKey('token');
    if (myAccessToken) {
      let tokenData = await API.checkToken(myAccessToken);
      if (tokenData && API.environment) {
        let success = await this.connectToServer(tokenData.token, API.environment);
        if (success) {
          return true;
        }
      }
    }
    console.log("--> token null or expired --");
    return false;
  }

  async connectToServer(token: string, env: Environment): Promise<boolean> {
      if (token) {
        if (await NetworkService.basicAuthen(token).connect(env.host, env.port, env.ssl)) {
          console.log("-> connect server success");
          return true;
        }
    }
    return false;
  }

  __parseTokenFromURL(): string | null{
    let search = window.location.search;
    if (search.length > 0) {
      let urlParams = new URLSearchParams(search);
      return urlParams.get("token");
    }

    let url = window.location.href || window.location.toString();
    let index = url.lastIndexOf("/");
    if (index !== -1) {
      let uid = url.substring(index + 1);
      if (uid && !uid.includes(".")) {
        return uid.trim();
      }
    }

    return null;
  }

  __parseENVFromURL(): string | null{
    let search = window.location.search;
    if (search.length > 0) {
      let urlParams = new URLSearchParams(search);
      return urlParams.get("env");
    }

    let url = window.location.href || window.location.toString();
    let index = url.lastIndexOf("/");
    if (index !== -1) {
      let uid = url.substring(index + 1);
      if (uid && !uid.includes(".")) {
        return uid.trim();
      }
    }

    return null;
  }
}

const LoginCredential = new LoginCredentialImpl();
export { LoginCredential };
