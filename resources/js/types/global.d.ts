import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { AxiosInstance } from 'axios';

declare global {
    interface Window {
        axios: AxiosInstance;
        route: (name: string, params?: Record<string, unknown> | string | number, absolute?: boolean, config?: unknown) => string;
    }


    var route: (name: string, params?: Record<string, unknown> | string | number, absolute?: boolean, config?: unknown) => string;
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps { }
}

declare module '@inertiajs/react' {
    interface PageProps extends InertiaPageProps, AppPageProps { }
}
