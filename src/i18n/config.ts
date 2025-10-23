import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "common": { "save": "Save", "cancel": "Cancel", "delete": "Delete", "edit": "Edit", "close": "Close", "loading": "Loading...", "error": "Error", "success": "Success", "confirm": "Confirm", "back": "Back", "next": "Next", "finish": "Finish" },
      "nav": { "dashboard": "Dashboard", "habits": "Habits", "calendar": "Calendar", "stats": "Statistics", "badges": "Achievements", "profile": "Profile", "settings": "Settings" },
      "dashboard": { "title": "Dashboard", "dailyProgress": "Today's Progress", "completedToday": "Completed Today", "xpEarned": "XP Earned", "activeStreaks": "Active Streaks", "weeklyProgress": "Weekly Progress", "todo": "To Do", "completed": "Completed", "habits": "habits", "noHabits": "No habits yet", "createFirst": "Create your first habit to start tracking your progress" },
      "habits": { "title": "Habits", "newHabit": "New Habit", "editHabit": "Edit Habit", "deleteHabit": "Delete Habit", "complete": "Complete", "undo": "Undo", "streak": "streak", "days": "days", "createdSuccess": "Habit created successfully!", "updatedSuccess": "Habit updated successfully!", "deletedSuccess": "Habit deleted successfully!", "completedSuccess": "Habit completed!", "xpGained": "XP gained" },
      "stats": { "title": "Statistics", "period": "Period", "last7days": "Last 7 days", "last30days": "Last 30 days", "last90days": "Last 90 days", "thisYear": "This year", "completionRate": "Completion Rate", "totalCompleted": "Total Completed", "averagePerDay": "Average per Day", "bestDay": "Best Day", "insights": "Insights" },
      "badges": { "title": "Achievements", "unlocked": "Unlocked", "locked": "Locked", "progress": "Progress", "all": "All", "streak": "Streak", "habits": "Habits", "mastery": "Mastery", "unlockedBadge": "Achievement Unlocked!", "xpBonus": "XP Bonus" },
      "profile": { "title": "Profile", "name": "Name", "identity": "Desired Identity", "level": "Level", "xp": "XP", "longestStreak": "Longest Streak" },
      "settings": { "title": "Settings", "language": "Language", "theme": "Theme", "notifications": "Notifications", "sound": "Sound", "vibration": "Vibration" },
      "auth": { "signIn": "Sign In", "signUp": "Sign Up", "signOut": "Sign Out", "email": "Email", "password": "Password", "forgotPassword": "Forgot Password?", "dontHaveAccount": "Don't have an account?", "alreadyHaveAccount": "Already have an account?" },
      "levels": { "1": "Beginner Proton", "2": "Curious Electron", "3": "Forming Atom", "4": "Active Molecule", "5": "Stable Compound", "6": "Organized Crystal", "7": "Controlled Reactor", "8": "Nuclear Fusion", "9": "Radiant Supernova", "10": "Neutron Star" },
      "levelUp": { "title": "Level Up!", "message": "You've reached level {{level}}!", "newPerks": "New Perks Unlocked" },
      "deleteHabit": { "title": "Delete Habit?", "description": "Are you sure you want to delete {{habitName}}? This action cannot be undone.", "cancel": "Cancel", "confirm": "Delete" }
    }
  },
  'pt-BR': {
    translation: {
      "common": { "save": "Salvar", "cancel": "Cancelar", "delete": "Excluir", "edit": "Editar", "close": "Fechar", "loading": "Carregando...", "error": "Erro", "success": "Sucesso", "confirm": "Confirmar", "back": "Voltar", "next": "Próximo", "finish": "Concluir" },
      "nav": { "dashboard": "Dashboard", "habits": "Hábitos", "calendar": "Calendário", "stats": "Estatísticas", "badges": "Conquistas", "profile": "Perfil", "settings": "Configurações" },
      "dashboard": { "title": "Dashboard", "dailyProgress": "Progresso de Hoje", "completedToday": "Completados Hoje", "xpEarned": "XP Ganho", "activeStreaks": "Streaks Ativos", "weeklyProgress": "Progresso Semanal", "todo": "A Fazer", "completed": "Completados", "habits": "hábitos", "noHabits": "Nenhum hábito ainda", "createFirst": "Crie seu primeiro hábito para começar a acompanhar seu progresso" },
      "habits": { "title": "Hábitos", "newHabit": "Novo Hábito", "editHabit": "Editar Hábito", "deleteHabit": "Excluir Hábito", "complete": "Concluir", "undo": "Desfazer", "streak": "sequência", "days": "dias", "createdSuccess": "Hábito criado com sucesso!", "updatedSuccess": "Hábito atualizado com sucesso!", "deletedSuccess": "Hábito excluído com sucesso!", "completedSuccess": "Hábito concluído!", "xpGained": "XP ganho" },
      "stats": { "title": "Estatísticas", "period": "Período", "last7days": "Últimos 7 dias", "last30days": "Últimos 30 dias", "last90days": "Últimos 90 dias", "thisYear": "Este ano", "completionRate": "Taxa de Conclusão", "totalCompleted": "Total Completado", "averagePerDay": "Média por Dia", "bestDay": "Melhor Dia", "insights": "Insights" },
      "badges": { "title": "Conquistas", "unlocked": "Desbloqueadas", "locked": "Bloqueadas", "progress": "Progresso", "all": "Todas", "streak": "Sequência", "habits": "Hábitos", "mastery": "Maestria", "unlockedBadge": "Conquista Desbloqueada!", "xpBonus": "Bônus de XP" },
      "profile": { "title": "Perfil", "name": "Nome", "identity": "Identidade Desejada", "level": "Nível", "xp": "XP", "longestStreak": "Maior Sequência" },
      "settings": { "title": "Configurações", "language": "Idioma", "theme": "Tema", "notifications": "Notificações", "sound": "Som", "vibration": "Vibração" },
      "auth": { "signIn": "Entrar", "signUp": "Cadastrar", "signOut": "Sair", "email": "Email", "password": "Senha", "forgotPassword": "Esqueceu a senha?", "dontHaveAccount": "Não tem uma conta?", "alreadyHaveAccount": "Já tem uma conta?" },
      "levels": { "1": "Próton Iniciante", "2": "Elétron Curioso", "3": "Átomo Formador", "4": "Molécula Ativa", "5": "Composto Estável", "6": "Cristal Organizado", "7": "Reator Controlado", "8": "Fusão Nuclear", "9": "Supernova Radiante", "10": "Estrela de Nêutrons" },
      "levelUp": { "title": "Subiu de Nível!", "message": "Você alcançou o nível {{level}}!", "newPerks": "Novas Vantagens Desbloqueadas" },
      "deleteHabit": { "title": "Excluir Hábito?", "description": "Tem certeza que deseja excluir {{habitName}}? Esta ação não pode ser desfeita.", "cancel": "Cancelar", "confirm": "Excluir" }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
