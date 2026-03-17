import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export async function autoMaster(buffer: Buffer, originalName: string): Promise<Buffer> {
  const tmpDir = os.tmpdir();
  const inputId = crypto.randomUUID();
  const ext = path.extname(originalName) || '.wav';
  const inputPath = path.join(tmpDir, `input_${inputId}${ext}`);
  const outputPath = path.join(tmpDir, `output_${inputId}.wav`);

  await fs.writeFile(inputPath, buffer);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      // Apply dynamic compression and limiting
      // acompressor: dynamic compression
      // alimiter: brickwall limiting
      .audioFilters([
        {
          filter: 'acompressor',
          options: {
            threshold: '-12dB',
            ratio: 4,
            attack: 5,
            release: 50,
            makeup: 2
          }
        },
        {
          filter: 'alimiter',
          options: {
            limit: '-1dB',
            attack: 5,
            release: 50,
            level: true
          }
        }
      ])
      .toFormat('wav')
      .on('end', async () => {
        try {
          const processedBuffer = await fs.readFile(outputPath);
          // Cleanup
          await fs.unlink(inputPath).catch(console.error);
          await fs.unlink(outputPath).catch(console.error);
          resolve(processedBuffer);
        } catch (err) {
          reject(err);
        }
      })
      .on('error', async (err) => {
        // Cleanup on error
        await fs.unlink(inputPath).catch(console.error);
        await fs.unlink(outputPath).catch(console.error);
        reject(err);
      })
      .save(outputPath);
  });
}
