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
import { ErrorBoundary } from './component/ErrorBoundary';
import { Icon } from './public/svg/icon';

interface DashboardCardProps {
    title: string;
    description: string;
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
    title,
    description,
    children,
    className = '',
    icon
}) => (
    <Card className={className}>
        <CardHeader>
            <div className="flex items-center gap-2">
                {icon && <span className="text-muted-foreground">{icon}</span>}
                <CardTitle>{title}</CardTitle>
            </div>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
);

const SuspenseWrapper: React.FC<{
    fallback: React.ReactNode;
    children: React.ReactNode;
}> = ({ fallback, children }) => (
    <ErrorBoundary>
        <Suspense fallback={fallback}>
            {children}
        </Suspense>
    </ErrorBoundary>
);

const userName = await getProfileUserName();

export default function Home() {
    return (
        <div className="flex h-screen">
            <div className='flex flex-col min-w-[49px]'>
                <NavSide />
            </div>
            <main className="flex flex-1 flex-col">
                <Breadcrumb />
                <div className='mx-auto container px-6 py-6'>
                    <SHeader
                        header={`Hi, ${userName}`}
                        desc="Welcome to your dashboard"
                    />
                    <div className="grid lg:grid-cols-3 lg:grid-rows-1 gap-2">
                        <DashboardCard
                            title="Win Rate"
                            description="Your current win rate statistics"
                            icon={
                            <Icon name='stats' size={20} className='w-6 h-6 fill-current' />
                            }
                        >
                            <SuspenseWrapper fallback={<FBWinrate />}>
                                 <Winrate />
                            </SuspenseWrapper>
                        </DashboardCard>

                        <DashboardCard
                            title="Recent Game"
                            description="Latest Game"
                            icon={
                                <Icon name='recent' size={20} className='w-6 h-6 fill-current' />
                            }
                        >
                            <SuspenseWrapper fallback={<FBrecentgame />}>
                               <RecentMatch />
                            </SuspenseWrapper>
                        </DashboardCard>

                        <DashboardCard
                            title="History Match"
                            description="History of ur Journey"
                            className="row-span-2"
                            icon={
                               <Icon name='loghis' size={20} className='w-6 h-6 fill-current' />
                            }
                        >
                            <SuspenseWrapper fallback={<FBhistorygame />}>
                               <HistoryMatch />
                            </SuspenseWrapper>
                        </DashboardCard>

                        <DashboardCard
                            title="Best Hero"
                            description="Your best 6 heros"
                            className="lg:col-span-2"
                            icon={
                                <Icon name='fav' size={20} className='w-6 h-6 fill-amber-500' />
                            }

                        >
                            <SuspenseWrapper fallback={<FBbesthero />}>
                             <Herofav />
                            </SuspenseWrapper>
                        </DashboardCard>
                    </div>
                </div>
                <Footer />
            </main>
        </div>
    );
}
