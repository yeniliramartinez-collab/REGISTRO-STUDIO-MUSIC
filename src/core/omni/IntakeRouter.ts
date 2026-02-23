import { eventBus } from "../EventBus";
import { generateAudioHash } from "./AudioDNA";
import { checkIntegrity } from "./IntegrityEngine";
import { buildContract } from "./ContractBuilder";
import { buildMetadata } from "./MetadataEngine";

eventBus.on("track.submitted", async ({ file, track }: { file: File, track: any }) => {
  try {
    checkIntegrity(file);

    const hash = await generateAudioHash(file);
    const metadata = buildMetadata(track, hash);
    const contract = buildContract(track);

    await eventBus.emit("track.processed", {
      hash,
      metadata,
      contract
    });
    console.log("[OMNI] Track processed successfully:", hash);
  } catch (error) {
    console.error("[OMNI] Track processing failed:", error);
    await eventBus.emit("track.failed", { error });
  }
});
