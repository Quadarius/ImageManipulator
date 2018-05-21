export default function Color(args, originalImageData, context) {
    const originalPixels = originalImageData.data;

    var newImageData = context.createImageData(originalImageData);
    var newPixels = newImageData.data;

    const length = newPixels.length;

    for (var position = 0; position < length; position += 4) {
        newPixels[position] = (originalPixels[position + 0] + args['red']);
        newPixels[position + 1] = (originalPixels[position + 1] + args['green']);
        newPixels[position + 2] = (originalPixels[position + 2] + args['blue']);
        newPixels[position + 3] = args['alpha'];
    }

    return newImageData;
}