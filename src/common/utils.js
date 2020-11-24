function sleep(ms) {
    let promise = new Promise(resolve => setTimeout(resolve, ms));
    return promise;
}

function download(name, href) {
    let link = document.createElement('a');
    link.download = name;
    link.href = href;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function readFile(files) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsText(files[0]); // no multiple
        reader.onload = (event) => {
            // console.log(event.target.result);
            try {
                let data = JSON.parse(event.target.result);
                resolve(data);
            }
            catch (error) {
                reject(error);
            }
        }
        reader.error = (error) => {
            reject(error);
        }
    })
}

module.exports = {
    sleep,
    download,
    readFile,
}
