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
export async function getProfileData() {
    const ProfileData = await fetch('https://api.opendota.com/api/players/152850421')
    const Dataprofile: Profile = await ProfileData.json()
    return Dataprofile;
}
export async function getProfileID() {
    const data_id: Profile = await getProfileData();
    const userID = data_id.profile.account_id;
    return userID;
}
export async function getProfileUserName() {
    const data_username: Profile = await getProfileData();
    const userName = data_username.profile.personaname;
    return userName;
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
