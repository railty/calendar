export async function callServer(method, url, data) {
    let p = new Promise((resolve, reject) => {
        let http = new XMLHttpRequest();
        http.open(method, url, true);
        http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        http.setRequestHeader("x-csrf-token", csrf);

        http.onreadystatechange = function () {//Call a function when the state changes.
            if (http.readyState == 4) {
                 if (http.status == 200){
                    let rc = JSON.parse(http.responseText);
                    resolve(rc);
                 }
                 else{
                     resolve({
                         code:'warning',
                         message: http.statusText
                     });
                 }
            }
        }

        let params = JSON.stringify({
            _csrf: csrf,
            data: data
        });
        http.send(params);
    });
    return p;
}
