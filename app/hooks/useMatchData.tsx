import { useEffect, useState } from "react";
import dataitem from '@/app/data/item/item_ID.json';
import itemDetails from '@/app/data/item/itemDetail.json';
import { DataMatch, HeroInfo, ItemInfo } from "../types/match";

export function useMatchData(matchId: string) {
  const [data, setData] = useState<DataMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroNameMap, setHeroNameMap] = useState<Map<number, HeroInfo>>(new Map());
  const [itemNameMap, setItemNameMap] = useState<Map<number, ItemInfo>>(new Map());

  useEffect(() => {
    async function fetchData() {
      if (!matchId) return;

      try {
        setLoading(true);

        // Process hero data
        const heroNameMap = new Map<number, HeroInfo>();

        try {
          // Fetch hero names
          const heroNameResponse = await fetch(`https://dummyjson.com/c/be13-4e90-42b4-90b1`);
          if (!heroNameResponse.ok) throw new Error('Failed to fetch hero names');
          const heroNameData = await heroNameResponse.json();
          if (!Array.isArray(heroNameData)) throw new Error('Invalid hero data format');

          heroNameData.forEach((hero) => {
            if (hero?.id && hero.localized_name && hero.img) {
              heroNameMap.set(hero.id, {
                name: hero.localized_name,
                img: hero.img
              });
            }
          });

          setHeroNameMap(heroNameMap);
        } catch (error) {
          console.error("Error fetching hero data:", error);
        }

        // Process item data
        const itemNameMap = new Map<number, ItemInfo>();
        Object.entries(dataitem).forEach(([key, value]) => {
          const id = typeof value === "number" ? value : parseInt(key);
          if (id === 0) return;

          const name = typeof value === 'string' ? value : `Item ${key}`;
          const itemDetail = Object.values(itemDetails).find(
            (item) => parseInt(item.id.toString()) === id
          );

          if (itemDetail?.img) {
            itemNameMap.set(id, {
              id,
              name,
              img: itemDetail.img
            });
          }
        });

        setItemNameMap(itemNameMap);

        // Get match data
        try {
          const response = await fetch(`https://api.opendota.com/api/matches/${matchId}?significant=0&project=duration&project=game_mode&project=lobby_type&project=start_time&project=hero_id&project=version&project=kills&project=deaths&project=assists&project=leaver_status&project=party_size&project=average_rank&project=hero_variant&project=item_0&project=item_1&project=item_2&project=item_3&project=item_4&project=item_5`);

          if (!response.ok) {
            throw new Error(`Failed to fetch match data: ${response.status}`);
          }

          const matchData = await response.json();

          if (!matchData) {
            throw new Error(`Match not found: ${matchId}`);
          }

          setData(matchData);
        } catch (fetchError) {
          console.error("Error fetching match data:", fetchError);
          setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch match data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [matchId]);

  return { data, loading, error, heroNameMap, itemNameMap };
}
