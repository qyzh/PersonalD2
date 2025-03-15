import { getProfileID } from '@/app/profile/profiledata';
type winrate = {
    win: number;
    lose: number;
}
const userID = await getProfileID();
export async function getWinrate() {
    const winrateData = await fetch(`https://api.opendota.com/api/players/${userID}/wl?`);
    const WinRate: winrate = await winrateData.json();
    console.log(WinRate);
    return WinRate;
}
