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
                    <div className="relative w-full aspect-square rounded-full bg-gradient-to-b from-blue-50/50 to-white/40 backdrop-blur-md border-4 border-white/60 shadow-[0_0_50px_rgba(255,255,255,0.6)] flex flex-col items-center justify-center p-12 overflow-hidden z-10">

                        {/* Close Button */}
                        <DialogClose className="absolute top-10 text-white/80 hover:text-white transition-colors z-50 rounded-full p-2 bg-black/20 hover:bg-black/30">
                            <X className="w-6 h-6" />
                        </DialogClose>

                        {/* Internal Snow/Sparkle Effect (Static for performance) */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-10 left-10 text-white/40 text-xs">❄</div>
                            <div className="absolute top-20 right-14 text-white/30 text-xl">❅</div>
                            <div className="absolute bottom-16 left-20 text-white/20 text-lg">❄</div>
                        </div>

                        <DialogHeader className="mb-6 text-center relative z-20">
                            <DialogTitle className="font-christmas text-4xl text-[#D42426] drop-shadow-sm">Inviter un Membre</DialogTitle>
                            <DialogDescription className="text-slate-700 font-medium">
                                Envoyez une invitation par email pour rejoindre le groupe.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleInvite} className="w-full relative z-20">
                            <div className="grid gap-4 py-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="email" className="text-center text-[#165B33] font-bold">
                                        Adresse Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={inviteForm.data.email}
                                        onChange={e => inviteForm.setData('email', e.target.value)}
                                        className="col-span-3 text-center bg-white/60 border-[#165B33]/30 focus:border-[#165B33] placeholder:text-slate-500 text-black"
                                        placeholder="santa@northpole.com"
                                    />
                                </div>
                                {inviteForm.errors.email && (
                                    <p className="text-center text-sm text-[#D42426] font-bold bg-white/80 rounded-full px-2 py-0.5">{inviteForm.errors.email}</p>
                                )}
                            </div>
                            <DialogFooter className="justify-center sm:justify-center mt-2">
                                <Button type="submit" disabled={inviteForm.processing} className="bg-[#D42426] hover:bg-[#b01e20] text-white rounded-full px-8 shadow-lg hover:scale-105 transition-transform dark:bg-red-700 dark:hover:bg-red-600">
                                    Envoyer l'invitation
                                </Button>
                            </DialogFooter>
                        </form>
                    </div>

                    {/* The Base */}
                    <div className="w-[80%] h-24 bg-gradient-to-r from-[#8C1819] via-[#D42426] to-[#8C1819] rounded-b-[3rem] -mt-12 pt-16 relative z-0 border-x-4 border-b-4 border-[#391800]/20 shadow-2xl flex items-end justify-center pb-4">
                        <div className="text-[#F8B803] font-christmas text-xl opacity-80">Ho Ho Ho !</div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
