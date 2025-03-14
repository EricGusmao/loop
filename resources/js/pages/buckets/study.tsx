import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Bucket, CardEntity } from '@/types';
import { Head } from '@inertiajs/react';
import clsx from 'clsx';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Study({ bucket, cards }: { bucket: Bucket; cards: CardEntity[] }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Buckets',
            href: '/buckets',
        },
        {
            title: bucket.title,
            href: `/buckets/${bucket.id}`,
        },
        {
            title: 'Study',
            href: `/buckets/${bucket.id}/study`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={bucket.title}></Head>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Study</h2>
                    </div>
                </div>
                <div className="p-4">{cards.length === 0 ? <p>No cards available</p> : <CardDeck cards={cards} />}</div>
            </div>
        </AppLayout>
    );
}

function CardDeck({ cards }: { cards: CardEntity[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const totalCards = cards.length;
    const currentCard = cards[currentIndex];

    const nextCard = () => {
        if (currentIndex < totalCards - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false); // Reset flip on new card
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false); // Reset flip on new card
        }
    };

    return (
        <div className="bg-card rotat flex h-100 min-h-full w-full flex-col items-center justify-center overflow-hidden p-6">
            <CardDisplay currentCard={currentCard} isFlipped={isFlipped} setIsFlipped={setIsFlipped} />
            <Progress value={((currentIndex + 1) / totalCards) * 100} className="mt-4 w-full max-w-lg" />
            <NavigationButtons currentIndex={currentIndex} totalCards={totalCards} nextCard={nextCard} prevCard={prevCard} />
            <CardCount currentIndex={currentIndex} totalCards={totalCards} />
        </div>
    );
}

function CardDisplay({
    currentCard,
    isFlipped,
    setIsFlipped,
}: {
    currentCard: CardEntity;
    isFlipped: boolean;
    setIsFlipped: (flipped: boolean) => void;
}) {
    return (
        <div className="mt-5 flex h-48 w-full max-w-lg items-center justify-center">
            <div
                className={clsx(
                    'relative h-full w-full cursor-pointer rounded-lg border text-xl shadow-lg transition-transform duration-500',
                    isFlipped ? 'rotate-y-180' : '',
                )}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div
                    className={clsx(
                        'absolute inset-0 flex h-full w-full items-center justify-center rounded-lg p-4 opacity-100 shadow-lg aria-hidden:opacity-0',
                        'rotate-y-0',
                    )}
                    aria-hidden={isFlipped ? 'true' : 'false'}
                >
                    <p className="font-bold">{currentCard?.front || 'No Cards Available'}</p>
                </div>

                <div
                    className={clsx(
                        'absolute inset-0 flex h-full w-full items-center justify-center rounded-lg p-4 opacity-100 shadow-lg aria-hidden:opacity-0',
                        'rotate-y-180',
                    )}
                    aria-hidden={isFlipped ? 'false' : 'true'}
                >
                    <p className="text-accent-foreground">{currentCard?.back || ''}</p>
                </div>
            </div>
        </div>
    );
}

function NavigationButtons({
    currentIndex,
    totalCards,
    nextCard,
    prevCard,
}: {
    currentIndex: number;
    totalCards: number;
    nextCard: () => void;
    prevCard: () => void;
}) {
    return (
        <div className="mt-4 flex items-end gap-4">
            <Button onClick={prevCard} disabled={currentIndex === 0} variant="outline">
                <ArrowLeft className="h-5 w-5" /> Prev
            </Button>
            <Button onClick={nextCard} disabled={currentIndex === totalCards - 1}>
                Next <ArrowRight className="h-5 w-5" />
            </Button>
        </div>
    );
}

function CardCount({ currentIndex, totalCards }: { currentIndex: number; totalCards: number }) {
    return (
        <p className="mt-2 text-sm text-gray-500">
            {currentIndex + 1} / {totalCards}
        </p>
    );
}
