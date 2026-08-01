import fs from 'fs';
import path from 'path';
import https from 'https';

const MODEL_URL = "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb";

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download file: status code ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  try {
    const modelsDir = path.join(process.cwd(), 'apps', 'web', 'public', 'models');
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
      console.log(`Created directory: ${modelsDir}`);
    }
    const destPath = path.join(modelsDir, 'ai-humanoid.glb');
    console.log(`Downloading model from ${MODEL_URL}...`);
    await downloadFile(MODEL_URL, destPath);
    console.log(`Download complete! Model saved to: ${destPath}`);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

run();
