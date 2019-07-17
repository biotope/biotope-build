export type GulpTask = () => Promise<void>;

export type GulpTaskCreator = (config: any) => GulpTask;