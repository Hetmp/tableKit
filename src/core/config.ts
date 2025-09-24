export interface TableKitConfig {
    mode: EditMode;
    editable: boolean;
    columns: TableKitColumnConfig[];
    id: string; // Primary key field name
    ajax?: TableKitAjaxConfig;
    sync?: boolean;    
    provider?: TableKitProvider;      // Optional per-instance override
    validation?: TableKitValidation;  // Optional per-instance override
}

export type EditMode = 'cell' | 'row' | 'popup';
export type TableKitProvider = 'jquery' | 'angular' | 'vanilla';
export type TableKitValidation = 'jquery' | 'unobtrusive' | 'none';

export interface TableKitGlobalConfig {
    provider?: TableKitProvider;
    validation?: TableKitValidation;
    // Add more global options as needed
}

// This can be set once in your app:
export let tableKitGlobalConfig: TableKitGlobalConfig = {};

// Helper to set global config
export function setTableKitGlobalConfig(config: TableKitGlobalConfig) {
    tableKitGlobalConfig = { ...tableKitGlobalConfig, ...config };
}

export interface TableKitColumnConfig {
    name: string;
    editable?: boolean;
    type: 'text' | 'number' | 'select' | 'date' | 'custom';
    template?: string | HTMLElement;
    validate: boolean;
}

export interface TableKitAjaxOperation {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: Record<string, string>;
    // You can add more options as needed, e.g., credentials, body, etc.
}

export interface TableKitAjaxConfig {
    create?: string | TableKitAjaxOperation;
    read?: string | TableKitAjaxOperation;
    update?: string | TableKitAjaxOperation;
    delete?: string | TableKitAjaxOperation;
}