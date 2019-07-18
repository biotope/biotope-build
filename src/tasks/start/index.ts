import { BuildConfig } from "../common/config";
import openServer from "./openServer";
import cleanupFolder from "../common/cleanupFolder";
import createPreviewAppTo from "./createPreviewAppTo";
import rollupTask from "../common/rollupTask";

const createServeTask = (config: BuildConfig) => {
  const cleanupTmp = cleanupFolder(config.paths.distFolder);
  const createPreviewAppToTmp = createPreviewAppTo(config.paths.distFolder);
  return async () => {
    await cleanupTmp();
    await rollupTask(config);
    createPreviewAppToTmp(config.serve.layoutFile);
    return openServer(config);
  };
}

export default createServeTask;
