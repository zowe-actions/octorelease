import { IContext } from "./IContext";

/**
 * Type for loaded plugin modules
 */
export interface IPlugin {
    /**
     * Handler for "fail" stage
     * @param context Global context object for Octorelease
     * @param config Plugin configuration object
     */
    fail?: (context: IContext, config: Record<string, any>) => Promise<void>;

    /**
     * Handler for "init" stage
     * @param context Global context object for Octorelease
     * @param config Plugin configuration object
     */
    init?: (context: IContext, config: Record<string, any>) => Promise<void>;

    /**
     * Handler for "publish" stage
     * @param context Global context object for Octorelease
     * @param config Plugin configuration object
     */
    publish?: (context: IContext, config: Record<string, any>) => Promise<void>;

    /**
     * Handler for "success" stage
     * @param context Global context object for Octorelease
     * @param config Plugin configuration object
     */
    success?: (context: IContext, config: Record<string, any>) => Promise<void>;

    /**
     * Handler for "version" stage
     * @param context Global context object for Octorelease
     * @param config Plugin configuration object
     */
    version?: (context: IContext, config: Record<string, any>) => Promise<void>;
}
