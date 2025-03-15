"use client";
import React, { Suspense } from 'react';
import { NavSide } from './component/sidemenu';
import Breadcrumb from './component/breadcrumb';
import RecentMatch from './component/RecentMatchs';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from './component/SDCard';
import SHeader from './component/sheader';
import Winrate from './component/winrate';
import Herofav from './component/herofav';
import HistoryMatch from './component/HistoryMatchs';
import FBWinrate from './suspend/FBwinrate';
import FBrecentgame from './suspend/FBrecentgame';
import FBhistorygame from './suspend/FBhistory';
import FBbesthero from './suspend/FBbesthero';
import Footer from './component/footer';
import { getProfileUserName } from './profile/profiledata';

const userName = await getProfileUserName();
export default function Home() {
  return (
    <div className="flex h-screen ">
        <div className='flex flex-col min-w-[49px] '>
     <NavSide />
        </div>
      <main className="flex flex-1 flex-col">
      <Breadcrumb />
      <div className='mx-auto container px-6 py-6'>
<SHeader header={`Hi, ${userName}`}  desc="Welcome to your dashboard" />
        <div className="grid lg:grid-cols-3 lg:grid-rows-1 gap-2">
            <div>
                    <Suspense fallback={<FBWinrate />}>
                        <Winrate />
                    </Suspense>
            </div>
            <div>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Game</CardTitle>
                    <CardDescription>Lastest Game</CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<FBrecentgame />}>
                        <RecentMatch/>
                    </Suspense>
                </CardContent>
            </Card>
            </div>
            <div className="row-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>History Match</CardTitle>
                    <CardDescription>History of ur Journey</CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<FBhistorygame />}>
                        <HistoryMatch />
                    </Suspense>
                </CardContent>
            </Card>
            </div>
            <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Best Hero</CardTitle>
                    <CardDescription>Your best 6 heros</CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<FBbesthero />}>
                        <Herofav />
                    </Suspense>
                </CardContent>
            </Card>
            </div>
        </div>
        </div>
        <Footer/>
      </main>
    </div>
  );
}
