type Profile = {
    profile: {
        account_id: number;
        personaname: string;
        name: string;
        plus: boolean;
        cheese: number;
        steamid: string;
        avatar: string;
        avatarmedium: string;
        avatarfull: string;
        profileurl: string;
        last_login: string;
        loccountrycode: string;
        is_contributor: boolean;
    };
    // add other properties if needed
};

// Cache implementation
interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

class Cache {
    private static instance: Cache;
    private cache: Map<string, CacheEntry<any>>;
    private readonly TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
    private readonly RATE_LIMIT = 60; // requests per minute
    private requestTimestamps: number[];

    private constructor() {
        this.cache = new Map();
        this.requestTimestamps = [];
    }

    public static getInstance(): Cache {
        if (!Cache.instance) {
            Cache.instance = new Cache();
        }
        return Cache.instance;
    }

    private isRateLimited(): boolean {
        const now = Date.now();
        // Remove timestamps older than 1 minute
        this.requestTimestamps = this.requestTimestamps.filter(
            timestamp => now - timestamp < 60000
        );

        if (this.requestTimestamps.length >= this.RATE_LIMIT) {
            return true;
        }

        this.requestTimestamps.push(now);
        return false;
    }

    public async get<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
        const now = Date.now();
        const cached = this.cache.get(key);

        if (cached && now - cached.timestamp < this.TTL) {
            return cached.data;
        }

        if (this.isRateLimited()) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }

        const data = await fetchFn();
        this.cache.set(key, { data, timestamp: now });
        return data;
    }

    public clear(): void {
        this.cache.clear();
        this.requestTimestamps = [];
    }
}

const cache = Cache.getInstance();

export async function getProfileData() {
    const cacheKey = 'profile_data';
    return cache.get(cacheKey, async () => {
        const ProfileData = await fetch('https://api.opendota.com/api/players/152850421');
        if (!ProfileData.ok) {
            throw new Error(`Failed to fetch profile data: ${ProfileData.statusText}`);
        }
        return ProfileData.json();
    });
}

export async function getProfileID() {
    const data_id = await getProfileData();
    return data_id.profile.account_id;
}

export async function getProfileUserName() {
    const data_username = await getProfileData();
    return data_username.profile.personaname;
}

// Optional: Add a function to clear cache if needed
export function clearProfileCache() {
    cache.clear();
}

    // return (
    //     <ul>
    //         <li>Account ID: {res.profile.account_id}</li>
    //         <li>Persona Name: {res.profile.personaname}</li>
    //         <li>Name: {res.profile.name}</li>
    //         <li>Plus: {res.profile.plus ? 'Yes' : 'No'}</li>
    //         <li>Cheese: {res.profile.cheese}</li>
    //         <li>Steam ID: {res.profile.steamid}</li>
    //         <li>Avatar: <img src={res.profile.avatar} alt="avatar" /></li>
    //         <li>Avatar Medium: <img src={res.profile.avatarmedium} alt="avatar medium" /></li>
    //         <li>Avatar Full: <img src={res.profile.avatarfull} alt="avatar full" /></li>
    //         <li>Profile URL: <a href={res.profile.profileurl}>{res.profile.profileurl}</a></li>
    //         <li>Last Login: {res.profile.last_login}</li>
    //         <li>Country Code: {res.profile.loccountrycode}</li>
    //         <li>Contributor: {res.profile.is_contributor ? 'Yes' : 'No'}</li>
    //     </ul>
    // )
