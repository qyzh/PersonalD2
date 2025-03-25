import { cache } from './cache';
import { rateLimiter } from './rateLimiter';

const API_KEY = process.env.NEXT_PUBLIC_OPENDOTA_API_KEY;

export async function fetchWithRateLimit<T>(
    url: string,
    cacheKey: string,
    options: RequestInit = {}
): Promise<T> {
    // Check cache first
    const cachedData = cache.get<T>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    // Check rate limit before making the request
    await rateLimiter.checkLimit();

    // Add API key if available
    const urlWithKey = API_KEY ? 
        `${url}${url.includes('?') ? '&' : '?'}api_key=${API_KEY}` : 
        url;

    const response = await fetch(urlWithKey, options);
    
    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Cache the result
    cache.set(cacheKey, data);

    return data;
} 