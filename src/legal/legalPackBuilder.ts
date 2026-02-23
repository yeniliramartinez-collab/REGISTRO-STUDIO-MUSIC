export interface Metadata {
  title: string;
  author: string;
  duration?: number;
}

export function buildLegalPack(metadata: Metadata) {
  return {
    BMI: {
      title: metadata.title,
      composer: metadata.author,
      duration: metadata.duration || 0
    },
    copyright: {
      owner: metadata.author,
      year: new Date().getFullYear()
    }
  };
}
