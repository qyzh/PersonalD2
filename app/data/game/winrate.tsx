import { getProfileID } from '@/app/profile/profiledata';
import { fetchWithRateLimit } from '../../utils/api';

type Winrate = {
    win: number;
    lose: number;
}

// Create a resource wrapper
function wrapPromise<T>(promise: Promise<T>) {
    let status = 'pending';
    let result: T;
    let error: Error;
    
    const suspender = promise.then(
        (r) => {
            status = 'success';
            result = r;
        },
        (e) => {
            status = 'error';
            error = e;
        }
    );

    return {
        read() {
            if (status === 'pending') {
                throw suspender;
            } else if (status === 'error') {
                throw error;
            } else {
                return result;
            }
        }
    };
}

// Add API key to your requests
const API_KEY = process.env.NEXT_PUBLIC_OPENDOTA_API_KEY;

export function fetchWinrate() {
    const promise = getProfileID()
        .then(async userID => {
            const url = `https://api.opendota.com/api/players/${userID}/wl`;
            const cacheKey = `winrate_${userID}`;
            return fetchWithRateLimit<Winrate>(url, cacheKey);
        });
    return wrapPromise<Winrate>(promise);
}
