import { MedusaService } from "@medusajs/framework/utils";
import HomeVideo from "./models/home-video";

class HomeVideoModuleService extends MedusaService({
  HomeVideo,
}) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...args);
    /**
     * Medusa's type-level Pluralize<"HomeVideo"> generates names with 'es' (listHomeVideoes)
     * whereas runtime MedusaService (using npm pluralize) creates methods with 's' (listHomeVideos).
     * We bind aliases so both runtime and typing work without errors regardless of which method is called.
     */
    (this as any).listHomeVideoes = (this as any).listHomeVideos;
    (this as any).createHomeVideoes = (this as any).createHomeVideos;
    (this as any).updateHomeVideoes = (this as any).updateHomeVideos;
    (this as any).deleteHomeVideoes = (this as any).deleteHomeVideos;
  }
}

/**
 * Interface merging: Expose the actual runtime 'HomeVideos' methods to TypeScript
 * so callers can use listHomeVideos/createHomeVideos/updateHomeVideos without TS errors.
 */
interface HomeVideoModuleService {
  listHomeVideos: HomeVideoModuleService["listHomeVideoes"];
  createHomeVideos: HomeVideoModuleService["createHomeVideoes"];
  updateHomeVideos: HomeVideoModuleService["updateHomeVideoes"];
  deleteHomeVideos: HomeVideoModuleService["deleteHomeVideoes"];
}

export default HomeVideoModuleService;
