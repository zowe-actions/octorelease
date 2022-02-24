/**
 * Info about successfully released package
 */
export interface IReleasedPackage {
    /**
     * Package name
     */
    name: string;

    /**
     * URL to download package
     */
    url?: string;

    /**
     * Other plugin-specific properties
     */
    [key: string]: any;
}
