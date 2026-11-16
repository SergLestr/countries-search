export interface RawCountry {
  name?: string | { common?: string; official?: string };
  officialName?: string;
  flag?: string;
  flags?: { svg?: string; png?: string };
  capital?: string | string[];
  region?: string;
  population?: number;
  area?: number;
  borders?: string[];
  languages?: Array<{ name?: string; code?: string }> | Record<string, string>;
  currencies?:
    | Array<{ code?: string; name?: string; symbol?: string }>
    | Record<string, { name?: string; symbol?: string }>;
}

export interface Country {
  name: string;
  officialName: string;
  flagUrl: string;
  flagEmoji: string;
  capital: string;
  region: string;
  population: number;
  area: number;
  borders: string[];
  languages: string[];
  currencies: string[];
}

export type AppState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; countries: Country[] }
  | { status: 'empty'; query: string }
  | { status: 'error'; message: string };
