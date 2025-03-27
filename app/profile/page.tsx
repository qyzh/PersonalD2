import SHeader from '../component/sheader';
import Breadcrumb from '../component/breadcrumb';
import { NavSide } from '../component/sidemenu';
import { getProfileData } from './profiledata';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../component/ui/Card';
import { Badge } from '../component/ui/Badge';
import { Separator } from '../component/ui/Separator';
import { Globe, User, Calendar, Shield, Link as LinkIcon } from 'lucide-react';

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
                    <SHeader header="Profile" desc="Your Dota 2 profile information" />

                    <div className="grid gap-6">
                        {/* Profile Header Card */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <img
                                            alt={Data.profile.personaname}
                                            src={Data.profile.avatarfull}
                                            className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                                        />
                                        {Data.profile.plus && (
                                            <Badge className="absolute -bottom-2 -right-2 bg-primary">
                                                Dota Plus
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold">{Data.profile.personaname}</h2>
                                        <p className="text-muted-foreground">{Data.profile.name}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Globe className="w-4 h-4" />
                                            <span className="text-sm">{Data.profile.loccountrycode || 'Unknown Location'}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Profile Details Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Details</CardTitle>
                                <CardDescription>Your Steam and Dota 2 account information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="w-4 h-4" />
                                            <span>Account ID</span>
                                        </div>
                                        <p className="font-mono">{Data.profile.account_id}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Shield className="w-4 h-4" />
                                            <span>Steam ID</span>
                                        </div>
                                        <p className="font-mono">{Data.profile.steamid}</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        <span>Last Login</span>
                                    </div>
                                    <p>{new Date(Data.profile.last_login).toLocaleString()}</p>
                                </div>
                                <Separator />
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <LinkIcon className="w-4 h-4" />
                                        <span>Profile URL</span>
                                    </div>
                                    <a 
                                        href={Data.profile.profileurl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        {Data.profile.profileurl}
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
