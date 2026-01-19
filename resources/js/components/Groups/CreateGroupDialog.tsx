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
import { Plus, X } from 'lucide-react';
import { useForm } from '@inertiajs/react';

interface CreateGroupDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateGroupDialog({ open, onOpenChange }: CreateGroupDialogProps) {
    const createForm = useForm({
        name: '',
    });

    const createGroup = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/groups', {
            onSuccess: () => {
                onOpenChange(false);
                createForm.reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="rounded-full bg-[#F8B803] px-8 py-6 text-lg font-bold text-[#391800] hover:bg-[#e0a602] shadow-lg gap-1 dark:bg-yellow-600 dark:text-white dark:hover:bg-yellow-700">
                    <Plus className="h-6 w-6" strokeWidth={3} /> Créer un Groupe
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] bg-transparent dark:bg-transparent border-none shadow-none p-0 overflow-visible focus:outline-none">
                <div className="relative flex flex-col items-center">
                    {/* The Globe */}
                    <div className="relative w-full aspect-square rounded-full bg-gradient-to-b from-blue-50/50 to-white/40 dark:from-blue-900/30 dark:to-gray-800/40 backdrop-blur-md border-4 border-white/60 dark:border-gray-500/60 shadow-[0_0_50px_rgba(255,255,255,0.6)] dark:shadow-[0_0_50px_rgba(100,100,255,0.4)] flex flex-col items-center justify-center p-12 overflow-hidden z-10">
                        {/* Close Button */}
                        <DialogClose className="absolute top-4 text-white/80 hover:text-white transition-colors z-50 rounded-full p-2 bg-black/20 hover:bg-black/30">
                            <X className="w-6 h-6" />
                        </DialogClose>

                        {/* Internal Snow/Sparkle Effect */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-10 left-10 text-white/40 text-xs">❄</div>
                            <div className="absolute top-20 right-14 text-white/30 text-xl">❅</div>
                            <div className="absolute bottom-16 left-20 text-white/20 text-lg">❄</div>
                        </div>

                        <DialogHeader className="mb-6 text-center relative z-20">
                            <DialogTitle className="font-christmas text-4xl text-[#D42426] dark:text-red-400 drop-shadow-sm">Créer un Nouveau Groupe</DialogTitle>
                            <DialogDescription className="text-slate-700 dark:text-gray-300 font-medium">
                                Donnez un nom à votre groupe pour commencer.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={createGroup} className="w-full relative z-20">
                            <div className="grid gap-4 py-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name" className="text-center text-[#165B33] dark:text-green-400 font-bold">
                                        Nom du Groupe
                                    </Label>
                                    <Input
                                        id="name"
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        className="col-span-3 text-center bg-white/60 dark:bg-gray-700/80 border-[#165B33]/30 dark:border-green-500/30 focus:border-[#165B33] dark:focus:border-green-400 placeholder:text-slate-500 dark:placeholder:text-gray-400 text-black dark:text-white"
                                        placeholder="Famille"
                                    />
                                </div>
                                {createForm.errors.name && (
                                    <div className="text-center text-sm text-[#D42426] dark:text-red-400 font-bold bg-white/80 dark:bg-gray-800/80 rounded-full px-2 py-0.5">{createForm.errors.name}</div>
                                )}
                            </div>
                            <DialogFooter className="justify-center sm:justify-center mt-2">
                                <Button type="submit" disabled={createForm.processing} className="bg-[#D42426] hover:bg-[#b01e20] text-white rounded-full px-8 shadow-lg hover:scale-105 transition-transform dark:bg-red-700 dark:hover:bg-red-600">
                                    Créer le Groupe
                                </Button>
                            </DialogFooter>
                        </form>
                    </div>

                    {/* The Base */}
                    <div className="w-[80%] h-24 bg-gradient-to-r from-[#8C1819] via-[#D42426] to-[#8C1819] dark:from-red-900 dark:via-red-700 dark:to-red-900 rounded-b-[3rem] -mt-12 pt-16 relative z-0 border-x-4 border-b-4 border-[#391800]/20 dark:border-gray-900/40 shadow-2xl flex items-end justify-center pb-4">
                        <div className="text-[#F8B803] dark:text-yellow-300 font-christmas text-xl opacity-80">Ho Ho Ho !</div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
