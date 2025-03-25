class RateLimiter {
    private static instance: RateLimiter;
    private timestamps: number[];
    private readonly windowMs: number;
    private readonly maxRequests: number;

    private constructor() {
        this.timestamps = [];
        // Default: 60 requests per minute for non-API key users
        // With API key, we'll allow more requests but still maintain a safe limit
        this.windowMs = 60 * 1000; // 1 minute window
        this.maxRequests = process.env.NEXT_PUBLIC_OPENDOTA_API_KEY ? 120 : 60;
    }

    public static getInstance(): RateLimiter {
        if (!RateLimiter.instance) {
            RateLimiter.instance = new RateLimiter();
        }
        return RateLimiter.instance;
    }

    public async checkLimit(): Promise<void> {
        const now = Date.now();
        
        // Remove timestamps outside the window
        this.timestamps = this.timestamps.filter(
            timestamp => now - timestamp < this.windowMs
        );

        if (this.timestamps.length >= this.maxRequests) {
            const oldestTimestamp = this.timestamps[0];
            const waitTime = this.windowMs - (now - oldestTimestamp);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return this.checkLimit(); // Recheck after waiting
        }

        this.timestamps.push(now);
    }
}

export const rateLimiter = RateLimiter.getInstance(); 