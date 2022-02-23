import * as core from "@actions/core";
import * as actions from "../src/actions";
import { IContext } from "../src/doc";
import { Inputs } from "../src/inputs";
import { Logger } from "../src/logger";

const testPlugin = "sample-plugin";

function buildContext(action: string): Partial<IContext> {
    return {
        logger: new Logger(),
        plugins: {
            [testPlugin]: { action }
        }
    };
}

describe("Core actions", () => {
    const testHandler = jest.fn(async (context: IContext, config: any) => {
        context.logger.info(config.action);
    });
    let oldProcessEnv: any;

    beforeAll(() => {
        oldProcessEnv = process.env;
        jest.spyOn(core, "info").mockImplementation();
    });

    afterAll(() => {
        process.env = oldProcessEnv;
    });

    it("should execute fail handler on plugins", async () => {
        const context = buildContext("fail");
        const pluginsLoaded = { [testPlugin]: { fail: testHandler } };
        await actions.fail(context as IContext, pluginsLoaded);
        expect(testHandler).toHaveBeenCalledTimes(1);
        expect(core.info).toHaveBeenCalledWith(`[${testPlugin}] fail`);
    });

    it("should not execute fail handler when fail stage is skipped", async () => {
        const context = buildContext("fail");
        const pluginsLoaded = { [testPlugin]: { fail: testHandler } };
        jest.spyOn(Inputs, "skipStages", "get").mockReturnValueOnce(["fail"]);
        await actions.fail(context as IContext, pluginsLoaded);
        expect(testHandler).toHaveBeenCalledTimes(0);
    });

    it("should execute init handler on plugins", async () => {
        const context = buildContext("init");
        const pluginsLoaded = { [testPlugin]: { init: testHandler } };
        await actions.init(context as IContext, pluginsLoaded);
        expect(testHandler).toHaveBeenCalledTimes(1);
        expect(core.info).toHaveBeenCalledWith(`[${testPlugin}] init`);
    });

    it("should still execute init handler when init stage is skipped", async () => {
        const context = buildContext("init");
        const pluginsLoaded = { [testPlugin]: { init: testHandler } };
        jest.spyOn(Inputs, "skipStages", "get").mockReturnValueOnce(["init"]);
        await actions.init(context as IContext, pluginsLoaded);
        expect(testHandler).toHaveBeenCalledTimes(1);
    });

    it("should execute publish handler on plugins", async () => {
        const context = buildContext("publish");
        const pluginsLoaded = { [testPlugin]: { publish: testHandler } };
        await actions.publish(context as IContext, pluginsLoaded);
        expect(testHandler).toHaveBeenCalledTimes(1);
        expect(core.info).toHaveBeenCalledWith(`[${testPlugin}] publish`);
    });

    it("should not execute publish handler when publish stage is skipped", async () => {
        const context = buildContext("publish");
        const pluginsLoaded = { [testPlugin]: { publish: testHandler } };
        jest.spyOn(Inputs, "skipStages", "get").mockReturnValueOnce(["publish"]);
        await actions.publish(context as IContext, pluginsLoaded);
        expect(testHandler).toHaveBeenCalledTimes(0);
    });

    it("should execute success handler on plugins", async () => {
        const context = buildContext("success");
        const pluginsLoaded = { [testPlugin]: { success: testHandler } };
        await actions.success(context as IContext, pluginsLoaded);
        expect(testHandler).toHaveBeenCalledTimes(1);
        expect(core.info).toHaveBeenCalledWith(`[${testPlugin}] success`);
    });

    it("should not execute success handler when success stage is skipped", async () => {
        const context = buildContext("success");
        const pluginsLoaded = { [testPlugin]: { success: testHandler } };
        jest.spyOn(Inputs, "skipStages", "get").mockReturnValueOnce(["success"]);
        await actions.success(context as IContext, pluginsLoaded);
        expect(testHandler).toHaveBeenCalledTimes(0);
    });

    it("should execute version handler on plugins", async () => {
        const context = buildContext("version");
        const pluginsLoaded = { [testPlugin]: { version: testHandler } };
        await actions.version(context as IContext, pluginsLoaded);
        expect(testHandler).toHaveBeenCalledTimes(1);
        expect(core.info).toHaveBeenCalledWith(`[${testPlugin}] version`);
    });

    it("should not execute version handler when version stage is skipped", async () => {
        const context = buildContext("version");
        const pluginsLoaded = { [testPlugin]: { fail: testHandler } };
        jest.spyOn(Inputs, "skipStages", "get").mockReturnValueOnce(["version"]);
        await actions.version(context as IContext, pluginsLoaded);
        expect(testHandler).toHaveBeenCalledTimes(0);
    });
});
