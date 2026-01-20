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
import { Textarea } from '@/components/ui/textarea';
import { Settings, Trash2 } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';
import { type Group } from '@/types';

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
            <DialogContent className="text-black dark:text-white dark:bg-gray-900 sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-christmas text-[#D42426] dark:text-red-500">Paramètres du Groupe</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations et préférences de votre groupe.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleUpdate} className="space-y-6 mt-4">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="date">Date de l'événement</Label>
                            <Input
                                id="date"
                                type="date"
                                value={updateForm.data.event_date}
                                onChange={e => updateForm.setData('event_date', e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="desc">Description</Label>
                            <Textarea
                                id="desc"
                                className="min-h-[100px]"
                                value={updateForm.data.description}
                                onChange={e => updateForm.setData('description', e.target.value)}
                                placeholder="Ajoutez une description..."
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="budget">Budget Maximum (€)</Label>
                            <Input
                                id="budget"
                                type="number"
                                min="0"
                                step="1"
                                placeholder="Ex: 50"
                                value={updateForm.data.max_budget}
                                onChange={e => updateForm.setData('max_budget', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
                        <div className="mb-2 flex items-center gap-2 text-red-600 dark:text-red-400">
                            <Trash2 className="h-4 w-4" />
                            <h4 className="font-semibold text-sm uppercase tracking-wide">Zone de Danger</h4>
                        </div>
                        <p className="mb-4 text-xs text-red-600/80 dark:text-red-400/80">
                            La suppression est irréversible. Toutes les données seront perdues.
                        </p>
                        <Button
                            type="button"
                            variant="destructive"
                            className="w-full bg-red-100 text-red-600 hover:bg-red-200 border-none shadow-none dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                            onClick={() => {
                                if (confirm('Êtes-vous ABSOLUMENT sûr ? Cette action supprimera le groupe et toutes les données associées.')) {
                                    router.delete(`/groups/${group.id}`);
                                }
                            }}
                        >
                            Supprimer ce Groupe
                        </Button>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
                        <Button type="submit" className="bg-[#D42426] text-white hover:bg-[#b01e20] dark:bg-red-700 dark:hover:bg-red-600">
                            Enregistrer
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
