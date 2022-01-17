# dali
Dali is a Picasso-like device attestation payload

## Use in-browser
Use the minified version in `dist`:
```
[7.8K]  dali.min.js 13f558356a2c193e75823556fe9ceb6166dd91abc671a390ff6aead392892590
```
You can call it like so, with all the parameters in the exact order:
```
<script>
    dali([
        15, // repetitions
        8547498279832982569844, // seed
        500, // size
        2001000001, // offset
        15000, // multiplier
        20, // fontsize
        50 // maxblur
    ]).then(response => {
        const imgEle = document.createElement("img");
        imgEle.src = response.url;
        document.getElementById("dali-hash").innerHTML = response.hash;
        document.getElementById("dali-canvas").appendChild(imgEle);
    });
</script>
```
When called, the `dali` function will generate a [Promise Response](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) of:
```
{"url":"<url_string>","hash":"<sha256_hash_string>"}
```

## Copyright
`dali.js` Includes the elements from the following open source projects:
- [picasso-like-canvas-fingerprinting](https://github.com/antoinevastel/picasso-like-canvas-fingerprinting) (MIT License Copyright (c) 2019 antoine vastel)


## References
- [Google Research, Picasso: Lightweight Device Class Fingerprinting for Web Clients](https://research.google/pubs/pub45581/)
- [@antoinevastel, Picasso based canvas fingerprinting](https://github.com/antoinevastel/picasso-like-canvas-fingerprinting)
- [FingerprintJS, How Does Canvas Fingerprinting Work?](https://fingerprintjs.com/blog/canvas-fingerprinting/)
- [AdTechMadness, Overview of Google’s Picasso](https://adtechmadness.wordpress.com/2019/03/19/overview-of-googles-picasso/)