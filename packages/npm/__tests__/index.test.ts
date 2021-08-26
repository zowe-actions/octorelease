import * as plugin from "../src";

describe("NPM plugin", () => {
    it("should export actions", () => {
        expect(plugin.init).toBeDefined();
        expect(plugin.publish).toBeDefined();
        expect(plugin.success).toBeDefined();
        expect(plugin.version).toBeDefined();
    });
});
