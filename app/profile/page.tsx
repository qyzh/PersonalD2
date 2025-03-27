import SHeader from '../component/sheader';
import Breadcrumb from '../component/breadcrumb';
import { NavSide } from '../component/sidemenu';
import { getProfileData } from './profiledata';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../component/ui/Card';
import { Badge } from '../component/ui/Badge';
import { Separator } from '../component/ui/Separator';
import { Globe, User, Calendar, Shield, Link as LinkIcon, Clock, Trophy, GamepadIcon, History } from 'lucide-react';
import { fetchWinrate } from '../data/game/winrate';
import { getHistoryMatchs } from '../data/game/historymatch';
const Data = await getProfileData();
const datamatches = await fetchWinrate();
const matches = await getHistoryMatchs();
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

                        {/* Game Statistics Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Game Statistics</CardTitle>
                                <CardDescription>Your Dota 2 gameplay information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Trophy className="w-4 h-4" />
                                            <span>Current Rank</span>
                                        </div>
                                        <p className="flex items-center gap-2">
                                            <div className="relative flex items-center justify-center w-12 h-12">
                                                <img 
                                                    src={`https://www.opendota.com/assets/images/dota2/rank_icons/rank_icon_${Math.floor(Data.rank_tier / 10)}.png`} 
                                                    alt="Rank" 
                                                    className="w-8 h-8"
                                                />
                                                <div className="absolute top-0 left-0 right-0 flex justify-center">
                                                    {[...Array(Data.rank_tier % 10)].map((_, i) => (
                                                        <span key={i} className="text-white text-xs">★</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            <span>Total Playtime</span>
                                        </div>
                                        <p>{Math.floor(Data.playtime_hours)} hours</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <GamepadIcon className="w-4 h-4" />
                                            <span>Total Matches</span>
                                        </div>
                                        <p>{(datamatches.read().win || 0) + (datamatches.read().lose || 0)} Matches</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <History className="w-4 h-4" />
                                            <span>First Match</span>
                                        </div>
                                        <p>{new Date(Data.first_match_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
