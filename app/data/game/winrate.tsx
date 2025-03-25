import { getProfileID } from '@/app/profile/profiledata';

type Winrate = {
    win: number;
    lose: number;
}

// Create a resource wrapper
function wrapPromise<T>(promise: Promise<T>) {
    let status = 'pending';
    let result: T;
    let error: any;
    
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

export function fetchWinrate() {
    const promise = getProfileID()
        .then(userID => 
            fetch(`https://api.opendota.com/api/players/${userID}/wl?`)
                .then(res => res.json())
        );
    return wrapPromise<Winrate>(promise);
}
