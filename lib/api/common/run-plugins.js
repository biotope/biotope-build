"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPlugins = void 0;
const flatten = (plugins) => plugins
    .reduce((accumulator, plugin) => ([
    ...accumulator,
    ...(Array.isArray(plugin) ? flatten(plugin) : [plugin]),
]), []);
const filterPlugins = (plugins, hook) => plugins
    .filter((plugin) => plugin.hook === hook || !plugin.hook)
    .sort((left, right) => {
    const leftPriority = left.priority || 0;
    const rightPriority = right.priority || 0;
    if (leftPriority > rightPriority) {
        return -1;
    }
    if (leftPriority < rightPriority) {
        return 1;
    }
    return 0;
});
const groupPluginsByPriority = (plugins) => {
    const grouped = plugins.reduce((accumulator, plugin) => (Object.assign(Object.assign({}, accumulator), { [`${plugin.priority || 0}`]: [
            ...(accumulator[`${plugin.priority || 0}`] || []),
            plugin,
        ] })), {});
    return Object.keys(grouped).sort((left, right) => {
        const leftPriority = parseFloat(left);
        const rightPriority = parseFloat(right);
        if (leftPriority > rightPriority) {
            return -1;
        }
        if (leftPriority < rightPriority) {
            return 1;
        }
        return 0;
    }).map((priority) => grouped[priority]);
};
const logPluginExecutionError = (pluginName, error) => {
    console.log(`Plugin "${pluginName}" threw an error.`);
    console.error(error);
};
const runPlugin = (plugin, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, runner } = typeof plugin !== 'function' ? plugin : { name: plugin.name, runner: plugin };
    try {
        return Promise.resolve(runner(...args))
            .catch((error) => logPluginExecutionError(name, error))
            .then(() => { });
    }
    catch (error) {
        logPluginExecutionError(name, error);
        return Promise.resolve();
    }
});
exports.runPlugins = (plugins, hook, ...args) => __awaiter(void 0, void 0, void 0, function* () {
    const grouped = groupPluginsByPriority(filterPlugins(flatten(plugins), hook));
    for (let index = 0; index < grouped.length; index += 1) {
        const group = grouped[index];
        yield Promise.all(group.map((plugin) => runPlugin(plugin, ...args)));
    }
});
