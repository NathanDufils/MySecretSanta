import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Bell, Check, X } from 'lucide-react';
import { type Invitation } from '@/types';
import { router } from '@inertiajs/react';

interface NotificationsDropdownProps {
    invitations: Invitation[];
}

export default function NotificationsDropdown({ invitations }: NotificationsDropdownProps) {

    const handleAcceptInvitation = (invitationId: number) => {
        router.post(`/invitations/${invitationId}/accept`, {}, {
            preserveScroll: true,
        });
    };

    const handleDeclineInvitation = (invitationId: number) => {
        if (confirm('Voulez-vous vraiment refuser cette invitation ?')) {
            router.post(`/invitations/${invitationId}/decline`, {}, {
                preserveScroll: true,
            });
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="relative flex w-11 h-11 items-center justify-center rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:outline-none">
                <span className="sr-only">Notifications</span>
                <div className="relative">
                    <Bell className="w-5 h-5 text-white" />
                    {invitations && invitations.length > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F8B803] text-[10px] font-bold text-[#391800]">
                            {invitations.length}
                        </span>
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl border-none shadow-2xl rounded-2xl">
                <div className="bg-[#D42426] dark:bg-red-800 p-4 text-white">
                    <h3 className="font-bold flex items-center gap-2">
                        💌 Invitations {invitations?.length ? `(${invitations.length})` : ''}
                    </h3>
                </div>
                <div className="max-h-[300px] overflow-y-auto p-2 space-y-2">
                    {invitations && invitations.length > 0 ? (
                        invitations.map((invite: Invitation) => (
                            <div key={invite.id} className="bg-white/50 dark:bg-gray-800/70 rounded-xl p-3 border border-gray-100 dark:border-gray-700 shadow-sm">
                                <div className="mb-2">
                                    <p className="font-bold text-gray-800 dark:text-white text-sm">
                                        {invite.group?.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Invité par {invite.group?.admin?.name}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleAcceptInvitation(invite.id)}
                                        size="sm"
                                        className="flex-1 bg-[#165B33] hover:bg-[#0f4224] text-white rounded-lg h-8 text-xs gap-1"
                                    >
                                        <Check className="w-3 h-3" /> Accepter
                                    </Button>
                                    <Button
                                        onClick={() => handleDeclineInvitation(invite.id)}
                                        variant="destructive"
                                        size="sm"
                                        className="flex-1 rounded-lg h-8 text-xs gap-1"
                                    >
                                        <X className="w-3 h-3" /> Refuser
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm italic">
                            Aucune nouvelle invitation.
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
