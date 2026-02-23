// Simple WAV Encoder for Web Audio API
function bufferToWave(abuffer: AudioBuffer, len: number) {
  let numOfChan = abuffer.numberOfChannels,
      length = len * numOfChan * 2 + 44,
      buffer = new ArrayBuffer(length),
      view = new DataView(buffer),
      channels = [], i, sample, offset = 0, pos = 0;

  // write WAVE header
  setUint32(0x46464952);                         // "RIFF"
  setUint32(length - 8);                         // file length - 8
  setUint32(0x45564157);                         // "WAVE"

  setUint32(0x20746d66);                         // "fmt " chunk
  setUint32(16);                                 // length = 16
  setUint16(1);                                  // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(abuffer.sampleRate);
  setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2);                      // block-align
  setUint16(16);                                 // 16-bit (hardcoded in this encoder)

  setUint32(0x61746164);                         // "data" - chunk
  setUint32(length - pos - 40);                  // chunk length

  // write interleaved data
  for(i = 0; i < abuffer.numberOfChannels; i++)
    channels.push(abuffer.getChannelData(i));

  while(pos < len) {
    for(i = 0; i < numOfChan; i++) {             // interleave channels
      sample = Math.max(-1, Math.min(1, channels[i][pos])); // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
      view.setInt16(44 + offset, sample, true);  // write 16-bit sample
      offset += 2;
    }
    pos++;
  }

  return new Blob([buffer], {type: "audio/wav"});

  function setUint16(data: number) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data: number) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}

export async function masterAudio(file: File): Promise<File> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Offline context for rendering
  const offlineCtx = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );

  // Source
  const source = offlineCtx.createBufferSource();
  source.buffer = audioBuffer;

  // 1. Highpass Filter (40Hz) - Remove rumble
  const highpass = offlineCtx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 40;

  // 2. Lowpass Filter (16kHz) - Remove ultrasonic noise
  const lowpass = offlineCtx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 16000;

  // 3. Dynamics Compressor (Simulate Loudnorm/Dynaudnorm)
  const compressor = offlineCtx.createDynamicsCompressor();
  compressor.threshold.value = -14; // Target -14 LUFS approx
  compressor.knee.value = 10;
  compressor.ratio.value = 12;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.25;

  // 4. Limiter (Prevent clipping)
  const limiter = offlineCtx.createDynamicsCompressor();
  limiter.threshold.value = -1.5; // TP -1.5
  limiter.ratio.value = 20; // Hard limit
  limiter.attack.value = 0.001;
  limiter.release.value = 0.1;

  // Chain: Source -> Highpass -> Lowpass -> Compressor -> Limiter -> Destination
  source.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(compressor);
  compressor.connect(limiter);
  limiter.connect(offlineCtx.destination);

  source.start();

  // Render
  const renderedBuffer = await offlineCtx.startRendering();
  
  // Encode back to WAV
  const wavBlob = bufferToWave(renderedBuffer, renderedBuffer.length);
  
  return new File([wavBlob], file.name.replace(/\.[^/.]+$/, "") + "_mastered.wav", { type: "audio/wav" });
}
