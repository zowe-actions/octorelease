import * as plugin from "../src";

describe("GitHub plugin", () => {
    it("should export stages", () => {
        expect(plugin.fail).toBeDefined();
        expect(plugin.init).toBeDefined();
        expect(plugin.publish).toBeDefined();
        expect(plugin.success).toBeDefined();
    });
});
