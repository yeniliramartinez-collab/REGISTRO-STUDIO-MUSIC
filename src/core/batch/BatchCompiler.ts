import { eventBus } from "../EventBus";
import { generarPDFColectivo } from "../../legal/PDFColectivo";

eventBus.on("batch.ready", async ({ lote }: { lote: any[] }) => {
  console.log("[BatchCompiler] Generating PDF for batch...");
  generarPDFColectivo(lote);
});
