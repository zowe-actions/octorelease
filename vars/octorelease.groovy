/**
 * Typed options for running Octorelease from a Jenkins pipeline.
 *
 */
class OctoreleaseOptions implements Serializable {
    /** Specify whether to detect [ci skip] in last commit message. */
    Boolean ciSkip

    /** Custom directory to search for release configuration. */
    String configDir

    /** Don't make any changes but report what would have been done. */
    Boolean dryRun

    /** New version number that should be released. */
    String newVersion

    /** Stages that should be skipped. */
    List<String> skipStages

    /** Custom working directory to use instead of the project root. */
    String workingDir

    Map<String, String> toEnvVars() {
        Map<String, String> env = [:]
        putIfPresent(env, "INPUT_CI-SKIP", ciSkip)
        putIfPresent(env, "INPUT_CONFIG-DIR", configDir)
        putIfPresent(env, "INPUT_DRY-RUN", dryRun)
        putIfPresent(env, "INPUT_NEW-VERSION", newVersion)
        putIfPresent(env, "INPUT_SKIP-STAGES", skipStages?.join(","))
        putIfPresent(env, "INPUT_WORKING-DIR", workingDir)
        return env
    }

    private static void putIfPresent(Map<String, String> env, String key, Object value) {
        if (value != null) {
            env[key] = value.toString()
        }
    }
}

/**
 * Run Octorelease with options configured via a closure, e.g.:
 *   octorelease {
 *       configDir = "jenkins"
 *       dryRun = true
 *   }
 */
def call(Closure body) {
    OctoreleaseOptions options = new OctoreleaseOptions()
    body.resolveStrategy = Closure.DELEGATE_FIRST
    body.delegate = options
    body()
    run(options)
}

/**
 * Run Octorelease with default options.
 */
def call() {
    run(new OctoreleaseOptions())
}

private void run(OctoreleaseOptions options) {
    List<String> env = options.toEnvVars().collect { key, value -> "${key}=${value}" }
    withEnv(env) {
        sh "node dist/index.js"
    }
}
