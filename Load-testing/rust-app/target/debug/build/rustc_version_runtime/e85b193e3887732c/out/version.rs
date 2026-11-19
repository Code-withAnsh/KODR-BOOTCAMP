
            /// Returns the `rustc` SemVer version and additional metadata
            /// like the git short hash and build date.
            pub fn version_meta() -> VersionMeta {
                VersionMeta {
                    semver: Version {
                        major: 1,
                        minor: 100,
                        patch: 0,
                        pre: Prerelease::new("").unwrap(),
                        build: BuildMetadata::new("").unwrap(),
                    },
                    host: "aarch64-apple-darwin".to_owned(),
                    short_version_string: "rustc 1.100.0 (0ef1bc386 2026-11-09) (Homebrew)".to_owned(),
                    commit_hash: Some("0ef1bc386059596dada8fb65b50425aab2ea637a".to_owned()),
                    commit_date: Some("2026-11-09".to_owned()),
                    build_date: None,
                    channel: Channel::Stable,
                    llvm_version: Some(LlvmVersion{ major: 23, minor: 1 }),
                }
            }
            