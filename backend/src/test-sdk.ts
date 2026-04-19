import { FeatureSDK } from "./modules/sdk/client";

const sdk = new FeatureSDK({
    apiUrl: `http://localhost:5001/api/v1`,
});


async function test() {
    const user = { id: "123", country: "IN" };

    const res = await sdk.evaluate("interview_rounds", user);

    console.log("Enabled:", res.enabled);
    console.log("Config:", res.enabled ? res.config : null);
}

test();