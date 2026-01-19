import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';

export default function JoinGroupForm() {
    const joinForm = useForm({
        code: '',
    });

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        joinForm.post('/groups/join', {
            onSuccess: () => {
                joinForm.reset();
            }
        });
    };

    return (
        <div className="flex flex-col items-center">
            <form onSubmit={handleJoin} className="flex items-center gap-2 rounded-full bg-white/10 dark:bg-gray-800/50 p-1 pl-4 backdrop-blur-sm border border-white/20 dark:border-gray-600/40 shadow-lg">
                <Label htmlFor="code" className="sr-only">Code du Groupe</Label>
                <Input
                    id="code"
                    placeholder="Code..."
                    className="bg-transparent border-0 text-white placeholder:text-white/60 dark:placeholder:text-gray-400 w-24 uppercase font-mono font-bold focus-visible:ring-0 px-0"
                    value={joinForm.data.code}
                    onChange={e => joinForm.setData('code', e.target.value)}
                    maxLength={6}
                />
                <Button type="submit" disabled={joinForm.processing} className="rounded-full bg-[#165B33] hover:bg-[#124d2b] dark:bg-green-700 dark:hover:bg-green-600 text-white h-10 px-6">
                    Rejoindre
                </Button>
            </form>
            {joinForm.errors.code && <p className="mt-2 text-sm font-bold text-[#F8B803] dark:text-yellow-300 bg-black/20 dark:bg-gray-800/40 px-3 py-1 rounded-full">{joinForm.errors.code}</p>}
        </div>
    );
}
