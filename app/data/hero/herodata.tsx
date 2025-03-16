export async function getHeroData() {
    const data = await fetch('https://api.opendota.com/api/heroStats');
    const heroData = await data.json();
    return heroData;
  }
type HeroName = {
    id: number;
    localized_name: string;
    primary_attr: string;
    attack_type: string;
    img: string;
    roles: string[];
}[];
export async function getHeroNames() {
                const heroNameResponse = await getHeroData();
                const heroNameData: HeroName = await heroNameResponse;

                const heroNameMap = new Map<number, { name: string; img: string }>();
                heroNameData.forEach((hero) => {
                    heroNameMap.set(hero.id, { name: hero.localized_name, img: hero.img });
                });
                return heroNameMap;
            }
