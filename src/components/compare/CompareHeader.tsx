import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CompareHeader() {
  const navigate = useNavigate();
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl">Compare Levels</span>
        </button>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')}>Home</Button>
          <Button variant="outline" onClick={() => navigate('/auth')}>Sign In</Button>
        </div>
      </div>
    </header>
  );
}
