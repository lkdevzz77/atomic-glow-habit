import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      // Mobile: scroll horizontal com pills
      "flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1",
      "sm:inline-flex sm:h-12 sm:items-center sm:justify-center",
      "sm:rounded-xl sm:bg-slate-900/50 sm:backdrop-blur-xl sm:p-1.5",
      "sm:border sm:border-slate-800/50",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base: touch-friendly com ícones
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full",
      "touch-target-comfortable min-w-[120px] sm:min-w-[140px]",
      "px-4 py-2.5 sm:px-6 sm:py-2",
      "text-sm font-medium transition-all duration-300",
      
      // Estado inativo: sutil
      "text-slate-400 hover:text-slate-200",
      "bg-slate-900/30 hover:bg-slate-800/50",
      "border border-slate-800/30",
      
      // Estado ativo: GRADIENTE ROXO
      "data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-600",
      "data-[state=active]:text-white data-[state=active]:border-transparent",
      "data-[state=active]:shadow-lg data-[state=active]:shadow-violet-500/30",
      "data-[state=active]:scale-[1.02]",
      
      // Acessibilidade
      "focus-visible:outline-none focus-visible:ring-2",
      "focus-visible:ring-violet-500 focus-visible:ring-offset-2",
      "focus-visible:ring-offset-slate-950",
      "disabled:pointer-events-none disabled:opacity-50",
      
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
