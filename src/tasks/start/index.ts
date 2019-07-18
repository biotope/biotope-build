import { ServeConfig } from "../common/config";
import openServer from "./openServer";
import cleanupFolder from "../common/cleanupFolder";
import createPreviewAppTo from "./createPreviewAppTo";
import rollupTask from "../common/rollupTask";

const createServeTask = (config: ServeConfig) => {
  const cleanupTmp = cleanupFolder(config.tempFolder);
  const createPreviewAppToTmp = createPreviewAppTo(config.tempFolder);
  return async () => {
    await cleanupTmp();
    rollupTask();
    createPreviewAppToTmp(config.layoutFile)
    return openServer(config);
  }
}

export default createServeTask;