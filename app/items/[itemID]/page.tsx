"use client";
import { GetStaticPaths } from 'next';
import { useRouter } from 'next/navigation';
import fs from 'fs';
import path from 'path';

interface ItemDetail {
    id: string;
    name: string;
    description: string;
    // Add other fields as necessary
}

interface ItemPageProps {
    item: ItemDetail;
}

const ItemPage: React.FC<ItemPageProps> = ({ item }) => {
    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{item.name}</h1>
            <p>{item.description}</p>
            {/* Render other item details here */}
        </div>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const filePath = path.join(process.cwd(), '../../data/item/itemDetail.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const items: ItemDetail[] = JSON.parse(jsonData);

    const paths = items.map((item) => ({
        params: { itemID: item.id },
    }));

    return { paths, fallback: true };
};

export const generateStaticParams = async () => {
    const filePath = path.join(process.cwd(), '../../data/item/itemDetail.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const items: ItemDetail[] = JSON.parse(jsonData);

    return items.map((item) => ({
        itemID: item.id,
    }));
};

export const getItem = async (itemID: string) => {
    const filePath = path.join(process.cwd(), '../../data/item/itemDetail.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const items: ItemDetail[] = JSON.parse(jsonData);

    const item = items.find((item) => item.id === itemID);

    if (!item) {
        throw new Error('Item not found');
    }

    return item;
};

export const getStaticProps = async ({ params }: { params: { itemID: string } }) => {
    try {
        const item = await getItem(params.itemID);
        return {
            props: {
                item,
            },
        };
    } catch {
        return {
            notFound: true,
        };
    }
};

export default ItemPage;
