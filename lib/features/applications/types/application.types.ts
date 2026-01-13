export interface Application {
    id: string;
    name: string;
    slug: string;
    description?: string;
    created_at: string;
}

export interface ApplicationListResponse {
    results: Application[];
    count: number;
    next: string | null;
    previous: string | null;
}

export interface ApplicationListParams {
    page?: number;
    page_size?: number;
    search?: string;
}

export interface CreateApplicationData {
    name: string;
    description: string;
}
