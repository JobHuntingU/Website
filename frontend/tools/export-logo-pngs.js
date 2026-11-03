const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const svgPath = path.join(root, 'src/assets/Logo_1.svg');
const outDir = path.join(root, 'public');

fs.mkdirSync(outDir, { recursive: true });

const svg = fs.readFileSync(svgPath, 'utf8');

const render = async (fileName, svgText) => {
  const target = path.join(outDir, fileName);
  await sharp(Buffer.from(svgText))
    .resize({ width: 2000, height: 500, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(target);
  return target;
};

(async () => {
  try {
    const transparent = await render('jhu-logo-transparent.png', svg);
    const black = await render('jhu-logo-one-color-black.png', svg.replace(/fill="#469bd1"/gi, 'fill="#000000"'));
    const white = await render('jhu-logo-one-color-white.png', svg.replace(/fill="#469bd1"/gi, 'fill="#FFFFFF"'));

    console.log('Generated:');
    for (const file of [transparent, black, white]) {
      const stats = fs.statSync(file);
      console.log(path.basename(file), stats.size, 'bytes');
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
