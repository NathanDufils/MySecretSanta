import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Wishlist } from '@/types';

interface AddItemDialogProps {
    wishlist: Wishlist;
}

export default function AddItemDialog({ wishlist }: AddItemDialogProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        url: '',
        description: ''
    });

    const submitItem = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/wishlists/${wishlist.id}/items`, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#D42426] text-white px-6 py-2 rounded-lg hover:bg-[#b01e20] text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 gap-2">
                    <Plus className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] bg-transparent dark:bg-transparent border-none shadow-none p-0 overflow-visible focus:outline-none">
                <div className="relative flex flex-col items-center">
                    {/* The Globe */}
                    <div className="relative w-full aspect-square rounded-full bg-gradient-to-b from-blue-50/50 to-white/40 dark:from-blue-900/30 dark:to-gray-800/40 backdrop-blur-md border-4 border-white/60 dark:border-gray-500/60 shadow-[0_0_50px_rgba(255,255,255,0.6)] dark:shadow-[0_0_50px_rgba(100,100,255,0.4)] flex flex-col items-center justify-center p-8 overflow-hidden z-10 text-center">
                        {/* Close Button */}
                        <DialogClose className="absolute top-4 text-white/80 hover:text-white transition-colors z-50 rounded-full p-2 bg-black/20 hover:bg-black/30">
                            <X className="w-6 h-6" />
                        </DialogClose>

                        {/* Internal Snow/Sparkle Effect */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-10 left-32 text-white/40 text-xs">❄</div>
                            <div className="absolute top-24 right-10 text-white/30 text-xl">❅</div>
                            <div className="absolute bottom-20 left-16 text-white/20 text-lg">❄</div>
                        </div>

                        <DialogHeader className="mb-2 text-center sm:text-center relative z-20 w-full flex flex-col items-center">
                            <DialogTitle className="font-christmas text-3xl text-white drop-shadow-md">Ajouter un Article</DialogTitle>
                            <DialogDescription className="text-white dark:text-gray-200 font-medium max-w-[90%] mx-auto text-xs">
                                Ajoutez un souhait à "{wishlist.title}".
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={submitItem} className="w-full relative z-20 flex flex-col items-center gap-3 overflow-y-auto max-h-[300px] px-2 hide-scrollbar">
                            <div className="w-full space-y-3">
                                <div className="space-y-1">
                                    <Label htmlFor="name" className="text-white font-bold drop-shadow-md text-sm">Nom</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="text-center bg-white/80 dark:bg-gray-700/80 border-white/50 focus:border-white focus:ring-white/50 placeholder:text-gray-500 text-[#391800] dark:text-white font-bold py-1 h-9"
                                        placeholder="Chaussettes..."
                                        required
                                    />
                                    {errors.name && <div className="text-center text-xs text-[#D42426] font-bold bg-white rounded-full px-2 py-0.5">{errors.name}</div>}
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="url" className="text-white font-bold drop-shadow-md text-sm">Lien</Label>
                                    <Input
                                        id="url"
                                        type="url"
                                        value={data.url}
                                        onChange={e => setData('url', e.target.value)}
                                        className="text-center bg-white/80 dark:bg-gray-700/80 border-white/50 focus:border-white focus:ring-white/50 placeholder:text-gray-500 text-[#391800] dark:text-white text-xs h-9"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="description" className="text-white font-bold drop-shadow-md text-sm">Détails</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="bg-white/80 dark:bg-gray-700/80 border-white/50 focus:border-white focus:ring-white/50 placeholder:text-gray-500 text-[#391800] dark:text-white text-xs min-h-[60px] resize-none text-center"
                                        placeholder="Taille, couleur..."
                                    />
                                </div>
                            </div>

                            <DialogFooter className="mt-2 w-full justify-center sm:justify-center">
                                <Button type="submit" disabled={processing} className="bg-[#D42426] hover:bg-[#b01e20] text-white rounded-full px-8 py-2 text-base shadow-lg hover:scale-105 transition-transform dark:bg-red-700 dark:hover:bg-red-600 border-2 border-white/20 w-full sm:w-auto">
                                    Ajouter
                                </Button>
                            </DialogFooter>
                        </form>
                    </div>

                    {/* The Base */}
                    <div className="w-[70%] h-20 bg-gradient-to-r from-[#8C1819] via-[#D42426] to-[#8C1819] dark:from-red-900 dark:via-red-700 dark:to-red-900 rounded-b-[2.5rem] -mt-10 pt-12 relative z-0 border-x-4 border-b-4 border-[#391800]/20 dark:border-gray-900/40 shadow-2xl flex items-end justify-center pb-3">
                        <div className="text-[#F8B803] dark:text-yellow-300 font-christmas text-lg opacity-80">Ho Ho Ho !</div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
