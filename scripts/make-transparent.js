const fs = require('fs');
const { PNG } = require('pngjs');

const inputPath = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\5d82a367-5561-4137-8408-9772e5e9accc\\.user_uploaded\\media_1788165992864.png';
const outputPath = 'd:\\namami\\ecommerce\\frontend\\public\\brand-logo.png';
const outputPath2 = 'd:\\namami\\ecommerce\\frontend\\public\\logo.png';

fs.createReadStream(inputPath)
  .pipe(new PNG())
  .on('parsed', function() {
    console.log(`Processing image size: ${this.width}x${this.height}`);

    // Scan all border pixels to find the distribution of background colors (since paper/parchment background may have subtle gradient or noise)
    const bgSamples = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < 10; y++) {
        const idx = (this.width * y + x) << 2;
        bgSamples.push([this.data[idx], this.data[idx+1], this.data[idx+2]]);
      }
      for (let y = this.height - 10; y < this.height; y++) {
        const idx = (this.width * y + x) << 2;
        bgSamples.push([this.data[idx], this.data[idx+1], this.data[idx+2]]);
      }
    }

    // Compute median / average
    let sumR = 0, sumG = 0, sumB = 0;
    for (const [r, g, b] of bgSamples) {
      sumR += r; sumG += g; sumB += b;
    }
    const bgR = sumR / bgSamples.length;
    const bgG = sumG / bgSamples.length;
    const bgB = sumB / bgSamples.length;

    console.log(`Estimated background: R=${bgR.toFixed(1)}, G=${bgG.toFixed(1)}, B=${bgB.toFixed(1)}`);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = (this.width * y + x) << 2;
        const r = this.data[idx];
        const g = this.data[idx + 1];
        const b = this.data[idx + 2];

        // Euclidean distance in RGB space to background
        const dR = r - bgR;
        const dG = g - bgG;
        const dB = b - bgB;
        const dist = Math.sqrt(dR * dR + dG * dG + dB * dB);

        // Also check if pixel is generally light parchment color (r > 210, g > 200, b > 175)
        const isParchment = (r > 215 && g > 200 && b > 175 && Math.abs(r - g - 12) < 25 && Math.abs(g - b - 24) < 30);

        if (dist < 22 || (isParchment && dist < 32)) {
          // 100% transparent background
          this.data[idx + 3] = 0;
        } else if (dist < 55) {
          // Antialiased border
          const alpha = (dist - 22) / (55 - 22);
          this.data[idx + 3] = Math.round(Math.min(255, Math.max(0, alpha * 255)));

          // Remove the background contribution to avoid bright fringe
          const a = this.data[idx + 3] / 255;
          if (a > 0.05) {
            this.data[idx] = Math.round(Math.min(255, Math.max(0, (r - (1 - a) * bgR) / a)));
            this.data[idx + 1] = Math.round(Math.min(255, Math.max(0, (g - (1 - a) * bgG) / a)));
            this.data[idx + 2] = Math.round(Math.min(255, Math.max(0, (b - (1 - a) * bgB) / a)));
          }
        } else {
          // Pure opaque foreground
          this.data[idx + 3] = 255;
        }
      }
    }

    const buffer = PNG.sync.write(this);
    fs.writeFileSync(outputPath, buffer);
    fs.writeFileSync(outputPath2, buffer);
    console.log('High-quality transparent logo generated successfully!');
  });
