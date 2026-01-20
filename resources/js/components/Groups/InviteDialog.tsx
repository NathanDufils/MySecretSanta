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
import { UserPlus, X } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { type Group } from '@/types';

interface InviteDialogProps {
    group: Group;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function InviteDialog({ group, open, onOpenChange }: InviteDialogProps) {
    const inviteForm = useForm<{
        email: string;
    }>({
        email: '',
    });

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        inviteForm.post(`/groups/${group.id}/participants`, {
            onSuccess: () => {
                onOpenChange(false);
                inviteForm.reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="gap-2" disabled={group.status !== 'open'}>
                    <UserPlus className="h-4 w-4" /> Inviter un Membre
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] bg-transparent border-none shadow-none p-0 overflow-visible focus:outline-none">
                <div className="relative flex flex-col items-center">
                    {/* The Globe */}
                    <div className="relative w-full aspect-square rounded-full bg-gradient-to-b from-blue-50/50 to-white/40 dark:from-blue-900/30 dark:to-gray-800/40 backdrop-blur-md border-4 border-white/60 dark:border-gray-500/60 shadow-[0_0_50px_rgba(255,255,255,0.6)] dark:shadow-[0_0_50px_rgba(100,100,255,0.4)] flex flex-col items-center justify-center p-12 overflow-hidden z-10 text-center">

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

                        <DialogHeader className="mb-6 text-center sm:text-center relative z-20 w-full flex flex-col items-center">
                            <DialogTitle className="font-christmas text-4xl text-white drop-shadow-md">Inviter un Membre</DialogTitle>
                            <DialogDescription className="text-white dark:text-gray-200 font-medium max-w-[80%] mx-auto">
                                Envoyez une invitation par email pour rejoindre le groupe.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleInvite} className="w-full relative z-20 flex flex-col items-center">
                            <div className="grid gap-4 py-4 w-[80%]">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="email" className="text-center text-white font-bold text-lg drop-shadow-md">
                                        Adresse Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={inviteForm.data.email}
                                        onChange={e => inviteForm.setData('email', e.target.value)}
                                        className="text-center bg-white/80 dark:bg-gray-700/80 border-white/50 focus:border-white focus:ring-white/50 placeholder:text-gray-500 text-[#391800] dark:text-white font-bold text-lg py-6"
                                        placeholder="santa@northpole.com"
                                    />
                                </div>
                                {inviteForm.errors.email && (
                                    <p className="text-center text-sm text-[#D42426] font-bold bg-white rounded-full px-2 py-0.5 shadow-sm">{inviteForm.errors.email}</p>
                                )}
                            </div>
                            <DialogFooter className="justify-center sm:justify-center mt-2 w-full">
                                <Button type="submit" disabled={inviteForm.processing} className="bg-[#D42426] hover:bg-[#b01e20] text-white rounded-full px-8 py-6 text-lg shadow-lg hover:scale-105 transition-transform dark:bg-red-700 dark:hover:bg-red-600 border-2 border-white/20">
                                    Envoyer l'invitation
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
