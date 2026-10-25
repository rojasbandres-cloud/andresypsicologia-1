import React, { useState } from 'react';
import { ForumThread, User, UserRole, ForumReply } from '../../types';
import { canModerate, canAccessDebateSociedad, canApprovePosts } from '../../utils/rbac';
import {
  Compass,
  Pin,
  Lock,
  ShieldAlert,
  ShieldCheck,
  PlusCircle,
  MessageSquare,
  Award,
  Send,
  X,
  AlertTriangle,
  Sparkles,
  BookMarked,
  Ban,
  GraduationCap,
  ArrowRight,
  Hourglass
} from 'lucide-react';
import { validateEpistemologicalRigor } from '../../utils/rbac';

interface DebateSociedadViewProps {
  threads: ForumThread[];
  currentUser: User;
  onNavigate: (section: string) => void;
  onAddThread: (thread: Omit<ForumThread, 'id' | 'views' | 'likes' | 'createdAt' | 'replies'>) => void;
  onAddReply: (threadId: string, replyContent: string) => void;
  onToggleCensorThread: (threadId: string) => void;
  onTogglePinThread: (threadId: string) => void;
  onToggleCloseThread: (threadId: string) => void;
  onBanUser: (targetUserId: string, targetUserName: string, reason: string) => void;
  brandConfig?: import('../../types').SiteBrandConfig;
  onRequireAuth?: (actionContext: string) => void;
}

export const DebateSociedadView: React.FC<DebateSociedadViewProps> = ({
  threads,
  currentUser,
  onNavigate,
  onAddThread,
  onAddReply,
  onToggleCensorThread,
  onTogglePinThread,
  onToggleCloseThread,
  onBanUser,
  brandConfig,
  onRequireAuth
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('Todos');
  const [activeThread, setActiveThread] = useState<ForumThread | null>(null);
  const [showNewThreadModal, setShowNewThreadModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [newCategory, setNewCategory] = useState('Filosofía Conductista e Ingeniería Cultural');
  const [newEpistemologicalTag, setNewEpistemologicalTag] = useState('Conductismo Radical');
  const [replyInput, setReplyInput] = useState('');
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [submissionNotice, setSubmissionNotice] = useState<string | null>(null);

  // Moderation ban modal state
  const [banModalTarget, setBanModalTarget] = useState<{ id: string; name: string } | null>(null);
  const [banReason, setBanReason] = useState('');

  const isMod = canModerate(currentUser.role);
  const isSuperAdmin = canApprovePosts(currentUser.role);

  // Check posting permission configured by admin in brandConfig:
  const allowedDebateRoles = brandConfig?.postingPermissions?.debateSociedad || [
    'SuperAdmin',
    'Moderador',
    'Psicologo'
  ];
  const canPostDebate = allowedDebateRoles.includes(currentUser.role);

  const tags = [
    'Todos',
    'Conductismo Radical',
    'Interconductismo',
    'Metacontingencias',
    'Ingeniería Cultural',
    'Políticas Públicas'
  ];

  const visibleThreads = threads.filter((t) => {
    if (t.status === 'rejected') return false;
    if (t.status === 'pending_review' && !isSuperAdmin && t.authorId !== currentUser.id) {
      return false;
    }
    if (!isMod && t.isCensored) return false;
    if (selectedTag !== 'Todos' && t.epistemologicalTag !== selectedTag) return false;
    return true;
  });

  const handleCreateThreadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    // Epistemological check
    const check = validateEpistemologicalRigor(`${newTitle} ${newContent}`);
    if (!check.isCompliant) {
      setValidationWarning(check.warningMessage || 'Contenido contrario a la epistemología conductista estricta.');
      return;
    }

    const finalStatus = isSuperAdmin ? 'approved' : 'pending_review';

    onAddThread({
      title: newTitle,
      content: newContent,
      imageUrl: newImageUrl.trim() || undefined,
      isAnonymous,
      realAuthorName: currentUser.name,
      realAuthorEmail: currentUser.email,
      realAuthorId: currentUser.id,
      authorId: currentUser.id,
      authorName: isAnonymous ? 'Anónimo' : currentUser.name,
      authorRole: currentUser.role,
      isVerifiedAuthor: currentUser.isVerified,
      fpvNumber: !isAnonymous && currentUser.fpvNumber ? currentUser.fpvNumber : undefined,
      category: newCategory,
      epistemologicalTag: newEpistemologicalTag,
      status: finalStatus,
      isPinned: false,
      isClosed: false,
      isCensored: false
    });

    setNewTitle('');
    setNewContent('');
    setNewImageUrl('');
    setIsAnonymous(false);
    setValidationWarning(null);
    setShowNewThreadModal(false);

    if (finalStatus === 'pending_review') {
      setSubmissionNotice(
        'Tu tema de debate ha sido enviado a revisión por el admi antes de su publicación.'
      );
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || !replyInput.trim()) return;
    if (activeThread.isClosed && !isMod) return;

    onAddReply(activeThread.id, replyInput);
    setReplyInput('');

    // Update active thread locally
    const currentReplies = activeThread.replies || [];
    const newReplyItem: ForumReply = {
      id: `rep_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      isVerifiedAuthor: currentUser.isVerified,
      fpvNumber: currentUser.fpvNumber,
      content: replyInput.trim(),
      likes: 0,
      createdAt: new Date().toISOString()
    };
    setActiveThread({
      ...activeThread,
      replies: [...currentReplies, newReplyItem]
    });
  };

  const handleExecuteBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banModalTarget || !banReason.trim()) return;
    onBanUser(banModalTarget.id, banModalTarget.name, banReason);
    setBanModalTarget(null);
    setBanReason('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#91A7BB]/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4D76B4]/10 text-[#4D76B4] text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            Foro Filosófico Exclusivo para Psicólogos Miembros
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#2A2A2A]">
            Debate Sociedad: Análisis de la Cultura
          </h1>
          <p className="text-sm text-[#2A2A2A]/75 mt-1 max-w-2xl">
            Espacio conceptual para miembros acreditados sobre filosofía conductista, metacontingencias de Glenn, Skinner e ingeniería cultural.
          </p>
        </div>

        <div>
          {canPostDebate ? (
            <button
              onClick={() => setShowNewThreadModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#4D76B4] text-white font-bold text-sm shadow-sm hover:bg-[#3d629a] transition-all active:scale-98"
            >
              <PlusCircle className="w-4 h-4 text-[#FFE571]" />
              <span>Plantear Debate Teórico</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (currentUser.role === 'Invitado') {
                  onRequireAuth?.('publicar un debate en Debate y Sociedad');
                } else {
                  alert('La publicación en Debate y Sociedad está reservada para psicólogos y administradores según los permisos vigentes.');
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-100 border border-[#91A7BB]/30 text-[#2A2A2A]/70 font-semibold text-xs hover:bg-gray-200 transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-[#4D76B4]" />
              <span>Publicación restringida (Lectura pública para todos)</span>
            </button>
          )}
        </div>
      </div>

      {submissionNotice && (
        <div className="p-4 rounded-2xl bg-[#FFE571]/20 border border-[#FFE571] flex items-center justify-between gap-3 text-xs text-[#2A2A2A]">
          <div className="flex items-center gap-2">
            <Hourglass className="w-4 h-4 text-[#4D76B4] flex-shrink-0" />
            <span>{submissionNotice}</span>
          </div>
          <button onClick={() => setSubmissionNotice(null)} className="text-[#91A7BB]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Epistemological Charter Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#4D76B4]/10 via-[#6BD4FF]/10 to-[#FFE571]/20 border border-[#4D76B4]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#4D76B4]">
            <BookMarked className="w-4 h-4" />
            Directriz de Debate Filosófico para Psicólogos
          </div>
          <p className="text-xs text-[#2A2A2A]/85 leading-relaxed max-w-3xl">
            Debate Sociedad examina macrocontingencias: instituciones gubernamentales, contracontrol skinneriano y epistemología interconductual. Todos los usuarios pueden leer los debates libremente.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-white border border-[#4D76B4]/30 text-xs font-bold text-[#4D76B4] whitespace-nowrap shadow-2xs">
          Lectura Abierta a Todos
        </div>
      </div>

      {/* Filter Tags */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTag === tag
                ? 'bg-[#4D76B4] text-white shadow-2xs font-bold'
                : 'bg-white border border-[#91A7BB]/30 text-[#2A2A2A] hover:bg-[#91A7BB]/10'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Threads List */}
      <div className="space-y-4">
        {visibleThreads.map((thread) => {
          const isPending = thread.status === 'pending_review';
          return (
            <div
              key={thread.id}
              className={`p-6 rounded-3xl border transition-all ${
                thread.isCensored
                  ? 'bg-red-50/70 border-red-200'
                  : isPending
                  ? 'bg-amber-50/30 border-2 border-amber-300 shadow-xs'
                  : thread.isPinned
                  ? 'bg-white border-2 border-[#4D76B4]/50 shadow-md ring-4 ring-[#4D76B4]/5'
                  : 'bg-white border-[#91A7BB]/30 shadow-xs hover:border-[#4D76B4]/40 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div
                  className="space-y-3 cursor-pointer flex-1"
                  onClick={() => setActiveThread(thread)}
                >
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {thread.imageUrl && (
                      <img
                        src={thread.imageUrl}
                        alt={thread.title}
                        className="w-full sm:w-36 h-28 object-cover rounded-2xl border border-[#91A7BB]/30 shrink-0"
                      />
                    )}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {thread.isPinned && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-[#4D76B4] text-white px-2 py-0.5 rounded-md">
                            <Pin className="w-3 h-3 text-[#FFE571]" /> Fijado
                          </span>
                        )}
                        {isPending && (
                          <span className="text-[10px] font-bold bg-[#FFE571] text-[#2A2A2A] px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Hourglass className="w-3 h-3 text-[#4D76B4]" /> En Revisión Previa
                          </span>
                        )}
                        {thread.epistemologicalTag && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFE571] text-[#2A2A2A]">
                            {thread.epistemologicalTag}
                          </span>
                        )}
                        {thread.isClosed && (
                          <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md font-bold">
                            Cerrado
                          </span>
                        )}
                        {thread.isCensored && (
                          <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-md font-bold">
                            Censurado
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-[#2A2A2A] hover:text-[#4D76B4] transition-colors">
                        {thread.title}
                      </h3>

                      <p className="text-xs text-[#2A2A2A]/80 line-clamp-2 leading-relaxed font-normal">
                        {thread.content}
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#91A7BB]">
                        <span className="font-semibold text-[#2A2A2A] flex items-center gap-1.5">
                          {thread.isAnonymous ? (
                            isSuperAdmin ? (
                              <span className="text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md text-[11px] font-bold">
                                Anónimo (Autor real: {thread.realAuthorName || thread.authorName})
                              </span>
                            ) : (
                              <span className="text-[#2A2A2A]/70 italic">Anónimo</span>
                            )
                          ) : (
                            <span>{thread.authorName}</span>
                          )}
                          {thread.authorRole === 'SuperAdmin' && (
                            <span className="bg-[#4D76B4] text-white text-[10px] px-2 py-0.2 rounded-full font-bold">
                              admi
                            </span>
                          )}
                          {thread.authorRole === 'Psicologo' && !thread.isAnonymous && thread.fpvNumber && (
                            <span className="bg-[#6BD4FF]/30 text-[#006090] text-[10px] px-2 py-0.2 rounded-full font-bold flex items-center gap-1">
                              <Award className="w-3 h-3 text-[#4D76B4]" />
                              FPV {thread.fpvNumber}
                            </span>
                          )}
                        </span>
                        <span>•</span>
                        <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#4D76B4] font-bold">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {thread.replies.length} intervenciones
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Moderator Controls */}
                {isMod && (
                  <div className="flex sm:flex-col items-center gap-1.5 border-t sm:border-t-0 sm:border-l border-[#91A7BB]/20 pt-2 sm:pt-0 sm:pl-4">
                    <button
                      onClick={() => onTogglePinThread(thread.id)}
                      title={thread.isPinned ? 'Desfijar' : 'Fijar'}
                      className={`p-2 rounded-xl text-xs font-semibold ${
                        thread.isPinned ? 'bg-[#4D76B4] text-white' : 'bg-gray-100 text-[#2A2A2A]'
                      }`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onToggleCloseThread(thread.id)}
                      title={thread.isClosed ? 'Reabrir' : 'Cerrar'}
                      className={`p-2 rounded-xl text-xs font-semibold ${
                        thread.isClosed ? 'bg-amber-500 text-white' : 'bg-gray-100 text-[#2A2A2A]'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onToggleCensorThread(thread.id)}
                      title={thread.isCensored ? 'Restaurar' : 'Censurar'}
                      className={`p-2 rounded-xl text-xs font-semibold ${
                        thread.isCensored ? 'bg-red-600 text-white' : 'bg-gray-100 text-red-600'
                      }`}
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </button>

                    {thread.authorId !== currentUser.id && (
                      <button
                        onClick={() => setBanModalTarget({ id: thread.authorId, name: thread.authorName })}
                        title="Sancionar autor"
                        className="p-2 rounded-xl text-xs font-semibold bg-gray-100 text-red-700"
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {visibleThreads.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#91A7BB]/30 p-8 space-y-2">
            <Compass className="w-8 h-8 text-[#91A7BB] mx-auto" />
            <h4 className="font-bold text-[#2A2A2A]">No hay debates en esta categoría</h4>
            <p className="text-xs text-[#91A7BB]">Sé el primero en abrir una discusión conceptual.</p>
          </div>
        )}
      </div>

      {/* NEW DEBATE THREAD MODAL */}
      {showNewThreadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A2A2A]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#91A7BB]/30 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setShowNewThreadModal(false);
                setValidationWarning(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-[#91A7BB] hover:text-[#2A2A2A] hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-[#2A2A2A] mb-1">
              Plantear Debate en Debate Sociedad
            </h3>
            <p className="text-xs text-[#91A7BB] mb-4">
              Autor: <strong>{currentUser.name}</strong> • El tema se remitirá a revisión previa por el SuperAdmin antes de su publicación.
            </p>

            {validationWarning && (
              <div className="p-3.5 mb-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{validationWarning}</span>
              </div>
            )}

            <form onSubmit={handleCreateThreadSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                    Enfoque Epistemológico *
                  </label>
                  <select
                    value={newEpistemologicalTag}
                    onChange={(e) => setNewEpistemologicalTag(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4] bg-white font-medium"
                  >
                    <option value="Conductismo Radical">Conductismo Radical</option>
                    <option value="Interconductismo">Interconductismo</option>
                    <option value="Metacontingencias">Metacontingencias</option>
                    <option value="Ingeniería Cultural">Ingeniería Cultural</option>
                    <option value="Políticas Públicas">Políticas Públicas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                    Área Temática
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                  Título de la Tesis o Interrogante *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. El diseño de contracontrol democrático ante el monopolio algorítmico"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                  Argumentación y Fundamento Teórico *
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Expón las contingencias, las referencias teóricas (Skinner, Kantor, Glenn, Ribes)..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                  URL de Imagen Ilustrativa o Gráfico (Opcional)
                </label>
                <input
                  type="url"
                  placeholder="https://ejemplo.com/grafico-analisis.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#2A2A2A]">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#4D76B4] focus:ring-[#4D76B4]"
                  />
                  <span>Publicar en anónimo (Tu identidad solo será visible para el Administrador en el panel)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewThreadModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#2A2A2A] hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#4D76B4] text-white font-bold text-xs shadow-sm hover:bg-[#3d629a]"
                >
                  Enviar a Revisión Previa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* THREAD DETAIL MODAL */}
      {activeThread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A2A2A]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#91A7BB]/30 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200 space-y-6">
            <button
              onClick={() => setActiveThread(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#91A7BB] hover:text-[#2A2A2A] hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4 pb-4 border-b border-[#91A7BB]/20">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFE571] text-[#2A2A2A] font-bold">
                  {activeThread.epistemologicalTag}
                </span>
                <span className="text-xs text-[#91A7BB]">
                  {activeThread.category}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-[#2A2A2A]">
                {activeThread.title}
              </h2>

              <div className="flex items-center gap-2 text-xs text-[#91A7BB]">
                <span className="font-semibold text-[#2A2A2A]">
                  {activeThread.isAnonymous ? (
                    isSuperAdmin ? (
                      <span className="text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md text-[11px] font-bold">
                        Anónimo (Autor real: {activeThread.realAuthorName || activeThread.authorName})
                      </span>
                    ) : (
                      'Anónimo'
                    )
                  ) : (
                    activeThread.authorName
                  )}
                </span>
                {activeThread.authorRole === 'SuperAdmin' && (
                  <span className="text-[10px] bg-[#4D76B4] text-white px-2 py-0.5 rounded-full font-bold">
                    admi
                  </span>
                )}
                {activeThread.authorRole === 'Psicologo' && !activeThread.isAnonymous && activeThread.fpvNumber && (
                  <span className="text-[10px] bg-[#6BD4FF]/30 text-[#006090] px-2 py-0.5 rounded-full font-bold">
                    FPV {activeThread.fpvNumber}
                  </span>
                )}
                <span>•</span>
                <span>{new Date(activeThread.createdAt).toLocaleDateString()}</span>
              </div>

              {activeThread.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-[#91A7BB]/30">
                  <img
                    src={activeThread.imageUrl}
                    alt={activeThread.title}
                    className="w-full max-h-96 object-cover"
                  />
                </div>
              )}

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm text-[#2A2A2A]/90 leading-relaxed whitespace-pre-wrap font-body">
                {activeThread.content}
              </div>
            </div>

            {/* Replies (Reddit-style threads without like/dislike) */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#4D76B4] flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>Intervenciones Teóricas ({activeThread.replies.length})</span>
              </h4>

              <div className="space-y-3">
                {activeThread.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`pl-4 border-l-2 py-2 space-y-2 ${
                      reply.authorRole === 'SuperAdmin'
                        ? 'border-[#4D76B4] bg-[#4D76B4]/5 rounded-r-2xl pr-4'
                        : 'border-[#91A7BB]/30 bg-slate-50/50 rounded-r-2xl pr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#4D76B4] text-white flex items-center justify-center font-bold text-[10px]">
                          {reply.authorName ? reply.authorName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <strong className="text-[#2A2A2A] font-bold">
                          {reply.authorName}
                        </strong>
                        {reply.authorRole === 'SuperAdmin' && (
                          <span className="text-[10px] bg-[#4D76B4] text-white px-2 py-0.2 rounded-full font-bold">
                            admi
                          </span>
                        )}
                        {reply.authorRole === 'Psicologo' && reply.fpvNumber && (
                          <span className="text-[10px] text-[#4D76B4] font-bold">
                            FPV {reply.fpvNumber}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#91A7BB]">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-[#2A2A2A]/85 leading-relaxed whitespace-pre-wrap pl-8">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>

              {!activeThread.isClosed ? (
                <form onSubmit={handleSendReply} className="pt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Aporta argumentos basados en análisis funcional..."
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-2xl border border-[#91A7BB]/40 text-xs focus:outline-hidden focus:border-[#4D76B4]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl bg-[#4D76B4] text-white font-bold text-xs shadow-xs hover:bg-[#3d629a] transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Debatir</span>
                  </button>
                </form>
              ) : (
                <div className="p-3 rounded-xl bg-gray-100 text-xs text-gray-600 text-center font-medium">
                  Este debate ha concluido o ha sido cerrado por la moderación.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BAN MODAL */}
      {banModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A2A2A]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-200 space-y-4">
            <div className="flex items-center gap-2 text-red-600 font-bold text-base">
              <Ban className="w-5 h-5" />
              <span>Sancionar Participante</span>
            </div>
            <p className="text-xs text-[#2A2A2A]/80">
              Vas a suspender a <strong>{banModalTarget.name}</strong> por violación de normas.
            </p>

            <form onSubmit={handleExecuteBan} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-[#2A2A2A] mb-1">
                  Justificación de la Sanción *
                </label>
                <textarea
                  required
                  rows={3}
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBanModalTarget(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#2A2A2A] hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
                >
                  Aplicar Sanción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
