export default async function getHeroData() {
    const data = await fetch('https://api.opendota.com/api/heroStats')
    const heroData = await data.json()
    return heroData;
  }
