import React from 'react';
import { Link } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import type { User as SupabaseUser } from '@supabase/supabase-js';
interface UserMenuProps {
  points?: number;
}
export function UserMenu({
  points
}: UserMenuProps) {
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const userName = user?.user_metadata?.name || user?.email || 'User';
  const initials = userName.split('@')[0] // Remove domain part if it's an email
  .split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Até logo! 👋",
        description: "Você foi desconectado com sucesso.",
        variant: "default"
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: "Não foi possível desconectar. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  return <div className="flex items-center gap-3 sm:gap-4">
      {points !== undefined}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500">
            <span className="text-white font-semibold">{initials}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 mt-2 bg-slate-800 border border-slate-700">
          <DropdownMenuLabel className="py-2">
            <div className="truncate">
              <p className="text-sm font-medium text-slate-200">{user?.user_metadata?.name || 'Usuário'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-slate-700" />

          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-violet-400">
              <User size={16} />
              <span>Ver Perfil</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-violet-400">
              <Settings size={16} />
              <span>Configurações</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-700" />

          <DropdownMenuItem onSelect={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-400 hover:text-red-300 focus:text-red-300">
            <LogOut size={16} />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>;
}