import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  PlayCircle,
  AlertTriangle,
  FolderGit2,
  Database,
  MoreHorizontal,
  BarChart3,
  Settings2,
  Contrast,
  HelpCircle,
  BookOpen,
  Plus,
  Scale,
  Cloud,
  LogIn,
  LogOut,
  Cpu,
  ChevronDown,
} from 'lucide-react';
import { Topic } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';

export type ActiveTab =
  | 'dashboard'
  | 'runner'
  | 'errors'
  | 'content'
  | 'items'
  | 'chat'
  | 'export'
  | 'help';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  dueCount: number;
  openErrorsCount: number;
  onOpenHelp: () => void;
  onOpenJevLab?: () => void;
  jevEnabled?: boolean;
  highContrast?: boolean;
  onToggleHighContrast?: () => void;
  topics: Topic[];
  selectedTopicId: string | 'all';
  setSelectedTopicId: (id: string | 'all') => void;
  onOpenCreateTopic?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  dueCount,
  openErrorsCount,
  onOpenHelp,
  onOpenJevLab,
  jevEnabled = true,
  highContrast = false,
  onToggleHighContrast,
  topics,
  selectedTopicId,
  setSelectedTopicId,
  onOpenCreateTopic,
}) => {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMobileMore, setShowMobileMore] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close "Más" drawer on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowMoreMenu(false);
        setShowMobileMore(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const isMoreActive = ['content', 'items', 'chat', 'export'].includes(activeTab);

  // Primary navigation: the 3 jobs of an opositor (study, syllabus, mistakes).
  // Everything else lives in the "Más" drawer so the daily path stays obvious.
  const primaryNavItems = [
    {
      id: 'dashboard',
      label: 'Temario',
      icon: LayoutDashboard,
      count: null,
    },
    {
      id: 'runner',
      label: 'Estudiar',
      icon: PlayCircle,
      count: dueCount > 0 ? dueCount : null,
      countColor: 'text-blue-400 font-numeric font-bold',
    },
    {
      id: 'errors',
      label: 'Mis fallos',
      icon: AlertTriangle,
      count: openErrorsCount > 0 ? openErrorsCount : null,
      countColor: 'text-rose-400 font-numeric font-bold',
    },
  ];

  // Advanced tools: kept, but tucked into the "Más" drawer with plain names.
  // Tab ids are unchanged so no study logic is affected.
  const drawerTabItems = [
    {
      id: 'content' as ActiveTab,
      label: 'Contenidos',
      subtext: 'Material de apoyo para crear temas',
      icon: FolderGit2,
    },
    {
      id: 'items' as ActiveTab,
      label: 'Preguntas',
      subtext: 'Banco y validación de preguntas',
      icon: Database,
    },
    {
      id: 'chat' as ActiveTab,
      label: 'Consultor',
      subtext: 'Asistente con IA (necesita clave)',
      icon: Scale,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c0f17]/95 backdrop-blur-md border-b border-[#20293a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Zone 1: Single text element wordmark */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-8 h-8 rounded-md bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Scale className="w-4 h-4" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-bold text-base text-slate-100 tracking-tight font-legal-serif">
                OposiLab
              </span>
              <span className="text-xs text-slate-400 hidden lg:inline font-sans">
                Seguridad Social · Laboratorio Cognitivo
              </span>
            </div>
          </div>

          {/* Zone 2: Streamlined & ergonomic primary navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {/* Panel */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-b-2 ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Temario</span>
            </button>

            {/* Entrenar (with count) */}
            <button
              onClick={() => setActiveTab('runner')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-b-2 ${
                activeTab === 'runner'
                  ? 'border-blue-500 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Estudiar</span>
              {dueCount > 0 && (
                <span className="text-[11px] font-numeric font-bold text-blue-400">
                  ({dueCount})
                </span>
              )}
            </button>

            {/* Errores (with count) */}
            <button
              onClick={() => setActiveTab('errors')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-b-2 ${
                activeTab === 'errors'
                  ? 'border-blue-500 text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Mis fallos</span>
              {openErrorsCount > 0 && (
                <span className="text-[11px] font-numeric font-bold text-rose-400">
                  ({openErrorsCount})
                </span>
              )}
            </button>

            {/* "Más" drawer: advanced tools stay available, out of the daily path */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                aria-expanded={showMoreMenu}
                aria-haspopup="menu"
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-b-2 ${
                  isMoreActive
                    ? 'border-blue-500 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
                <span>Más</span>
                <ChevronDown className="w-3 h-3 text-slate-400 transition-transform" />
              </button>

              {showMoreMenu && (
                <div role="menu" className="absolute left-0 mt-1.5 w-64 rounded-md bg-[#121722] border border-[#20293a] shadow-xl py-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-1 text-[10px] uppercase font-mono tracking-wider text-slate-500 border-b border-[#20293a] mb-1">
                    Contenido avanzado
                  </div>
                  {drawerTabItems.map((item) => {
                    const SubIcon = item.icon;
                    const isSubActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        role="menuitem"
                        onClick={() => {
                          setActiveTab(item.id);
                          setShowMoreMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-start space-x-2.5 transition ${
                          isSubActive
                            ? 'bg-[#182030] text-blue-400'
                            : 'text-slate-300 hover:bg-[#182030] hover:text-white'
                        }`}
                      >
                        <SubIcon className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold">{item.label}</div>
                          <div className="text-[11px] text-slate-400">{item.subtext}</div>
                        </div>
                      </button>
                    );
                  })}
                  <div className="px-3 py-1 text-[10px] uppercase font-mono tracking-wider text-slate-500 border-b border-[#20293a] border-t mt-1 mb-1">
                    Ajustes y herramientas
                  </div>
                  <button
                    role="menuitem"
                    onClick={() => {
                      setActiveTab('export');
                      setShowMoreMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-start space-x-2.5 transition ${
                      activeTab === 'export'
                        ? 'bg-[#182030] text-blue-400'
                        : 'text-slate-300 hover:bg-[#182030] hover:text-white'
                    }`}
                  >
                    <Settings2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold">Ajustes y copia</div>
                      <div className="text-[11px] text-slate-400">Anki, CSV y copia de seguridad</div>
                    </div>
                  </button>
                  {onOpenJevLab && jevEnabled && (
                    <button
                      role="menuitem"
                      onClick={() => {
                        onOpenJevLab();
                        setShowMoreMenu(false);
                      }}
                      title="Motor de Inferencia y Decisión"
                      className="w-full text-left px-3 py-2 flex items-start space-x-2.5 transition text-slate-300 hover:bg-[#182030] hover:text-white"
                    >
                      <Cpu className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold">Jev</div>
                        <div className="text-[11px] text-slate-400">Ajuste del motor (avanzado)</div>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Actions & Quick Topic Selector */}
          <div className="flex items-center space-x-2">
            {/* Compact Topic Selector */}
            <div className="flex items-center space-x-1.5 bg-[#121722] border border-[#20293a] rounded-md px-2.5 py-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                <option value="all" className="bg-[#121722] text-slate-200">Todos los Temas</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#121722] text-slate-200">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {onOpenCreateTopic && (
              <button
                onClick={onOpenCreateTopic}
                title="Nuevo Tema"
                className="p-1.5 rounded-md bg-[#121722] hover:bg-[#182030] text-slate-300 border border-[#20293a] transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}

            {/* High-contrast toggle (accessibility, spec §14) */}
            <button
              onClick={onToggleHighContrast}
              title={highContrast ? 'Desactivar alto contraste' : 'Activar alto contraste'}
              aria-pressed={highContrast}
              className={`p-1.5 rounded-md transition border ${
                highContrast
                  ? 'bg-[#182030] text-amber-300 border-amber-500/50'
                  : 'bg-[#121722] hover:bg-[#182030] text-slate-400 hover:text-slate-200 border-[#20293a]'
              }`}
            >
              <Contrast className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenHelp}
              title="Metodología y atajos (?)"
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-[#121722] transition"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Auth / Cloud Sync */}
            {authLoading ? (
              <div className="w-6 h-6 rounded-full bg-slate-800 animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1.5 p-1 rounded-md bg-[#121722] hover:bg-[#182030] border border-[#20293a] transition text-xs text-slate-300"
                  title={`${user.displayName || user.email} (Sincronizado)`}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Avatar"
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-blue-900/50 text-blue-300 flex items-center justify-center text-[10px] font-mono font-bold">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-60 rounded-md bg-[#121722] border border-[#20293a] shadow-xl p-3 z-50">
                    <div className="flex items-center space-x-2.5 mb-2 pb-2 border-b border-[#20293a]">
                      <div className="overflow-hidden text-xs">
                        <div className="font-semibold text-white truncate">
                          {user.displayName || 'Opositor'}
                        </div>
                        <div className="text-slate-400 truncate text-[11px]">{user.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 px-2 py-1.5 rounded bg-[#0c0f17] text-slate-300 text-[11px] mb-2">
                      <Cloud className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>Sincronización activa</span>
                    </div>

                    <button
                      onClick={async () => {
                        setShowUserMenu(false);
                        await signOut();
                      }}
                      className="w-full flex items-center justify-center space-x-1.5 px-2.5 py-1.5 rounded bg-[#182030] hover:bg-rose-950/40 text-rose-300 border border-[#20293a] hover:border-rose-800/50 transition text-xs font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-xs"
                title="Sincronizar en la nube"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Conectar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Compact Secondary Bar for Mobile & Tablet screens */}
      <div className="md:hidden flex overflow-x-auto px-4 py-1.5 bg-[#0c0f17] border-t border-[#20293a] space-x-2 no-scrollbar">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as ActiveTab)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium transition-colors ${
                isActive ? 'bg-[#182030] text-blue-400 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.count !== null && (
                <span className="text-[10px] font-numeric">
                  ({item.count})
                </span>
              )}
            </button>
          );
        })}

        {/* Mobile "Más": one toggle, expands to the same advanced tools as desktop */}
        <button
          onClick={() => setShowMobileMore(!showMobileMore)}
          aria-expanded={showMobileMore}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium transition-colors ${
            isMoreActive ? 'bg-[#182030] text-blue-400 font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
          <span>Más</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
      {showMobileMore && (
        <div className="md:hidden px-4 pb-3 bg-[#0c0f17] border-b border-[#20293a] space-y-0.5">
          {drawerTabItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setShowMobileMore(false);
                }}
                className={`w-full text-left flex items-center space-x-2.5 px-2 py-2 rounded text-xs transition ${
                  isActive ? 'bg-[#182030] text-blue-400 font-semibold' : 'text-slate-300 hover:bg-[#182030]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="font-medium">{item.label}</span>
                <span className="text-slate-500 text-[11px] truncate">{item.subtext}</span>
              </button>
            );
          })}
          <button
            onClick={() => {
              setActiveTab('export');
              setShowMobileMore(false);
            }}
            className={`w-full text-left flex items-center space-x-2.5 px-2 py-2 rounded text-xs transition ${
              activeTab === 'export' ? 'bg-[#182030] text-blue-400 font-semibold' : 'text-slate-300 hover:bg-[#182030]'
            }`}
          >
            <Settings2 className="w-4 h-4 shrink-0" />
            <span className="font-medium">Ajustes y copia</span>
            <span className="text-slate-500 text-[11px] truncate">Anki, CSV y copia de seguridad</span>
          </button>
          {onOpenJevLab && jevEnabled && (
            <button
              onClick={() => {
                onOpenJevLab();
                setShowMobileMore(false);
              }}
              className="w-full text-left flex items-center space-x-2.5 px-2 py-2 rounded text-xs transition text-slate-300 hover:bg-[#182030]"
            >
              <Cpu className="w-4 h-4 shrink-0" />
              <span className="font-medium">Jev</span>
              <span className="text-slate-500 text-[11px] truncate">Ajuste del motor (avanzado)</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

