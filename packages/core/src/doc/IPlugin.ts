import { IContext } from "./IContext";

export interface IPlugin {
    fail?: (context: IContext, config: Record<string, any>) => Promise<void>;
    init?: (context: IContext, config: Record<string, any>) => Promise<void>;
    publish?: (context: IContext, config: Record<string, any>) => Promise<void>;
    success?: (context: IContext, config: Record<string, any>) => Promise<void>;
    version?: (context: IContext, config: Record<string, any>) => Promise<void>;
}
