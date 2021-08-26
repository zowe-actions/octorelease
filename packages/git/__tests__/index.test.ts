import * as plugin from "../src";

describe("Git plugin", () => {
    it("should export actions", () => {
        expect(plugin.init).toBeDefined();
        expect(plugin.version).toBeDefined();
    });
});
