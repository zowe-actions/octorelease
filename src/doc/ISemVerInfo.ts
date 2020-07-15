/**
 * Level of difference between two semantic versions
 */
type SemVerLevel = "major" | "minor" | "patch" | "none";

export interface ISemVerInfo {
    level: SemVerLevel;
    newVersion?: string;
}
