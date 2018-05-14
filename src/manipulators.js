export default function Manipulator( type ) {
    return this.transformations[ type ];
}

Manipulator.prototype.transformations = {
    original: function (args, originalImageData, context) {
        return originalImageData;
    },
    color: function (args, originalImageData, context) {
        var w = originalImageData.width;
        var h = originalImageData.height;
        var originalPixels = originalImageData.data;

        var newImageData = context.createImageData(originalImageData);
        // var newPixels = newImageData.data;

        var length = originalPixels.length;
        var buf = new ArrayBuffer(length);
        var buf8 = new Uint8ClampedArray(buf);
        var data = new Uint32Array(buf);

        var index = 0;
        for (var position = 0; position < length; position += 4) {
            var r = originalPixels[position + 0] + args['red'];
            var g = originalPixels[position + 1] + args['green'];
            var b = originalPixels[position + 2] + args['blue'];
            var a = args['alpha'];

            r = Clamp(0, r, 255);
            g = Clamp(0, g, 255);
            b = Clamp(0, b, 255);

            data[ index ] =
                ( a << 24)  |    // alpha
                ( b << 16) |    // blue
                ( g << 8)  |    // green
                  r;              // red

            index++;
            // newPixels[position]     = (originalPixels[position + 0] + args['red']);
            // newPixels[position + 1] = (originalPixels[position + 1] + args['green']);
            // newPixels[position + 2] = (originalPixels[position + 2] + args['blue']);
            // newPixels[position + 3] = args['alpha'];
        }
        newImageData.data.set(buf8);
        return newImageData;
    },
    rain: function( args, inputImageData, originalImageData, context ) {
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

        const length = drops.length;
        for (let d = 0; d < length; d++) {

            let x = drops[d].x;
            let y = drops[d].y;

            let xmin = Math.max(0, x - size)
            let xmax = Math.min(w, x + size);

            let ymin = Math.max(0, y - size)
            let ymax = Math.min(h, y + size);

            let base = (Math.floor(x) + Math.floor(y) * w) * 4;

            // context.fillStyle = "rgb(" + c.r + "," + c.g + "," + c.b + ")";
            // context.fillRect(x, y, size, size);
            for (let i = xmin; i < xmax; i++) {
                for (let j = ymin; j < ymax; j++) {
                    let pos = (Math.floor(i) + Math.floor(j) * w) * 4;
                    // outPixels[pos]     = originalPixels[base + 0];
                    // outPixels[pos + 1] = originalPixels[base + 1];
                    // outPixels[pos + 2] = originalPixels[base + 2];
                    // outPixels[pos + 3] = originalPixels[base + 3];

                    outPixels[pos] = originalPixels[pos + 0];
                    outPixels[pos + 1] = originalPixels[pos + 1];
                    outPixels[pos + 2] = originalPixels[pos + 2];
                    outPixels[pos + 3] = originalPixels[pos + 3];
                }
            }
        }

        return outputImageData;
    },
}

function Clamp(min, mid, max) {
    return Math.min(Math.max(min, mid), max)
}