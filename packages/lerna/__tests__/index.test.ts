import * as plugin from "../src";

describe("Lerna plugin", () => {
    it("should export stages", () => {
        expect(plugin.init).toBeDefined();
        expect(plugin.publish).toBeDefined();
        expect(plugin.success).toBeDefined();
        expect(plugin.version).toBeDefined();
    });
});
