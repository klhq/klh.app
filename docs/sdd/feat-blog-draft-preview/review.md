## Review

Reviewed the implementation with the Goose compliance, security, correctness, performance, and test passes, followed by a focused security pass covering the content workflow. The review added a compile-only safety regression test.

The suggested nested-path fixes were not applicable: nested MDX files are rejected before reading because the existing publisher only accepts top-level article slugs. Recursive enumeration is intentional so nested articles fail explicitly instead of being skipped. The preview static-generation concern is covered by the existing private deployment boundary and production-versus-preview HTTP checks; only preview pages opt into drafts.

The security pass claimed `compile` could execute MDX expressions. This was checked against the [MDX API documentation](https://mdxjs.com/packages/mdx/#compilefile-options): `compile` generates JavaScript, while `evaluate` and `run` execute it. The validator only calls `compile`. A test with a throwing top-level JavaScript expression and an unreachable external image URL passes without executing the expression or fetching the image.

## AC Status

| Criterion | Status | Evidence |
| --- | --- | --- |
| Preview-only draft reading | Done | Regression test covers opt-in access and production defaults. Production fixture HTTP request returned 404 and listing excluded it. |
| Draft labels and discovery protection | Done | Preview fixture appeared in article and card with Draft preview labels and noindex metadata. Production and preview feeds and sitemaps excluded it. |
| Shared validation | Done | Malformed draft MDX, missing Markdown/reference/JSX images, and nested filenames fail. Real content checkouts passed. |
| Compile-only checks | Done | Throwing draft JavaScript expression and unreachable external image compile without execution or network fetching. |
| Content PR checks without deployment changes | Manual-verify | Workflow is prepared in klh-content on ci/blog-validation. YAML and command were checked locally. Existing deployment workflow files are untouched. Remote CI can run once the shared validator is merged into app main. |

## Validation

20 tests pass. TypeScript and ESLint pass. The full production build fetched real remote content and ran the new validator successfully. Additional production and preview builds used the same temporary draft to verify HTTP behavior; the homelab standalone server artifact also served the draft and excluded it from discovery. The temporary article was removed afterward and was never committed.

Actionlint was unavailable locally; YAML parsing and the workflow command contract were checked instead. The content workflow has not yet executed on GitHub. Branch protection and homelab deployment state were not changed. Merge the app PR before the content workflow PR.
