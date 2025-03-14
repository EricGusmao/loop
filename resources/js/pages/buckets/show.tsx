import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Bucket, CardEntity } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, Pencil, Plus, Trash2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Show({ bucket }: { bucket: Bucket }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Buckets',
            href: '/buckets',
        },
        {
            title: bucket.title,
            href: `/buckets/${bucket.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={bucket.title}></Head>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Cards</h2>
                    </div>
                    <div className="mt-0 ml-4 flex">
                        <AddCard bucketId={bucket.id} />
                        <Link href={route('buckets.study', [bucket.id])} className="ml-2" prefetch>
                            <Button variant={'secondary'}>Study</Button>
                        </Link>
                    </div>
                </div>
                <div role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {bucket.cards.map((card) => (
                        <CardItem key={card.id} card={card} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}

function AddCard({ bucketId }: { bucketId: number }) {
    const [open, setOpen] = useState(false);
    const closeDrawer = () => setOpen(false);

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button>
                    <Plus />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Create Card</DrawerTitle>
                    </DrawerHeader>
                    <CardForm onSuccess={closeDrawer} bucketId={bucketId} />
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

function EditCard({ bucketId, card }: { bucketId: number; card: CardEntity }) {
    const [open, setOpen] = useState(false);
    const closeDrawer = () => setOpen(false);

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant={'secondary'} size={'icon'}>
                    <Pencil />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Edit Card</DrawerTitle>
                    </DrawerHeader>
                    <CardForm onSuccess={closeDrawer} bucketId={bucketId} card={card} />
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

function CardItem({ card }: { card: CardEntity }) {
    return (
        <Card className="col-span-1 divide-y" role="listitem">
            <CardHeader>
                <CardTitle>{card.front}</CardTitle>
                <CardDescription>{card.back}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end">
                <EditCard bucketId={card.bucket_id} card={card} />
                <Button className="ml-2" variant={'destructive'} size={'icon'} asChild>
                    <Link href={route('buckets.cards.destroy', [card.bucket_id, card.id])} method="delete">
                        <Trash2 />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

type CardForm = {
    front: string;
    back: string;
};

function CardForm({ onSuccess, card, bucketId }: { onSuccess?: () => void; card?: CardEntity; bucketId: number }) {
    const { data, setData, submit, processing, errors } = useForm<Required<CardForm>>({
        front: card?.front ?? '',
        back: card?.back ?? '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (card) {
            submit('put', route('buckets.cards.update', [card.bucket_id, card.id]), {
                onSuccess: onSuccess,
            });
            return;
        }
        submit('post', route('buckets.cards.store', [bucketId]), {
            onSuccess: onSuccess,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="grid items-start gap-4">
            <div className="grid gap-2">
                <Label htmlFor="front">Front</Label>
                <Input
                    id="front"
                    type="text"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="front"
                    value={data.front}
                    onChange={(e) => setData('front', e.target.value)}
                    placeholder="Card Front"
                />
                <InputError message={errors.front} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="back">Back</Label>
                <Input
                    id="back"
                    type="text"
                    required
                    autoFocus
                    tabIndex={2}
                    autoComplete="back"
                    value={data.back}
                    onChange={(e) => setData('back', e.target.value)}
                    placeholder="Card Back"
                />
                <InputError message={errors.back} />
            </div>

            <Button type="submit" disabled={processing} tabIndex={2}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {card ? 'Update' : 'Create'}
            </Button>
        </form>
    );
}
