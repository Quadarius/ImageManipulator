export default class ColorSampleBlocks {
	constructor( inputImageData, context) {
		this.inputPixels = inputImageData.data;
		this.width = inputImageData.width;
		this.height = inputImageData.height;

		this.outputImageData = context.createImageData( w, h );
		// Initialize with original pixels
		this.outputImageData.data.set( this.inputPixels );
		this.outPixels = outputImageData.data;
	}

	render( particles, particle_size ) {
		let number_of_particles = particles.length || 0;

		for (let i = 0; i < number_of_particles; i++) {
			let x    = particles[i].x;
			let y    = particles[i].y;
			let size = particles[i].size;

			let xmin = Math.max(0, x - size);
			let xmax = Math.min(w, x + size);
			let ymin = Math.max(0, y - size);
			let ymax = Math.min(h, y + size);
			let base = (Math.floor(x) + Math.floor(y) * w) * 4;

			let c = {
				r: inputPixels[base + 0],
				g: inputPixels[base + 1],
				b: inputPixels[base + 2],
				a: inputPixels[base + 3],
			};

			for (let j = ymin; j < ymax; j++) {
				for (let i = xmin; i < xmax; i++) {
					let pos = ( Math.floor(i) + Math.floor(j) * this.width ) * 4;

					outPixels[pos]     = c.r; // inputPixels[pos];
					outPixels[pos + 1] = c.g; // inputPixels[pos + 1];
					outPixels[pos + 2] = c.b; // inputPixels[pos + 2];
					outPixels[pos + 3] = c.a; // inputPixels[pos + 3];
				}
			}
		}
		return outputImageData;
	}
}