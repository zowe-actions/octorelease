import * as core from "@actions/core";
import { Logger } from "../src/logger";

const testMessage = "Hello world!";
const testPlugin = "sample-plugin";

describe("Logger class", () => {
    it("should log DEBUG message to console", () => {
        jest.spyOn(core, "debug").mockImplementationOnce(console.debug);
        new Logger().debug(testMessage);
        expect(core.debug).toHaveBeenCalledWith(testMessage);
    });

    it("should log DEBUG message to console with plugin name prepended", () => {
        jest.spyOn(core, "debug").mockImplementationOnce(console.debug);
        new Logger(testPlugin).debug(testMessage);
        expect(core.debug).toHaveBeenCalledWith(`[${testPlugin}] ${testMessage}`);
    });

    it("should log ERROR message to console", () => {
        jest.spyOn(core, "error").mockImplementationOnce(console.error);
        new Logger().error(testMessage);
        expect(core.error).toHaveBeenCalledWith(testMessage);
    });

    it("should log ERROR message to console with plugin name prepended", () => {
        jest.spyOn(core, "error").mockImplementationOnce(console.error);
        new Logger(testPlugin).error(testMessage);
        expect(core.error).toHaveBeenCalledWith(`[${testPlugin}] ${testMessage}`);
    });

    it("should log INFO message to console", () => {
        jest.spyOn(core, "info").mockImplementationOnce(console.info);
        new Logger().info(testMessage);
        expect(core.info).toHaveBeenCalledWith(testMessage);
    });

    it("should log INFO message to console with plugin name prepended", () => {
        jest.spyOn(core, "info").mockImplementationOnce(console.info);
        new Logger(testPlugin).info(testMessage);
        expect(core.info).toHaveBeenCalledWith(`[${testPlugin}] ${testMessage}`);
    });

    it("should log WARNING message to console", () => {
        jest.spyOn(core, "warning").mockImplementationOnce(console.warn);
        new Logger().warning(testMessage);
        expect(core.warning).toHaveBeenCalledWith(testMessage);
    });

    it("should log WARNING message to console with plugin name prepended", () => {
        jest.spyOn(core, "warning").mockImplementationOnce(console.warn);
        new Logger(testPlugin).warning(testMessage);
        expect(core.warning).toHaveBeenCalledWith(`[${testPlugin}] ${testMessage}`);
    });
});
