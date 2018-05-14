function(args, inputImageData, originalImageData, context) {
    const inputPixels = inputImageData.data;
    const originalPixels = originalImageData.data;

    const w = inputImageData.width;
    const h = inputImageData.height;

    const drops = args['raindrops'];
    const size = args['rainsize'];

    // var newImageData = context.getImageData( 0, 0, width, height );
    var outputImageData = context.createImageData(w, h);
    outputImageData.data.set(inputImageData.data)

    var outPixels = outputImageData.data;

    var length = originalPixels.length;
    var buf = new ArrayBuffer(length);
    var buf8 = new Uint8ClampedArray(buf);
    var data = new Uint32Array(buf);

    const num = drops.length;
    for (let d = 0; d < num; d++) {

        let x = drops[d].x;
        let y = drops[d].y;

        let xmin = Math.max(0, x - size)
        let xmax = Math.min(w, x + size);

        let ymin = Math.max(0, y - size)
        let ymax = Math.min(h, y + size);

        let base = (Math.floor(x) + Math.floor(y) * w) * 4;

        let c = {
            r: originalPixels[base + 0],
            g: originalPixels[base + 1],
            b: originalPixels[base + 2],
            a: originalPixels[base + 3],
        }

        // context.fillStyle = "rgb(" + c.r + "," + c.g + "," + c.b + ")";
        // context.fillRect(x, y, size, size);
        var index = 0;
        for (let j = ymin; j < ymax; j++) {
            for (let i = xmin; i < xmax; i++) {
                var index = (j * w + i);
                // let pos = (Math.floor(i) + Math.floor(j) * w) * 4;
                // // outPixels[pos]     = originalPixels[base + 0];
                // // outPixels[pos + 1] = originalPixels[base + 1];
                // // outPixels[pos + 2] = originalPixels[base + 2];
                // // outPixels[pos + 3] = originalPixels[base + 3];

                // outPixels[pos] = originalPixels[pos + 0];
                // outPixels[pos + 1] = originalPixels[pos + 1];
                // outPixels[pos + 2] = originalPixels[pos + 2];
                // outPixels[pos + 3] = originalPixels[pos + 3];

                data[index] =
                    (c.a << 24) |    // alpha
                    (c.b << 16) |    // blue
                    (c.g << 8) |     // green
                    c.r;            // red
            }
        }
    }

    outputImageData.data.set(buf8)
    return outputImageData;
},