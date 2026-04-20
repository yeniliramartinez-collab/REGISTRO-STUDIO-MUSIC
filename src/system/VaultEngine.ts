import { VaultAsset, SocialPlatform } from '../types';

export class VaultEngine {
  private vault: VaultAsset[] = [];

  // Optimal posting times (mocked logic)
  private optimalTimes: Record<SocialPlatform, number[]> = {
    'TikTok': [10, 15, 20], // Hours: 10 AM, 3 PM, 8 PM
    'Instagram': [9, 12, 18], // Hours: 9 AM, 12 PM, 6 PM
    'Pinterest': [14, 20, 23], // Hours: 2 PM, 8 PM, 11 PM
    'YouTube': [15, 17, 19] // Hours: 3 PM, 5 PM, 7 PM
  };

  addToVault(asset: VaultAsset) {
    this.vault.push(asset);
    this.prioritizeAndSchedule();
  }

  getVaultAssets(): VaultAsset[] {
    return [...this.vault].sort((a, b) => b.priorityScore - a.priorityScore);
  }

  // AI prioritizes content based on score and schedules it
  private prioritizeAndSchedule() {
    const now = new Date();
    const currentHour = now.getHours();

    this.vault.forEach(asset => {
      if (asset.status === 'vaulted') {
        // Mock AI prioritization logic
        // Higher score if the narrative angle matches current trends (simplified to random here)
        asset.priorityScore = Math.floor(Math.random() * 100);

        // Schedule if priority is high enough
        if (asset.priorityScore > 50) {
          asset.status = 'scheduled';
          asset.scheduledFor = [];

          // Determine best platform based on asset type
          const platforms: SocialPlatform[] = [];
          if (asset.type === 'video') platforms.push('TikTok', 'Instagram', 'YouTube');
          if (asset.type === 'image') platforms.push('Instagram', 'Pinterest');
          if (asset.type === 'audio_snippet') platforms.push('TikTok', 'Instagram');

          platforms.forEach(platform => {
            // Find next optimal time
            const times = this.optimalTimes[platform];
            let nextHour = times.find(h => h > currentHour);
            
            let scheduleDate = new Date(now);
            if (nextHour !== undefined) {
              scheduleDate.setHours(nextHour, 0, 0, 0);
            } else {
              // Schedule for tomorrow's first optimal time
              scheduleDate.setDate(scheduleDate.getDate() + 1);
              scheduleDate.setHours(times[0], 0, 0, 0);
            }

            asset.scheduledFor!.push({
              platform,
              time: scheduleDate.getTime()
            });
          });
        }
      }
    });
  }

  publishAsset(assetId: string) {
    const asset = this.vault.find(a => a.id === assetId);
    if (asset) {
      asset.status = 'published';
    }
  }
}

export const vaultEngine = new VaultEngine();
