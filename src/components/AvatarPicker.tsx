import React, { useState } from 'react';
import { User, Sparkles, Star, Zap, Flame, Crown, Award, Trophy, Medal, Atom, Rocket, Brain, Heart, Target, Mountain, Compass, Leaf, Upload, Palette } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const AVATAR_ICONS = [
  { icon: User, name: 'User' },
  { icon: Sparkles, name: 'Sparkles' },
  { icon: Star, name: 'Star' },
  { icon: Zap, name: 'Zap' },
  { icon: Flame, name: 'Flame' },
  { icon: Crown, name: 'Crown' },
  { icon: Award, name: 'Award' },
  { icon: Trophy, name: 'Trophy' },
  { icon: Medal, name: 'Medal' },
  { icon: Atom, name: 'Atom' },
  { icon: Rocket, name: 'Rocket' },
  { icon: Brain, name: 'Brain' },
  { icon: Heart, name: 'Heart' },
  { icon: Target, name: 'Target' },
  { icon: Mountain, name: 'Mountain' },
  { icon: Compass, name: 'Compass' },
  { icon: Leaf, name: 'Leaf' },
];

const AVATAR_COLORS = [
  { name: 'violet', label: 'Violeta', bg: 'bg-gradient-to-br from-violet-600 to-purple-600' },
  { name: 'blue', label: 'Azul', bg: 'bg-gradient-to-br from-blue-600 to-cyan-600' },
  { name: 'emerald', label: 'Esmeralda', bg: 'bg-gradient-to-br from-emerald-600 to-teal-600' },
  { name: 'amber', label: 'Âmbar', bg: 'bg-gradient-to-br from-amber-600 to-orange-600' },
  { name: 'rose', label: 'Rosa', bg: 'bg-gradient-to-br from-rose-600 to-pink-600' },
  { name: 'indigo', label: 'Índigo', bg: 'bg-gradient-to-br from-indigo-600 to-violet-600' },
];

interface AvatarPickerProps {
  currentType: 'initials' | 'upload' | 'icon';
  currentIcon?: string;
  currentColor: string;
  currentUrl?: string;
  onUpdate: (type: 'initials' | 'upload' | 'icon', icon?: string, color?: string, url?: string) => void;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  currentType,
  currentIcon = 'User',
  currentColor,
  currentUrl,
  onUpdate,
}) => {
  const [selectedColor, setSelectedColor] = useState(currentColor);
  const [selectedIcon, setSelectedIcon] = useState(currentIcon);

  return (
    <Tabs defaultValue={currentType} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="initials">Iniciais</TabsTrigger>
        <TabsTrigger value="icon">Ícone</TabsTrigger>
        <TabsTrigger value="upload">Upload</TabsTrigger>
      </TabsList>

      <TabsContent value="initials" className="space-y-4">
        <div>
          <Label>Cor de fundo</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {AVATAR_COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => {
                  setSelectedColor(color.name);
                  onUpdate('initials', undefined, color.name);
                }}
                className={`h-12 rounded-lg ${color.bg} transition-all ${
                  selectedColor === color.name ? 'ring-2 ring-offset-2 ring-primary scale-105' : ''
                }`}
                title={color.label}
              />
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="icon" className="space-y-4">
        <div>
          <Label>Escolha um ícone</Label>
          <div className="grid grid-cols-6 gap-2 mt-2 max-h-64 overflow-y-auto">
            {AVATAR_ICONS.map(({ icon: Icon, name }) => (
              <button
                key={name}
                onClick={() => {
                  setSelectedIcon(name);
                  onUpdate('icon', name, selectedColor);
                }}
                className={`h-12 rounded-lg flex items-center justify-center transition-all hover:scale-110 ${
                  selectedIcon === name
                    ? 'bg-primary text-primary-foreground scale-110'
                    : 'bg-muted hover:bg-muted/80'
                }`}
                title={name}
              >
                <Icon size={20} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Cor de fundo</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {AVATAR_COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => {
                  setSelectedColor(color.name);
                  onUpdate('icon', selectedIcon, color.name);
                }}
                className={`h-12 rounded-lg ${color.bg} transition-all ${
                  selectedColor === color.name ? 'ring-2 ring-offset-2 ring-primary scale-105' : ''
                }`}
                title={color.label}
              />
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="upload" className="space-y-4">
        <div>
          <Label htmlFor="avatar-upload">Upload de imagem</Label>
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="mt-2"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  onUpdate('upload', undefined, undefined, reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Recomendado: imagem quadrada, máximo 2MB
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};
