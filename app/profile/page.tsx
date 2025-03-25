import SHeader from '../component/sheader';
import Breadcrumb from '../component/breadcrumb';
import { NavSide } from '../component/sidemenu';
import { getProfileData } from './profiledata';

const Data = await getProfileData();

export default function Profile() {
    return (
        <div className="flex h-screen">
            <div className="flex flex-col min-w-[49px]">
                <NavSide />
            </div>
            <main className="flex flex-1 flex-col">
                <Breadcrumb />

                <div className="mx-auto container px-6 py-6">
                    <SHeader header="profile" desc="" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-stretch gap-4">
                            <img
                                alt=""
                                src={Data.profile.avatarfull}
                                className="w-20 rounded object-cover"
                            />

                            <div>
                                <h3 className="font-medium text-gray-900 sm:text-lg">{Data.profile.personaname}</h3>

                                <p className="mt-0.5 text-gray-700">
                                     {Data.profile.name}  {Data.profile.loccountrycode}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-md">
                        <p className="font-mono text-sm whitespace-pre-wrap">
                            Account ID: {Data.profile.account_id} <br />
                            Persona Name: {Data.profile.personaname} <br />
                            Name: {Data.profile.name} <br />
                            Dota Plus: {Data.profile.plus ? 'Yes' : 'No'} <br />
                            Steam ID: {Data.profile.steamid} <br />
                            Avatar: {Data.profile.avatar} <br />
                            Avatar Medium: {Data.profile.avatarmedium} <br />
                            Avatar Full: {Data.profile.avatarfull} <br />
                            Profile URL: {Data.profile.profileurl} <br />
                            Last Login: {Data.profile.last_login} <br />
                            Country Code: {Data.profile.loccountrycode} <br />
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
