export type ApiResponse<T = void> = {
    apiVersion: string;
    content?: T;
    message: string;
    timestamp: string;
    hasNextPage?: boolean | null;
}