export default function Color2(args, originalImageData, context) {
    var w = originalImageData.width;
    var h = originalImageData.height;
    var originalPixels = originalImageData.data;

    var newImageData = context.createImageData(originalImageData);
    var newPixels = newImageData.data;

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

        data[index] =
            (a << 24) |
            (b << 16) |
            (g << 8) |
            r;

        index++;
    }
    newImageData.data.set(buf8);
    return newImageData;
}