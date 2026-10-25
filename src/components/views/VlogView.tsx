import React, { useState } from 'react';
import { VlogArticle, User, VlogDivision, ForumReply, SiteBrandConfig } from '../../types';
import { canApprovePosts } from '../../utils/rbac';
import {
  BookOpen,
  Search,
  Clock,
  User as UserIcon,
  Tag,
  Share2,
  Bookmark,
  PlusCircle,
  X,
  FileCheck2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Hourglass,
  Image as ImageIcon,
  MessageSquare,
  CornerDownRight,
  Send,
  EyeOff
} from 'lucide-react';
import { validateEpistemologicalRigor, canInteract } from '../../utils/rbac';

interface VlogViewProps {
  articles: VlogArticle[];
  currentUser: User;
  onAddArticle: (article: Omit<VlogArticle, 'id' | 'publishedAt'>) => void;
  onRequireAuth?: (actionContext: string) => void;
  brandConfig?: SiteBrandConfig;
  onAddArticleComment?: (articleId: string, content: string, parentId?: string, isAnonymous?: boolean) => void;
}

export const VlogView: React.FC<VlogViewProps> = ({
  articles,
  currentUser,
  onAddArticle,
  onRequireAuth,
  brandConfig,
  onAddArticleComment
}) => {
  const [activeDivisionTab, setActiveDivisionTab] = useState<'todas' | VlogDivision>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [activeArticleModal, setActiveArticleModal] = useState<VlogArticle | null>(null);
  const [showNewArticleModal, setShowNewArticleModal] = useState(false);

  // New Article Form state
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [vlogType, setVlogType] = useState<VlogDivision>('psicologo_paciente');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [category, setCategory] = useState<VlogArticle['category']>('Análisis de la Conducta');
  const [tagsInput, setTagsInput] = useState('');
  const [referencesInput, setReferencesInput] = useState('');
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [submissionSuccessNotice, setSubmissionSuccessNotice] = useState<string | null>(null);

  // Comment Threading state
  const [commentInput, setCommentInput] = useState('');
  const [commentReplyParentId, setCommentReplyParentId] = useState<string | null>(null);
  const [commentIsAnonymous, setCommentIsAnonymous] = useState(false);

  const isSuperAdmin = canApprovePosts(currentUser.role);

  // Check permissions configured by admin in brandConfig:
  const allowedRolesPsychOnly = brandConfig?.postingPermissions?.vlogPsychOnly || ['SuperAdmin', 'Moderador', 'Psicologo'];
  const allowedRolesCommunity = brandConfig?.postingPermissions?.vlogCommunity || ['SuperAdmin', 'Moderador', 'Psicologo', 'Paciente'];

  const canPostPsychDivision = allowedRolesPsychOnly.includes(currentUser.role);
  const canPostCommunityDivision = allowedRolesCommunity.includes(currentUser.role);
  const canPostAny = canPostPsychDivision || canPostCommunityDivision;
  const canSubmit = !currentUser.isBanned;

  const categories = [
    'Todas',
    'Análisis de la Conducta',
    'Terapias Contextuales (ACT/DBT)',
    'Interconductismo',
    'Psicología Basada en Evidencia'
  ];

  // Articles visibility:
  const visibleArticles = articles.filter((art) => {
    if (art.status === 'rejected') return false;
    if (art.status === 'pending_review' && !isSuperAdmin && art.authorId !== currentUser.id) {
      return false;
    }

    const matchesDivision =
      activeDivisionTab === 'todas' || art.vlogType === activeDivisionTab;

    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat =
      selectedCategory === 'Todas' || art.category === selectedCategory;

    return matchesDivision && matchesSearch && matchesCat;
  });

  const handleCreateArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim()) return;

    // Check epistemological purity
    const check = validateEpistemologicalRigor(`${title} ${excerpt} ${content}`);
    if (!check.isCompliant) {
      setValidationWarning(check.warningMessage || 'El manuscrito contiene términos que infringen la línea conductista estricta.');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const refsArray = referencesInput
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    const finalStatus = isSuperAdmin ? 'approved' : 'pending_review';

    onAddArticle({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      excerpt,
      content,
      imageUrl: imageUrl.trim() || undefined,
      vlogType,
      isAnonymous,
      realAuthorName: currentUser.name,
      realAuthorEmail: currentUser.email,
      realAuthorId: currentUser.id,
      authorId: currentUser.id,
      authorName: isAnonymous ? 'Anónimo' : currentUser.name,
      authorFpv: !isAnonymous && currentUser.fpvNumber ? `FPV ${currentUser.fpvNumber}` : undefined,
      authorRole: currentUser.role,
      category,
      readTimeMinutes: Math.max(3, Math.ceil(content.split(' ').length / 180)),
      status: finalStatus,
      tags: tagsArray.length > 0 ? tagsArray : ['Psicología Conductual', 'Evidencia'],
      references: refsArray.length > 0 ? refsArray : ['Revista Latinoamericana de Psicología y Análisis de la Conducta.']
    });

    setTitle('');
    setExcerpt('');
    setContent('');
    setImageUrl('');
    setTagsInput('');
    setReferencesInput('');
    setIsAnonymous(false);
    setValidationWarning(null);
    setShowNewArticleModal(false);

    if (finalStatus === 'pending_review') {
      setSubmissionSuccessNotice(
        'Tu artículo ha sido enviado a la bandeja de revisión previa. El admi (Lic. Andrés Rojas) evaluará el rigor metodológico antes de su publicación definitiva en El Vlog.'
      );
    }
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeArticleModal || !commentInput.trim()) return;

    if (!canInteract(currentUser) && onRequireAuth) {
      onRequireAuth('comentar en el artículo de divulgación');
      return;
    }

    if (onAddArticleComment) {
      onAddArticleComment(
        activeArticleModal.id,
        commentInput.trim(),
        commentReplyParentId || undefined,
        commentIsAnonymous
      );
    }

    setCommentInput('');
    setCommentReplyParentId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#91A7BB]/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4D76B4]/10 text-[#4D76B4] text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Divulgación Científica & Educación Conductual
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#2A2A2A]">
            El Vlog: Psicología Basada en Evidencia
          </h1>
          <p className="text-sm text-[#2A2A2A]/75 mt-1 max-w-2xl">
            Publicación abierta para psicólogos y pacientes. Todo contenido publicado se monitorea y valida por el SuperAdmin antes de su difusión para garantizar rigor empírico.
          </p>
        </div>

        <div>
          {canSubmit ? (
            <button
              onClick={() => {
                if (!canInteract(currentUser) && onRequireAuth) {
                  onRequireAuth('publicar un artículo en El Vlog');
                  return;
                }
                setShowNewArticleModal(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#4D76B4] text-white font-bold text-sm shadow-sm hover:bg-[#3d629a] transition-all active:scale-98"
            >
              <PlusCircle className="w-4 h-4 text-[#FFE571]" />
              <span>Publicar en El Vlog (Todos)</span>
            </button>
          ) : (
            <div className="text-xs text-red-600 bg-red-100 p-2.5 rounded-xl font-bold">
              Tu cuenta se encuentra sancionada.
            </div>
          )}
        </div>
      </div>

      {/* Divisions Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-[#4D76B4]/10 via-[#6BD4FF]/10 to-transparent p-2 rounded-2xl border border-[#91A7BB]/30">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveDivisionTab('todas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeDivisionTab === 'todas'
                ? 'bg-[#4D76B4] text-white shadow-xs'
                : 'text-[#2A2A2A] hover:bg-white/70'
            }`}
          >
            Todas las publicaciones
          </button>
          <button
            onClick={() => setActiveDivisionTab('psicologo_psicologo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeDivisionTab === 'psicologo_psicologo'
                ? 'bg-[#4D76B4] text-white shadow-xs'
                : 'text-[#2A2A2A] hover:bg-white/70'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#FFE571]" />
            <span>Vlog Psicólogo - Psicólogo (Técnico)</span>
          </button>
          <button
            onClick={() => setActiveDivisionTab('psicologo_paciente')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeDivisionTab === 'psicologo_paciente'
                ? 'bg-[#4D76B4] text-white shadow-xs'
                : 'text-[#2A2A2A] hover:bg-white/70'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#4D94FF]" />
            <span>Vlog Psicólogo - Paciente (Experiencias)</span>
          </button>
        </div>

        <div className="text-[11px] text-[#91A7BB] font-medium hidden md:block">
          Todos los artículos son públicos y abiertos para lectura
        </div>
      </div>

      {/* Pre-moderation notification banner if just submitted */}
      {submissionSuccessNotice && (
        <div className="p-4 rounded-2xl bg-[#FFE571]/20 border border-[#FFE571] flex items-center justify-between gap-3 text-xs text-[#2A2A2A] animate-in fade-in">
          <div className="flex items-center gap-2">
            <Hourglass className="w-4 h-4 text-[#4D76B4] flex-shrink-0" />
            <span>{submissionSuccessNotice}</span>
          </div>
          <button
            onClick={() => setSubmissionSuccessNotice(null)}
            className="p-1 rounded-lg hover:bg-black/5 text-[#91A7BB]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Categories */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-[#91A7BB]/30 shadow-xs">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#91A7BB] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título, autor o palabra clave..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#91A7BB]/30 text-sm focus:outline-hidden focus:border-[#4D76B4] text-[#2A2A2A]"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c
                  ? 'bg-[#4D76B4] text-white shadow-2xs font-bold'
                  : 'bg-[#91A7BB]/10 text-[#2A2A2A] hover:bg-[#91A7BB]/20'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleArticles.map((article) => {
          const isPending = article.status === 'pending_review';
          return (
            <article
              key={article.id}
              className={`bg-white rounded-3xl border border-[#91A7BB]/30 p-6 flex flex-col justify-between space-y-4 cursor-pointer group shadow-xs hover:border-[#4D76B4]/50 hover:shadow-md transition-all ${
                isPending ? 'border-2 border-amber-300 bg-amber-50/20' : ''
              }`}
              onClick={() => setActiveArticleModal(article)}
            >
              <div className="space-y-3">
                {/* Image if available */}
                {article.imageUrl && (
                  <div className="w-full h-44 rounded-2xl overflow-hidden bg-gray-100 border border-[#91A7BB]/20">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    article.vlogType === 'psicologo_psicologo'
                      ? 'bg-[#4D76B4]/15 text-[#4D76B4]'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {article.vlogType === 'psicologo_psicologo' ? 'Psicólogo - Psicólogo' : 'Psicólogo - Paciente'}
                  </span>
                  {isPending && (
                    <span className="text-[10px] font-bold bg-[#FFE571] text-[#2A2A2A] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Hourglass className="w-3 h-3 text-[#4D76B4]" /> En Revisión
                    </span>
                  )}
                  <span className="text-xs text-[#91A7BB] flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#4D94FF]" />
                    {article.readTimeMinutes} min
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#2A2A2A] group-hover:text-[#4D76B4] transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-[#2A2A2A]/75 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {article.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-[#91A7BB]/10 text-[#2A2A2A]/80 px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#91A7BB]/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#4D76B4] text-white flex items-center justify-center text-xs font-bold">
                    {article.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#2A2A2A] flex items-center gap-1">
                      <span>{article.authorName}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-gray-100 text-[#91A7BB]">
                        {article.authorRole}
                      </span>
                    </div>
                    {article.authorFpv && (
                      <div className="text-[10px] font-semibold text-[#4D76B4]">
                        {article.authorFpv}
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-xs font-bold text-[#4D76B4] group-hover:underline">
                  Leer y Comentar →
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {visibleArticles.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-[#91A7BB]/30 p-8 space-y-2">
          <BookOpen className="w-8 h-8 text-[#91A7BB] mx-auto" />
          <h4 className="font-bold text-[#2A2A2A]">No hay artículos en esta división</h4>
          <p className="text-xs text-[#91A7BB]">Selecciona "Todas las publicaciones" o prueba con otra categoría.</p>
        </div>
      )}

      {/* ARTICLE READER MODAL WITH THREADED REDDIT-STYLE COMMENTS */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A2A2A]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-[#91A7BB]/30 max-h-[92vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200 space-y-6">
            <button
              onClick={() => {
                setActiveArticleModal(null);
                setCommentReplyParentId(null);
              }}
              className="absolute top-6 right-6 p-2 rounded-full text-[#91A7BB] hover:text-[#2A2A2A] hover:bg-gray-100"
              aria-label="Cerrar artículo"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Banner Image if available */}
            {activeArticleModal.imageUrl && (
              <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-sm border border-[#91A7BB]/20">
                <img
                  src={activeArticleModal.imageUrl}
                  alt={activeArticleModal.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Top Meta */}
            <div className="space-y-3 pb-6 border-b border-[#91A7BB]/20">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#4D76B4]/10 text-[#4D76B4]">
                  {activeArticleModal.category}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  activeArticleModal.vlogType === 'psicologo_psicologo'
                    ? 'bg-[#4D76B4]/15 text-[#4D76B4]'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {activeArticleModal.vlogType === 'psicologo_psicologo' ? 'División Psicólogo-Psicólogo' : 'División Psicólogo-Paciente'}
                </span>
                {activeArticleModal.status === 'pending_review' && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFE571] text-[#2A2A2A] font-bold">
                    En Revisión Previa por el admi
                  </span>
                )}
                <span className="text-xs text-[#91A7BB] flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#4D76B4]" />
                  {activeArticleModal.readTimeMinutes} min de lectura
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#2A2A2A] leading-tight">
                {activeArticleModal.title}
              </h1>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-[#4D76B4] text-white flex items-center justify-center text-sm font-bold shadow-xs">
                  {activeArticleModal.authorName.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2A2A2A] flex items-center gap-2">
                    <span>{activeArticleModal.authorName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#FFE571] text-[#2A2A2A] text-[10px] font-bold">
                      {activeArticleModal.authorRole}
                    </span>
                  </div>
                  {activeArticleModal.authorFpv && (
                    <div className="text-xs text-[#4D76B4] font-bold">
                      {activeArticleModal.authorFpv} • Colegiado Oficial
                    </div>
                  )}
                </div>
              </div>

              {/* Admin-only insight into real author if posted anonymously */}
              {(currentUser.role === 'SuperAdmin' || currentUser.role === 'Moderador') && activeArticleModal.isAnonymous && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>
                    <strong>Identidad verificada por admi:</strong> Publicado en anónimo por{' '}
                    <strong>{activeArticleModal.realAuthorName || 'Usuario'}</strong> ({activeArticleModal.realAuthorEmail || 'Sin email registrado'}).
                  </span>
                </div>
              )}
            </div>

            {/* Excerpt callout */}
            <div className="p-4 rounded-2xl bg-[#4D76B4]/5 border-l-4 border-[#4D76B4] text-sm text-[#2A2A2A] italic leading-relaxed">
              "{activeArticleModal.excerpt}"
            </div>

            {/* Content */}
            <div className="text-sm text-[#2A2A2A]/90 leading-relaxed space-y-4 whitespace-pre-wrap font-body">
              {activeArticleModal.content}
            </div>

            {/* Academic References */}
            {activeArticleModal.references.length > 0 && (
              <div className="pt-6 border-t border-[#91A7BB]/20 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#4D76B4] flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4" />
                  Referencias Bibliográficas & Evidencia Científica
                </h4>
                <ul className="space-y-2 text-xs text-[#2A2A2A]/75">
                  {activeArticleModal.references.map((ref, idx) => (
                    <li key={idx} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 font-mono text-[11px]">
                      {ref}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* REDDIT-STYLE THREADED COMMENTS (WITHOUT LIKE/DISLIKE VOTING) */}
            <div className="pt-6 border-t border-[#91A7BB]/20 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-[#2A2A2A] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#4D76B4]" />
                  <span>Discusión & Orientación Clínica (Hilo Estilo Foro)</span>
                </h3>
                <span className="text-xs text-[#91A7BB]">
                  Sin votos ni likes • Foco en contenido clínico
                </span>
              </div>

              {/* Comments tree */}
              <div className="space-y-3">
                {(!activeArticleModal.comments || activeArticleModal.comments.length === 0) ? (
                  <div className="p-4 rounded-2xl bg-gray-50 text-center text-xs text-[#91A7BB]">
                    Sé el primero en compartir tu experiencia o brindar orientación conductual.
                  </div>
                ) : (
                  activeArticleModal.comments.map((comment) => {
                    const isPsych = comment.authorRole === 'Psicologo' || comment.authorRole === 'SuperAdmin';
                    return (
                      <div
                        key={comment.id}
                        className={`p-3.5 rounded-2xl text-xs space-y-2 border ${
                          isPsych
                            ? 'bg-[#4D76B4]/5 border-[#4D76B4]/30'
                            : 'bg-white border-[#91A7BB]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#2A2A2A]">{comment.authorName}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isPsych ? 'bg-[#FFE571] text-[#2A2A2A]' : 'bg-gray-100 text-[#91A7BB]'
                            }`}>
                              {comment.authorRole === 'SuperAdmin' ? 'admi' : comment.authorRole}
                            </span>
                            {comment.fpvNumber && (
                              <span className="text-[10px] font-semibold text-[#4D76B4]">
                                FPV {comment.fpvNumber}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#91A7BB]">{comment.createdAt}</span>
                        </div>

                        <p className="text-xs text-[#2A2A2A]/85 leading-relaxed pl-1">
                          {comment.content}
                        </p>

                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          <button
                            onClick={() => setCommentReplyParentId(comment.id)}
                            className="text-[#4D76B4] font-bold hover:underline flex items-center gap-1"
                          >
                            <CornerDownRight className="w-3 h-3" /> Responder
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add comment input form */}
              <form onSubmit={handleSendComment} className="pt-2 space-y-2">
                {commentReplyParentId && (
                  <div className="flex items-center justify-between text-xs bg-[#4D76B4]/10 text-[#4D76B4] p-2 rounded-xl">
                    <span>Respondiendo en el hilo al comentario seleccionado</span>
                    <button
                      type="button"
                      onClick={() => setCommentReplyParentId(null)}
                      className="font-bold hover:underline"
                    >
                      Cancelar respuesta
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Escribe tu comentario, experiencia u orientación psicológica..."
                    className="flex-1 px-3.5 py-2.5 rounded-2xl border border-[#91A7BB]/40 text-xs focus:outline-hidden focus:border-[#4D76B4]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#4D76B4] text-white font-bold text-xs rounded-2xl hover:bg-[#3d629a] transition-all flex items-center justify-center gap-1 self-end"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publicar</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => {
                  setActiveArticleModal(null);
                  setCommentReplyParentId(null);
                }}
                className="px-6 py-2.5 rounded-2xl bg-[#4D76B4] text-white text-xs font-bold"
              >
                Cerrar Artículo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW ARTICLE MODAL */}
      {showNewArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A2A2A]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#91A7BB]/30 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setShowNewArticleModal(false);
                setValidationWarning(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-[#91A7BB] hover:text-[#2A2A2A] hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-[#2A2A2A] mb-1">
              Publicar Artículo o Experiencia en El Vlog
            </h3>
            <p className="text-xs text-[#91A7BB] mb-4">
              Autor: <strong>{currentUser.name}</strong> ({currentUser.role}) • Todo manuscrito será monitoreado y aprobado por el admi antes de su difusión.
            </p>

            {validationWarning && (
              <div className="p-3.5 mb-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{validationWarning}</span>
              </div>
            )}

            <form onSubmit={handleCreateArticleSubmit} className="space-y-4">
              {/* Division Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                  División de Publicación *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={!canPostPsychDivision}
                    onClick={() => setVlogType('psicologo_psicologo')}
                    className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                      vlogType === 'psicologo_psicologo'
                        ? 'bg-[#4D76B4] text-white border-[#4D76B4] font-bold shadow-xs'
                        : canPostPsychDivision
                        ? 'bg-gray-50 border-[#91A7BB]/30 text-[#2A2A2A] hover:bg-gray-100'
                        : 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-500'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Psicólogo - Psicólogo</span>
                    </div>
                    <span className="text-[10px] block opacity-85 mt-0.5">
                      Ensayos técnicos, metacontingencias y divulgación científica con citas obligatorias.
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={!canPostCommunityDivision}
                    onClick={() => setVlogType('psicologo_paciente')}
                    className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                      vlogType === 'psicologo_paciente'
                        ? 'bg-[#4D76B4] text-white border-[#4D76B4] font-bold shadow-xs'
                        : 'bg-gray-50 border-[#91A7BB]/30 text-[#2A2A2A] hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Psicólogo - Paciente</span>
                    </div>
                    <span className="text-[10px] block opacity-85 mt-0.5">
                      Experiencias personales, vivencias de consultantes y orientaciones de especialistas.
                    </span>
                  </button>
                </div>
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                  Categoría Epistemológica *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4] bg-white text-[#2A2A2A]"
                >
                  <option value="Análisis de la Conducta">Análisis de la Conducta</option>
                  <option value="Terapias Contextuales (ACT/DBT)">Terapias Contextuales (ACT/DBT)</option>
                  <option value="Interconductismo">Interconductismo</option>
                  <option value="Psicología Basada en Evidencia">Psicología Basada en Evidencia</option>
                </select>
              </div>

              {/* Image URL input & preview */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#4D76B4]" />
                  <span>Imagen o Gráfico Ilustrativo (URL Opcional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-... o URL directa"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#91A7BB]/40 text-xs focus:outline-hidden focus:border-[#4D76B4]"
                />
                {imageUrl.trim() && (
                  <div className="mt-2 h-32 w-full rounded-xl overflow-hidden border border-[#91A7BB]/30 bg-gray-50">
                    <img
                      src={imageUrl}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Título */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                  Título de la Publicación *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. He vivido con depresión 10 años y esta ha sido mi experiencia con activación conductual"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                />
              </div>

              {/* Resumen */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                  Resumen o Síntesis *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Breve resumen de 2-3 líneas para la tarjeta..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                />
              </div>

              {/* Cuerpo */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                  Cuerpo Completo del Artículo *
                </label>
                <textarea
                  required
                  rows={7}
                  placeholder="Redacta el desarrollo fundamentado en principios de aprendizaje o tu experiencia contextual..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                    Etiquetas (separadas por coma)
                  </label>
                  <input
                    type="text"
                    placeholder="ACT, Conductismo, Depresión"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4D76B4] mb-1">
                    Citas Científicas Obligatorias (para psicólogos)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Skinner (1953), Martell et al. (2010), Hayes (2011)..."
                    value={referencesInput}
                    onChange={(e) => setReferencesInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#91A7BB]/40 text-sm focus:outline-hidden focus:border-[#4D76B4]"
                  />
                </div>
              </div>

              {/* Anonymity Checkbox */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-[#91A7BB]/30 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="vlogIsAnonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="mt-0.5 rounded text-[#4D76B4]"
                />
                <label htmlFor="vlogIsAnonymous" className="text-xs text-[#2A2A2A] cursor-pointer">
                  <strong>Publicar de forma Anónima:</strong> Tu nombre público se mostrará como "Anónimo" ante la comunidad, pero tu identidad quedará registrada de forma confidencial para el admi en el panel de control.
                </label>
              </div>

              <div className="p-3 rounded-2xl bg-[#4D76B4]/10 text-xs text-[#4D76B4] font-medium">
                <strong>Aviso de Pre-Moderación:</strong> Todos los manuscritos son enviados a la bandeja de revisión previa del admi (Andrés Rojas) para su validación científica antes de aparecer públicamente en El Vlog.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewArticleModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#2A2A2A] hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#4D76B4] text-white font-bold text-xs shadow-sm hover:bg-[#3d629a]"
                >
                  Enviar a Revisión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
