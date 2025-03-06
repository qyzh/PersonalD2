// import React, { Suspense } from "react";
import Breadcrumb from "../component/breadcrumb";
import { NavSide } from "../component/sidemenu";
// import DataHistory from "../component/datahistory";
import SHeader from "../component/sheader";
 import FBdatamatch from "../suspend/FBdatamatch";
import Footer from "../component/footer";
// import { DataChart } from "../data/DrankChart";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/app/component/ui/Table"
import DataHistory from "../component/datahistory";


export default function page() {
  return (
        <div className="flex h-screen ">
        <div className='flex flex-col min-w-[49px]'>
     <NavSide />
        </div>
      <main className="flex flex-1 flex-col">
      <Breadcrumb />
      <div className='mx-auto container px-6 py-6'>
                <SHeader header="History" desc="Your match history" />
            <div className="flex">
                <DataHistory />
            </div>
        </div>
        <Footer />
        </main>
    </div>
  );
}
