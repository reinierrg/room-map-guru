// Respuesta estándar de la API
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// Error estándar
export interface ApiError {
    message: string;
    status: number;
    data?: unknown;
}

// Paginación
export interface PaginationParams {
    page?: number;
    pageSize?: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}