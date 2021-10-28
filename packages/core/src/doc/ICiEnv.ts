export interface ICiEnv {
    service: string;
    payload: {
        before?: string;
        head_commit?: { [key: string]: any };
        pull_request?: { [key: string]: any };
    };
    sha: string;
    ref: string;
    runNumber: number;
    repo: {
        owner: string;
        repo: string
    };
}
