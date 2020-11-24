function sleep(ms) {
    let promise = new Promise(resolve => setTimeout(resolve, ms));
    return promise;
}

function download(name, url) {
    let link = document.createElement('a');
    link.download = name;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

module.exports = {
    sleep,
    download,
}
