//@ts-check
"use strict";

const core = require("@actions/core");
const github = require("@actions/github");
const execa = require("execa");

function run() {
  try {
    const githubToken = core.getInput("github-token", { required: true });
    const gitAuthor = core.getInput("git-author", { required: true });
    const repository = `${github.context.repo.owner}/${github.context.repo.repo}`;

    let result;

    core.info(`Installing Renovate CLI`);
    result = execa.sync(
      `sudo`,
      [`npm`, `install`, `--global`, `renovate@28.11.1`],
      {
        stdout: "inherit",
        stderr: "inherit",
      }
    );
    if (result.failed) {
      throw new Error(
        `npm install failed. Code: ${result.exitCode}, signal: ${result.signal}`
      );
    }

    core.info(`Running Renovate`);
    result = execa.sync(
      `renovate`,
      [
        // Required for Rust private repositories
        `--allow-custom-crate-registries`,
        `true`,
        // Don't require an onboarding PR to be merged
        `--onboarding`,
        `false`,
        // Don't require a config to be present
        `--require-config`,
        `false`,
        // GitHub token
        `--token`,
        githubToken,
        // Git Author
        `--git-author`,
        gitAuthor,
        // Repository
        repository,
      ],
      {
        stdout: "inherit",
        stderr: "inherit",
        env: {
          // Handy for troubleshooting
          LOG_LEVEL: "debug",
        },
      }
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
