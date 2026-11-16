import { mapCountryResponse } from './mapper.js';
export class HttpError extends Error {
    status;
    constructor(status, message) {
        super(message ?? `HTTP Error: ${status}`);
        this.name = 'HttpError';
        this.status = status;
    }
}
export async function searchCountries(query, signal, timeoutMs = 5000) {
    const timeoutSignal = AbortSignal.timeout(timeoutMs);
    const combinedSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;
    const encoded = encodeURIComponent(query.trim());
    const url = ['https://countries.dev', 'name', encoded].join('/');
    const response = await fetch(url, { signal: combinedSignal });
    if (response.status === 404) {
        return [];
    }
    if (!response.ok) {
        throw new HttpError(response.status);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
        return [];
    }
    return data.map(mapCountryResponse);
}
