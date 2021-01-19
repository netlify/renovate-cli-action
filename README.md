# ✨ renovate-cli-action

A GitHub action to run [RenovateBot](https://docs.renovatebot.com/) in CI.

This action:

- Installs a fixed version of the renovate CLI via npm
- Runs it without requiring onboarding or a config to be present,
  with `trustLevel=high`, which is suitable for private crate registries (Rust).

## Usage

Typically, Renovate is run as a cron job but it's also handy to have the
option to run it manually, with a `workflow_dispatch`.

Here's what your `.github/workflows/renovate.yml` could look like:

```yaml
on:
  workflow_dispatch:
  schedule:
    # every day at 9:30AM
    - cron: "30 9 * * *"

name: Renovate

jobs:
  check_dependencies:
    name: Check dependencies
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v2

      - uses: netlify/cloudsmith-cargo-action@v1
        with:
          token: ${{ secrets.CLOUDSMITH_TOKEN }}

      - name: Renovate repository
        uses: netlify/renovate-cli-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          git-author: "John Doe <john.doe@example.org>"
```

> Note: if you actually use `GITHUB_TOKEN`, not all the checks will run on
> PRs created by renovate.

## Development

The npm `build` script (`npm run build`) compiles `src/` to `dist/`.

The `dist/` folder is committed to the repository, `node_modules/` is not.

The source is JavaScript with JSDoc annotations, checked by typescript.
