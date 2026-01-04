import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';

import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react'; // Added Link
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Gift } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord Santa',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        // Using hardcoded path since Ziggy/Wayfinder setup is uncertain
        post('/groups/join');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tableau de bord" />
            <div className="flex flex-1 flex-col gap-8 p-8">

                {/* Hero / Welcome Section */}
                <div className="rounded-3xl bg-gradient-to-br from-[#D42426] to-[#8C1819] p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-4xl font-bold mb-4 font-christmas">Ho Ho Ho ! Bienvenue 🎅</h1>
                        <p className="text-red-100 max-w-xl text-lg mb-8">
                            Prêt à organiser le meilleur Secret Santa ? Rejoignez un groupe existant ou créez le vôtre pour commencer les festivités !
                        </p>

                        <div className="flex flex-wrap gap-4">
                            {/* Join Group Form */}
                            <form onSubmit={handleJoin} className="flex items-end gap-2 bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="code" className="text-xs font-semibold text-white/80 ml-1">Code du Groupe</Label>
                                    <Input
                                        id="code"
                                        placeholder="EX: A1B2C3"
                                        className="bg-white/90 border-0 text-black placeholder:text-gray-400 w-32 uppercase font-mono font-bold"
                                        value={data.code}
                                        onChange={e => setData('code', e.target.value)}
                                        maxLength={6}
                                    />
                                </div>
                                <Button type="submit" disabled={processing} className="bg-[#165B33] hover:bg-[#124d2b] text-white shadow-lg">
                                    Rejoindre
                                </Button>
                            </form>

                            {/* Create Group Button (Redirects to a create page or modal - simplified here as just a visual cue or action) */}
                            {/* Note: The user didn't explicitly ask for Create Group UI here, but it's good UX. 
                                Since I don't have a create page ready, I'll assume there's a modal or separate flow. 
                                For now, I'll leave the Join form as the main addition requested. */}
                        </div>
                        {errors.code && <p className="mt-2 text-sm font-bold text-[#F8B803]">{errors.code}</p>}
                    </div>

                    {/* Decor */}
                    <div className="absolute right-0 bottom-0 text-9xl opacity-10 pointer-events-none">🎄</div>
                </div>

                {/* Quick Stats / Info */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6 flex flex-col justify-end bg-gradient-to-t from-orange-50 to-white">
                        <Users className="w-10 h-10 text-orange-500 mb-2 opacity-80" />
                        <h3 className="text-xl font-bold text-gray-800">Mes Groupes</h3>
                        <p className="text-gray-500 mb-4">Gérez vos événements.</p>
                        {/* Ideally link to a list of groups */}
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6 flex flex-col justify-end bg-gradient-to-t from-blue-50 to-white">
                        <Gift className="w-10 h-10 text-blue-500 mb-2 opacity-80" />
                        <h3 className="text-xl font-bold text-gray-800">Ma Wishlist</h3>
                        <p className="text-gray-500 mb-4">Ajoutez vos souhaits.</p>
                        <Link href="/wishlists" className="text-sm font-semibold text-blue-600 hover:underline">Gérer ma liste →</Link>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
