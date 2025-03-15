import { getProfileID } from '../../profile/profiledata'
const userID = await getProfileID();
const urlMatch = `https://api.opendota.com/api/players/${userID}/matches?significant=0&project=duration&project=game_mode&project=lobby_type&project=start_time&project=hero_id&project=version&project=kills&project=deaths&project=assists&project=leaver_status&project=party_size&project=average_rank&project=hero_variant&project=item_0&project=item_1&project=item_2&project=item_3&project=item_4&project=item_5`;

export async function getHistoryMatchs() {
    const data = await fetch(`${urlMatch}`)
    const game_match = await data.json();
    return game_match;
}
