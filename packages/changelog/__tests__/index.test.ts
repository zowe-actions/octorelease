import * as plugin from "../src";

describe("Changelog plugin", () => {
    it("should export actions", () => {
        expect(plugin.init).toBeDefined();
        expect(plugin.version).toBeDefined();
    });
});
