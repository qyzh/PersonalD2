import { getProfileID } from '@/app/profile/profiledata';
const userID = await getProfileID();
export async function getHeroStat() {
    const data = await fetch(`https://api.opendota.com/api/players/${userID}/heroes`)
    const herostats = await data.json()
    return herostats;
  }
