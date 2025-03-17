/**
 * Copyright 2020-202X Zowe Actions Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-console */
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
        new Logger().warn(testMessage);
        expect(core.warning).toHaveBeenCalledWith(testMessage);
    });

    it("should log WARNING message to console with plugin name prepended", () => {
        jest.spyOn(core, "warning").mockImplementationOnce(console.warn);
        new Logger(testPlugin).warn(testMessage);
        expect(core.warning).toHaveBeenCalledWith(`[${testPlugin}] ${testMessage}`);
    });
});
