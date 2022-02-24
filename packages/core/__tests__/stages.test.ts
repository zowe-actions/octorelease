import * as core from "@actions/core";
import { IContext } from "../src/doc";
import { Inputs } from "../src/inputs";
import { Logger } from "../src/logger";
import * as stages from "../src/stages";

const testPlugin = "sample-plugin";

function buildContext(stage: string): Partial<IContext> {
    return {
        logger: new Logger(),
        plugins: {
            [testPlugin]: { stage }
        }
    };
}

describe("Core stages", () => {
    const testHandler = jest.fn(async (context: IContext, config: any) => {
        context.logger.info(config.stage);
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
        await stages.fail(context as IContext, pluginsLoaded);
        expect(testHandler).toHaveBeenCalledTimes(1);
        expect(core.info).toHaveBeenCalledWith(`[${testPlugin}] fail`);
    });

    it("should not execute fail handler when fail stage is skipped", async () => {
        const context = buildContext("fail");
        const pluginsLoaded = { [testPlugin]: { fail: testHandler } };
        jest.spyOn(Inputs, "skipStages", "get").mockReturnValueOnce(["fail"]);
        await stages.fail(context as IContext, pluginsLoaded);
        expect(testHandler).toHaveBeenCalledTimes(0);
    });

    it("should execute init handler on plugins", async () => {
        const context = buildContext("init");
        const pluginsLoaded = { [testPlugin]: { init: testHandler } };
        await stages.init(context as IContext, pluginsLoaded);
        expect(testHandler).toHaveBeenCalledTimes(1);
        expect(core.info).toHaveBeenCalledWith(`[${testPlugin}] init`);
    });

    it("should still execute init handler when init stage is skipped", async () => {
        const context = buildContext("init");
        const pluginsLoaded = { [testPlugin]: { init: testHandler } };
        jest.spyOn(Inputs, "skipStages", "get").mockReturnValueOnce(["init"]);
        await stages.init(context as IContext, pluginsLoaded);
        expect(testHandler).toHaveBeenCalledTimes(1);
    });

    it("should execute publish handler on plugins", async () => {
        const context = buildContext("publish");
        const pluginsLoaded = { [testPlugin]: { publish: testHandler } };
        await stages.publish(context as IContext, pluginsLoaded);
        expect(testHandler).toHaveBeenCalledTimes(1);
        expect(core.info).toHaveBeenCalledWith(`[${testPlugin}] publish`);
    });

    it("should not execute publish handler when publish stage is skipped", async () => {
        const context = buildContext("publish");
        const pluginsLoaded = { [testPlugin]: { publish: testHandler } };
        jest.spyOn(Inputs, "skipStages", "get").mockReturnValueOnce(["publish"]);
        await stages.publish(context as IContext, pluginsLoaded);
        expect(testHandler).toHaveBeenCalledTimes(0);
    });

    it("should execute success handler on plugins", async () => {
        const context = buildContext("success");
        const pluginsLoaded = { [testPlugin]: { success: testHandler } };
        await stages.success(context as IContext, pluginsLoaded);
        expect(testHandler).toHaveBeenCalledTimes(1);
        expect(core.info).toHaveBeenCalledWith(`[${testPlugin}] success`);
    });

    it("should not execute success handler when success stage is skipped", async () => {
        const context = buildContext("success");
        const pluginsLoaded = { [testPlugin]: { success: testHandler } };
        jest.spyOn(Inputs, "skipStages", "get").mockReturnValueOnce(["success"]);
        await stages.success(context as IContext, pluginsLoaded);
        expect(testHandler).toHaveBeenCalledTimes(0);
    });

    it("should execute version handler on plugins", async () => {
        const context = buildContext("version");
        const pluginsLoaded = { [testPlugin]: { version: testHandler } };
        await stages.version(context as IContext, pluginsLoaded);
        expect(testHandler).toHaveBeenCalledTimes(1);
        expect(core.info).toHaveBeenCalledWith(`[${testPlugin}] version`);
    });

    it("should not execute version handler when version stage is skipped", async () => {
        const context = buildContext("version");
        const pluginsLoaded = { [testPlugin]: { fail: testHandler } };
        jest.spyOn(Inputs, "skipStages", "get").mockReturnValueOnce(["version"]);
        await stages.version(context as IContext, pluginsLoaded);
        expect(testHandler).toHaveBeenCalledTimes(0);
    });
});
