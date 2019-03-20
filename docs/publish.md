---
args:
  paths:
    default: "[process.cwd()]"
    describe: Project paths
  version:
    describe: Semver level to bump package.json version
---

### publish

#### Dependencies

{{dependencies}}

#### Arguments

{{argumentsSummary}}

{{argumentsTable}}

#### Return value

{{returnValueSummary}}

#### Description

If a project is ready for publish:

- has a clean git tree
- is on master
- is untagged (unreleased)

Then for each project:

- bump the npm version
- sync all versions
- git commit, tag, push
- npm publish

If the project is ready for publish but tagged (released):

- wait for version sync
- git commit if dependencies changed

After all of the above steps finish:

- npm install
- git commit package-lock.json
