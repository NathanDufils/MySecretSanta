import CreateGroupDialog from '@/components/Groups/CreateGroupDialog';
import JoinGroupForm from '@/components/Groups/JoinGroupForm';
import GroupList from '@/components/Groups/GroupList';
import { type Group } from '@/types';
import { useState } from 'react';

interface UserDashboardProps {
    groups: Group[];
}

export default function UserDashboard({ groups }: UserDashboardProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20">
            <div className="mb-12 text-center animate-fade-in-down">
                <h2 className="font-christmas text-5xl font-bold text-white drop-shadow-md sm:text-6xl">
                    Vos Groupes
                </h2>
                <p className="mt-4 text-xl text-red-100">
                    Retrouvez vos événements Secret Santa
                </p>

                <div className="mt-8 flex flex-col items-center gap-6">
                    {/* Actions Row */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {/* Create Group Dialog */}
                        <CreateGroupDialog
                            open={isCreateOpen}
                            onOpenChange={setIsCreateOpen}
                        />

                        {/* Join Group Form */}
                        <JoinGroupForm />

                    </div>
                </div>
            </div>

            <GroupList groups={groups} />
        </div>
    );
}
