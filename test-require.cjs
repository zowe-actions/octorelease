try {
    const mod = require("@actions/http-client");
    console.log("OK - loaded synchronously", mod);
} catch (err) {
    if (err.code === "ERR_REQUIRE_ASYNC_MODULE") {
        console.log("Has top-level await somewhere in its graph - cannot require() synchronously");
    } else {
        throw err;
    }
}
