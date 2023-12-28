const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

document.getElementById('file').onchange = function(event) {
    var file = event.target.files[0];
    var fileReader = new FileReader();
    fileReader.onload = function() {
        var typedarray = new Uint8Array(this.result);
        // console.log(typedarray);
        var hashkey = cyrb53(document.getElementById('password').value);
        var encryptedarray = typedarray.map(function(e) {
            return (e + hashkey) % 256;
        });
        // console.log(hashkey);
        // console.log(encryptedarray);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var blob = new Blob([encryptedarray], {type: "octet/stream"});
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = "encrypted.pdf";
        a.click();
        window.URL.revokeObjectURL(url);
    }
    fileReader.readAsArrayBuffer(file);
}