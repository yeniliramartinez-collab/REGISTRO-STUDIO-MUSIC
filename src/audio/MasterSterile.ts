// Web Audio API implementation of Mastering (since ffmpeg is server-side)
// This matches the functionality requested: Normalization + EQ + WAV output

function bufferToWave(abuffer: AudioBuffer, len: number) {
  let numOfChan = abuffer.numberOfChannels,
      length = len * numOfChan * 2 + 44,
      buffer = new ArrayBuffer(length),
      view = new DataView(buffer),
      channels = [], i, sample, offset = 0, pos = 0;

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
  setUint16(16);                                 // 16-bit

  setUint32(0x61746164);                         // "data" - chunk
  setUint32(length - pos - 40);                  // chunk length

  for(i = 0; i < abuffer.numberOfChannels; i++)
    channels.push(abuffer.getChannelData(i));

  while(pos < len) {
    for(i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][pos])); 
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; 
      view.setInt16(44 + offset, sample, true);
      offset += 2;
    }
    pos++;
  }

  return new Blob([buffer], {type: "audio/wav"});

  function setUint16(data: number) { view.setUint16(pos, data, true); pos += 2; }
  function setUint32(data: number) { view.setUint32(pos, data, true); pos += 4; }
}

export async function masterizar(file: File): Promise<File> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const offlineCtx = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );

  const source = offlineCtx.createBufferSource();
  source.buffer = audioBuffer;

  // Highpass 40Hz
  const highpass = offlineCtx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 40;

  // Lowpass 16kHz
  const lowpass = offlineCtx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 16000;

  // Dynamics (Loudnorm simulation)
  const compressor = offlineCtx.createDynamicsCompressor();
  compressor.threshold.value = -14;
  compressor.ratio.value = 12;

  source.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(compressor);
  compressor.connect(offlineCtx.destination);

  source.start();

  const renderedBuffer = await offlineCtx.startRendering();
  const wavBlob = bufferToWave(renderedBuffer, renderedBuffer.length);
  
  return new File([wavBlob], "master_sterile.wav", { type: "audio/wav" });
}
