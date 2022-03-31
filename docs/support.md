# Support

<!-- ## Resources -->

## Frequently Asked Questions

### Why not use `semantic-release`?

`semantic-release` is a popular project that inspired the creation of Octorelease. However it has the following limitations:

- Does not allow `version` step to be skipped ([semantic-release/semantic-release#896](https://github.com/semantic-release/semantic-release/issues/896))
- Does not allow runs to be triggered by pull request ([semantic-release/semantic-release#1074](https://github.com/semantic-release/semantic-release/issues/1074))
- Does not support annotating Git tags ([semantic-release/semantic-release#1266](https://github.com/semantic-release/semantic-release/pull/1266))
- Does not support signing off Git commits ([semantic-release/git#214](https://github.com/semantic-release/git/issues/214))

You should consider using `semantic-release` if it meets your needs, since it is well supported and more mature than Octorelease.

## Troubleshooting

TODO

## Node version requirement

It is recommended to use the latest LTS version of Node.js, but any [active or maintenance LTS](https://nodejs.org/en/about/releases/) version is supported. Octorelease is not guaranteed to work on the current non-LTS version.
