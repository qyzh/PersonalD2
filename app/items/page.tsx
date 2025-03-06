
import {ItemList} from '../data/item/item';
import {NavSide} from '../component/sidemenu';
import Breadcrumb from '../component/breadcrumb';
import SHeader from '../component/sheader';
import Footer from '../component/footer';

export default function IndexItem() {

    return (
        <div className="flex h-screen ">
        <div className='flex flex-col min-w-[49px] '>
     <NavSide />
        </div>
      <main className="flex flex-1 flex-col">
      <Breadcrumb />
      <div className='mx-auto container px-6 py-6'>
<SHeader header="Items" desc="This all of item in Dota 2" />
<ItemList />
        </div>
        <Footer/>
      </main>
    </div>
    );
};
