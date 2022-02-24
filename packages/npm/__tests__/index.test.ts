import * as plugin from "../src";

describe("NPM plugin", () => {
    it("should export stages", () => {
        expect(plugin.init).toBeDefined();
        expect(plugin.publish).toBeDefined();
        expect(plugin.success).toBeDefined();
        expect(plugin.version).toBeDefined();
    });
});
