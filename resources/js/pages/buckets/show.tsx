import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Bucket, CardEntity } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, Pencil, Plus, Trash2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Show({ bucket }: { bucket: Bucket }) {
    const [open, setOpen] = useState(false);

    const closeDrawer = () => setOpen(false);

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
                                    <CardForm onSuccess={closeDrawer} bucketId={bucket.id} />
                                    <DrawerFooter>
                                        <DrawerClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DrawerClose>
                                    </DrawerFooter>
                                </div>
                            </DrawerContent>
                        </Drawer>
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

function CardItem({ card }: { card: CardEntity }) {
    return (
        <Card className="col-span-1 divide-y" role="listitem">
            <CardHeader>
                <CardTitle>{card.front}</CardTitle>
            </CardHeader>
            <CardFooter className="flex justify-end">
                <Button variant={'secondary'} size={'icon'}>
                    <Pencil />
                </Button>
                <Button className="ml-2" variant={'destructive'} size={'icon'} asChild>
                    <Link href={route('buckets.cards.destroy', [card.bucket_id, card.id])} method="delete">
                        <Trash2 />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

type CreateCardForm = {
    front: string;
    back: string;
};

function CardForm({ onSuccess, bucketId }: { onSuccess?: () => void; bucketId: number }) {
    const { data, setData, post, processing, errors } = useForm<Required<CreateCardForm>>({
        front: '',
        back: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('buckets.cards.store', [bucketId]), {
            onSuccess: onSuccess,
        });
    };

    return (
        <form onSubmit={submit} className="grid items-start gap-4">
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
                Create
            </Button>
        </form>
    );
}
