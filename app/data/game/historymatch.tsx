import { getProfileID } from '../../profile/profiledata'

export async function getHistoryMatchs(page: number = 1, limit: number = 10) {
    const userID = await getProfileID();
    const offset = (page - 1) * limit;
    const urlMatch = `https://api.opendota.com/api/players/${userID}/matches?significant=0&limit=${limit}&offset=${offset}&project=duration&project=game_mode&project=lobby_type&project=start_time&project=hero_id&project=version&project=kills&project=deaths&project=assists&project=leaver_status&project=party_size&project=average_rank&project=hero_variant&project=item_0&project=item_1&project=item_2&project=item_3&project=item_4&project=item_5`;
    
    // Get total matches count using the wl endpoint which gives us total games
    const wlUrl = `https://api.opendota.com/api/players/${userID}/wl`;
    const [matchesResponse, wlResponse] = await Promise.all([
        fetch(urlMatch),
        fetch(wlUrl)
    ]);

    const matches = await matchesResponse.json();
    const wlData = await wlResponse.json();
    const total = (wlData.win || 0) + (wlData.lose || 0); // Sum of wins and losses

    return {
        matches,
        total
    };
}
