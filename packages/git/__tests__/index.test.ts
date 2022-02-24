import * as plugin from "../src";

describe("Git plugin", () => {
    it("should export stages", () => {
        expect(plugin.init).toBeDefined();
        expect(plugin.version).toBeDefined();
    });
});
