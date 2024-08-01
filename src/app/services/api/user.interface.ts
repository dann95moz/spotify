export interface User {
    display_name:  string;
    external_urls: ExternalUrls;
    href:          string;
    id:            string;
    images:        any[];
    type:          string;
    uri:           string;
    followers:     Followers;
}

export interface ExternalUrls {
    spotify: string;
}

export interface Followers {
    href:  null;
    total: number;
}