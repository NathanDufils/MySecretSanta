import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Trash2 } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';
import { type Group } from '@/types';
import { useState } from 'react';

interface SettingsDialogProps {
    group: Group;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function SettingsDialog({ group, open, onOpenChange }: SettingsDialogProps) {
    const updateForm = useForm<{
        description: string;
        event_date: string;
        max_budget: string;
    }>({
        description: group.description || '',
        event_date: group.event_date ? new Date(group.event_date).toISOString().split('T')[0] : '',
        max_budget: group.max_budget ? String(group.max_budget) : '',
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        updateForm.put(`/groups/${group.id}`, {
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="gap-2">
                    <Settings className="h-4 w-4" /> Paramètres
                </Button>
            </DialogTrigger>
            <DialogContent className="text-black dark:text-white dark:bg-gray-900 sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Paramètres du Groupe</DialogTitle>
                    <DialogDescription>Modifier les détails du groupe.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdate}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">Date</Label>
                            <Input id="date" type="date" className="col-span-3" value={updateForm.data.event_date} onChange={e => updateForm.setData('event_date', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="desc" className="text-right">Description</Label>
                            <Input id="desc" className="col-span-3" value={updateForm.data.description} onChange={e => updateForm.setData('description', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="budget" className="text-right">Budget Max (€)</Label>
                            <Input
                                id="budget"
                                type="number"
                                min="0"
                                step="1"
                                placeholder="Ex: 50"
                                className="col-span-3"
                                value={updateForm.data.max_budget}
                                onChange={e => updateForm.setData('max_budget', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <h4 className="text-sm font-semibold text-red-600 mb-2">Zone Danger</h4>
                        <Button
                            type="button"
                            variant="destructive"
                            className="w-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                            onClick={() => {
                                if (confirm('Êtes-vous ABSOLUMENT sûr ? Cette action supprimera le groupe et toutes les données associées.')) {
                                    router.delete(`/groups/${group.id}`);
                                }
                            }}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer ce Groupe
                        </Button>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-[#D42426] text-white hover:bg-[#b01e20] dark:bg-red-700 dark:hover:bg-red-600">Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
