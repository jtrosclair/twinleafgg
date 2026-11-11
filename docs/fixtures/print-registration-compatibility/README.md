# Print registration and legacy alias compatibility

These nonshipping fixtures preserve two independently reproduced registration and deck-import regressions. They inject synthetic card definitions at bundle time into a disposable in-memory module graph. They do not assert that either synthetic collision exists in the current catalogue. No repository source, production state, database, or network service is modified or contacted.

- `registration-routes.cjs` injects an unannotated legacy card whose fullName is also proposed for a newly opted-in print. It runs the legacy set both before and after the new set and checks the real browser `ClientSimulator` snapshot restoration and production API validation and get-cards routes. In the earlier candidate the late legacy set was silently discarded by registration and the saved state restored the new class. The reviewed candidate retains the legacy owner in both orders.
- `legacy-alias-routes.cjs` injects a card whose `legacyFullName` is reached only after a set-code alias is tried. It checks the production deck-import API and direct parser with the fake set first and last. The earlier candidate checked the requested alias against the legacy catalogue instead of checking the resolved card, and incorrectly reported the card as unknown.
- `legacy-alias-regression.test.fixture.cjs` is the exact copy of the installed `simulator-api/tests/legacy-alias-regression.test.cjs` regression. It tests the second issue through both the parser and API and is provided for recovery/review, not automatic test discovery.
- `preimages.json` records baseline and reviewed candidate hashes. Its current-tree comparison was captured after integration, when all 11 reviewed manifest files and the additional API regression test matched the candidate. The frozen 11-file manifest had SHA-256 `08c11fca24aab7a524f44b0019dafff020e542969759274597bc93cf73a66d77`.
- The four `.log` files preserve red and green observations. The red runs used the earlier five-print candidate before the registration and legacy-alias fixes; the green runs used the exact reviewed candidate. They contain synthetic card names only.

## Reproduction

Use Node.js 20 or newer and a checkout whose `cloudflare/node_modules/esbuild` dependency is installed. The target checkout must contain its simulator API and server source; for green results it must include the reviewed compatibility fixes. By default the scripts target the checkout containing this fixture. Optionally pass another checkout root:

```sh
node docs/fixtures/print-registration-compatibility/registration-routes.cjs /path/to/checkout
node docs/fixtures/print-registration-compatibility/legacy-alias-routes.cjs /path/to/checkout
```

Both scripts compile browser-targeted test bundles in a temporary directory, clean them up at exit, and return nonzero on a failed assertion. The installed API regression can also be run with:

```sh
node --test simulator-api/tests/legacy-alias-regression.test.cjs
```

The legacy alias synthetic card, duplicate set placement, and registration order are test-only. Seven unrelated upstream prints remain deferred for the separately documented attack-cancellation defect.
