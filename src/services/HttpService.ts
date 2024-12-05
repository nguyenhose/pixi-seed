export class HttpService {
    __httpGet(url: string, setHeaders: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                    var response = xhr.responseText;
                    return resolve({
                        status: xhr.status,
                        data: JSON.parse(response)
                    })
                }
            };
    
            xhr.addEventListener("error", function(event) {
                reject(event);
            })

            xhr.open("GET", url, true);
            if(setHeaders) {
                let headers = setHeaders.headers;
                Object.keys(headers).forEach((key) => {
                    xhr.setRequestHeader(key, headers[key]);
                })
            } else {
                xhr.setRequestHeader("Content-Type", "application/json");
            }

            xhr.send();
        })
    }

    __httpPost(url: string, data: any, setHeaders: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                  var response = xhr.responseText;
                  return resolve({
                    status: xhr.status,
                    data: JSON.parse(response),
                  });
                }
              };

            xhr.addEventListener("error", function (event) {
                reject(event);
              });
        
              xhr.open("POST", url);
              if (setHeaders) {
                let headers = setHeaders.headers;
                Object.keys(headers).forEach((key) => {
                  xhr.setRequestHeader(key, headers[key]);
                });
              } else {
                xhr.setRequestHeader("Content-Type", "application/json");
              }
        
              xhr.send(JSON.stringify(data));
        })
    }

    __httpPut(url: string, data: any, setHeaders: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                    var response = xhr.responseText;
                    return resolve({
                        status: xhr.status,
                        data: JSON.parse(response)
                    })
                }
            }
            
            xhr.addEventListener("error", function(event) {
                reject(event);
            })

            xhr.open("PUT", url);
            if (setHeaders) {
                let headers = setHeaders.headers;
                Object.keys(headers).forEach((key) => {
                    xhr.setRequestHeader(key, headers[key]);
                })
            } else {
                xhr.setRequestHeader("Content-Type", "application/json");
            }

            xhr.send(JSON.stringify(data));
        })
    }

    __httpDelete(url: string, setHeaders: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                    var response = xhr.responseText;
                    return resolve({
                        status: xhr.status,
                        data: JSON.parse(response)
                    })
                }
            }
            xhr.addEventListener("error", function(event) {
                reject(event);
            })
            xhr.open("DELETE", url, true);
            if (setHeaders) {
                let headers = setHeaders.headers;
                Object.keys(headers).forEach((key) => {
                    xhr.setRequestHeader(key, headers[key]);
                })
            } else {
                xhr.setRequestHeader("Content-Type", "application/json");
            }

            xhr.send();
        })
    }
}