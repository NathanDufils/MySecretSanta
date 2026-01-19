import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

// ============================================
// Auth & Navigation Types
// ============================================

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

// ============================================
// Domain Types - Secret Santa
// ============================================

export type GroupStatus = 'open' | 'drawn';

export interface Group {
    id: number;
    name: string;
    description: string | null;
    event_date: string;
    max_budget?: number | null;
    admin_id: number;
    status: GroupStatus;
    code: string;
    admin?: User;
    created_at?: string;
    updated_at?: string;
}

export interface WishlistItem {
    id: number;
    name: string;
    url?: string | null;
    description?: string | null;
    wishlist_id?: number;
}

export interface Wishlist {
    id: number;
    title: string;
    user_id?: number;
    items: WishlistItem[];
}

export interface Participant extends User {
    assigned_wishlist?: Wishlist | null;
    pivot?: {
        wishlist_id?: number | null;
    };
}

export interface Draw {
    id?: number;
    group_id: number;
    santa_id: number;
    target_id: number;
    target?: User;
}

export interface Invitation {
    id: number;
    group_id: number;
    email: string;
    token?: string;
    group: Group;
}
