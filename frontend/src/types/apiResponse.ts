export interface SuccessResponse<T> {
    status: 'success',
    data: T;
    timestamp: string; // ISO string format
}

export interface ErrorResponse {
    status: 'error';
    error: {
        code: number;
        message: string;
    };
    timestamp: string;
}