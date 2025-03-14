import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Bucket } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, Pencil, Plus, Trash2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Buckets',
        href: '/buckets',
    },
];

export default function Index({ buckets }: { buckets: Bucket[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buckets"></Head>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Buckets</h2>
                    </div>
                    <div className="mt-0 ml-4 flex">
                        <AddBucket />
                    </div>
                </div>
                <div role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {buckets.map((bucket) => (
                        <BucketItem key={bucket.id} bucket={bucket} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}

function AddBucket() {
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
                        <DrawerTitle>Create Bucket</DrawerTitle>
                    </DrawerHeader>
                    <BucketForm onSuccess={closeDrawer} />
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

function EditBucket({ bucket }: { bucket: Bucket }) {
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
                        <DrawerTitle>Edit Bucket</DrawerTitle>
                    </DrawerHeader>
                    <BucketForm onSuccess={closeDrawer} bucket={bucket} />
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

function BucketItem({ bucket }: { bucket: Bucket }) {
    return (
        <Card className="col-span-1 divide-y" role="listitem">
            <Link href={route('buckets.show', bucket.id)} className="col-span-1" role="listitem" prefetch>
                <CardHeader>
                    <CardTitle>{bucket.title}</CardTitle>
                    <CardDescription>{bucket.cards_count} cards</CardDescription>
                </CardHeader>
            </Link>
            <CardFooter className="flex justify-end">
                <EditBucket bucket={bucket} />
                <Button className="ml-2" variant={'destructive'} size={'icon'} asChild>
                    <Link href={route('buckets.destroy', bucket.id)} method="delete" only={['buckets']}>
                        <Trash2 />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

type BucketForm = {
    title: string;
};

function BucketForm({ onSuccess, bucket }: { onSuccess?: () => void; bucket?: Bucket }) {
    const { data, setData, submit, processing, errors } = useForm<Required<BucketForm>>({
        title: bucket?.title ?? '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (bucket) {
            submit('put', route('buckets.update', bucket.id), {
                onSuccess: onSuccess,
            });
            return;
        }
        submit('post', route('buckets.store'), {
            onSuccess: onSuccess,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="grid items-start gap-4">
            <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    type="text"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Bucket title"
                />
                <InputError message={errors.title} />
            </div>

            <Button type="submit" disabled={processing} tabIndex={2}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {bucket ? 'Update' : 'Create'}
            </Button>
        </form>
    );
}
