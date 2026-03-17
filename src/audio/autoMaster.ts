export async function applyAutoMaster(file: File): Promise<File> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );
    
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    
    // 1. Dynamic Compressor (Glue Compressor)
    const compressor = offlineContext.createDynamicsCompressor();
    compressor.threshold.value = -24; // dB
    compressor.knee.value = 30; // dB
    compressor.ratio.value = 4;
    compressor.attack.value = 0.005; // 5ms
    compressor.release.value = 0.050; // 50ms
    
    // 2. Limiter (Brickwall)
    const limiter = offlineContext.createDynamicsCompressor();
    limiter.threshold.value = -1.0; // dB
    limiter.knee.value = 0.0; // Hard knee
    limiter.ratio.value = 20.0; // High ratio for limiting
    limiter.attack.value = 0.001; // 1ms
    limiter.release.value = 0.050; // 50ms
    
    // Makeup Gain
    const makeupGain = offlineContext.createGain();
    makeupGain.gain.value = 2.0; // +6dB roughly
    
    // Connect nodes
    source.connect(compressor);
    compressor.connect(makeupGain);
    makeupGain.connect(limiter);
    limiter.connect(offlineContext.destination);
    
    source.start(0);
    
    const renderedBuffer = await offlineContext.startRendering();
    
    // Convert AudioBuffer to Wav Blob
    const wavBlob = audioBufferToWav(renderedBuffer);
    
    const newFileName = file.name.replace(/\.[^/.]+$/, "") + "_mastered.wav";
    return new File([wavBlob], newFileName, { type: 'audio/wav' });
  } catch (error) {
    console.error("Auto-Mastering failed:", error);
    return file; // Return original if it fails
  } finally {
    audioContext.close();
  }
}

// Helper function to convert AudioBuffer to WAV format
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const bufferArray = new ArrayBuffer(length);
  const view = new DataView(bufferArray);
  const channels = [];
  let i;
  let sample;
  let offset = 0;
  let pos = 0;

  function setUint16(data: number) {
    view.setUint16(offset, data, true);
    offset += 2;
  }

  function setUint32(data: number) {
    view.setUint32(offset, data, true);
    offset += 4;
  }

  // write WAVE header
  setUint32(0x46464952);                         // "RIFF"
  setUint32(length - 8);                         // file length - 8
  setUint32(0x45564157);                         // "WAVE"

  setUint32(0x20746d66);                         // "fmt " chunk
  setUint32(16);                                 // length = 16
  setUint16(1);                                  // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2);                      // block-align
  setUint16(16);                                 // 16-bit (hardcoded in this demo)

  setUint32(0x61746164);                         // "data" - chunk
  setUint32(length - offset - 4);                // chunk length

  // write interleaved data
  for (i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < buffer.length) {
    for (i = 0; i < numOfChan; i++) {
      // interleave channels
      sample = Math.max(-1, Math.min(1, channels[i][pos])); // clamp
      sample = (sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
      view.setInt16(offset, sample, true);          // write 16-bit sample
      offset += 2;
    }
    pos++;
  }

  return new Blob([bufferArray], { type: "audio/wav" });
}
