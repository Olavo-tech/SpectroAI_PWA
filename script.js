import {marked} from "marked";

// -- Conversation state
let conversationHistory = [];
let savedConversations = JSON.parse(localStorage.getItem('spectroConversations') || '[]');
const chatArea = document.getElementById('chat');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const genBtn = document.getElementById('gen-btn');
const inputBar = document.getElementById('input-bar');

// -- Side Menu elements
const menuButton = document.getElementById('menu-button');
const sideMenu = document.getElementById('side-menu');
const menuOverlay = document.getElementById('menu-overlay');
const languageSelect = document.getElementById('language-select');
const aiModeSelect = document.getElementById('ai-mode-select');
const resetButton = document.getElementById('reset-button');
const historyList = document.getElementById('history-list');
const fileInput = document.getElementById('file-input');
const fileBtn = document.getElementById('file-btn');
const selectedFilesContainer = document.getElementById('selected-files');

// -- Image modal elements
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalCloseBtn = document.getElementById('modal-close-btn');

// -- Message bar elements
const optionsBtn = document.getElementById('options-btn');
const optionsDropdown = document.getElementById('options-dropdown');
const clearChatBtn = document.getElementById('clear-chat-btn');
const changeLanguageBtn = document.getElementById('change-language-btn');
const createImageBtn = document.getElementById('create-image-btn');
const settingsBtn = document.getElementById('settings-btn');

// -- AI State
let currentAiMode = localStorage.getItem('spectroAiMode') || 'spectro';
let currentLanguage = localStorage.getItem('spectroLanguage') || 'en';

// -- File handling state
let selectedFiles = [];

const MAX_FILE_SIZE_MB = 10;

const MAX_FILES = 5;

const BUTTON_HOVER_INTENSITY = 1.2;

const BUTTON_CLICK_SCALE = 1.05;

const SEND_BUTTON_SHADOW_SPREAD = 0.4;

const GEN_BUTTON_SHADOW_SPREAD = 0.3;

const SCROLL_BUTTON_SIZE = 48;

const SCROLL_BUTTON_OPACITY = 0.7;

const BUTTON_GLOW_INTENSITY = 0.5;

const IMAGE_MODE_TRANSITION_DURATION = 290; // milliseconds

const BUTTON_FADE_OPACITY = {
    start: 0,    // Starting opacity when transitioning
    end: 1       // Final opacity when fully visible
};

const BUTTON_TRANSITION_SCALE = {
    start: 0.9,  // Initial scale when appearing
    end: 1       // Final scale when fully visible
};

let temporaryChatFirstTimeModalShown = localStorage.getItem('temporaryChatFirstTimeModalShown') === 'true';
let isImageCreationMode = false;

const MAX_SAVED_CONVERSATIONS = 10;

const TEMPORARY_CHAT_TOGGLE_FADE_DURATION = 405; // milliseconds

// -- Translations
const SUPPORTED_LANGUAGES = [
  { 
    code: 'en', 
    name: 'English',
    displayName: 'English' 
  },
  { 
    code: 'es', 
    name: 'Español',
    displayName: 'Español' 
  },
  { 
    code: 'it', 
    name: 'Italiano',
    displayName: 'Italiano' 
  },
  { 
    code: 'pt', 
    name: 'Português',
    displayName: 'Português' 
  },
  { 
    code: 'zh', 
    name: '中文',
    displayName: '中文' 
  },
  { 
    code: 'ko', 
    name: '한국어',
    displayName: '한국어' 
  },
  { 
    code: 'ja', 
    name: '日本語',
    displayName: '日本語' 
  },
  { 
    code: 'fr', 
    name: 'Français',
    displayName: 'Français' 
  },
  { 
    code: 'ar', 
    name: 'العربية',
    displayName: 'العربية' 
  }
];

const DEFAULT_LANGUAGE = 'en';

const translations = {
    en: {
        appTitle: "Spectro AI",
        menuButtonLabel: "Open menu",
        aiModeTitle: "AI Mode",
        spectroAi: "Spectro AI (Standard)",
        lightAi: "Spectro Direct",
        proAi: "Spectro Advanced",
        languageTitle: "Language",
        historyTitle: "Conversation History",
        resetButton: "Reset Chat",
        inputPlaceholder: "Ask me anything…",
        sendButton: "Send",
        genButton: "Create",
        noHistory: "No saved conversations yet.",
        deleteConfirm: "Are you sure you want to delete this conversation?",
        renameButtonTitle: "Rename",
        deleteButtonTitle: "Delete",
        assistantTyping: "Assistant is typing",
        errorMessage: "Sorry, I encountered an error.",
        resetConfirmMessage: "Are you sure you want to reset the chat? This will clear all messages.",
        clearChatOption: "Clear Chat",
        changeLanguageOption: "Change Language",
        createImageOption: "Create Image",
        settingsOption: "Settings",
        answerQuestions: "Answer Questions",
        attachFileOption: 'Pin',
        temporaryChatOption: 'Temporary Chat',
        normalChatOption: 'Normal Chat',
        aiModelsOption: "AI Models",
        imageCreationDisabled: "Image creation is currently disabled."
    },
    es: {
        appTitle: "Spectro AI",
        menuButtonLabel: "Abrir menú",
        aiModeTitle: "Modo IA",
        spectroAi: "Spectro AI (Estándar)",
        lightAi: "Spectro Directo",
        proAi: "Spectro Avanzado",
        languageTitle: "Idioma",
        historyTitle: "Historial de conversaciones",
        resetButton: "Reiniciar Chat",
        inputPlaceholder: "Pregúntame cualquier cosa…",
        sendButton: "Enviar",
        genButton: "Crear",
        noHistory: "Aún no hay conversaciones guardadas.",
        deleteConfirm: "¿Estás seguro de que quieres eliminar esta conversación?",
        renameButtonTitle: "Renombrar",
        deleteButtonTitle: "Eliminar",
        assistantTyping: "El asistente está escribiendo",
        errorMessage: "Lo siento, encontré un error.",
        resetConfirmMessage: "¿Estás seguro de que quieres reiniciar el chat? Esto borrará todos los mensajes.",
        clearChatOption: "Limpiar Chat",
        changeLanguageOption: "Cambiar Idioma",
        createImageOption: "Crear Imagen",
        settingsOption: "Configuración",
        answerQuestions: "Responder Preguntas",
        attachFileOption: 'Fijar',
        temporaryChatOption: 'Chat Temporal',
        normalChatOption: 'Chat Normal',
        aiModelsOption: "Modelos de IA",
        imageCreationDisabled: "La creación de imágenes está actualmente deshabilitada."
    },
    it: {
        appTitle: "Spectro AI",
        menuButtonLabel: "Apri menu",
        aiModeTitle: "Modalità AI",
        spectroAi: "Spectro AI (Standard)",
        lightAi: "Spectro Veloce",
        proAi: "Spectro Avanzato",
        languageTitle: "Lingua",
        historyTitle: "Cronologia conversazioni",
        resetButton: "Reinizia chat",
        inputPlaceholder: "Chiedimi qualcosa…",
        sendButton: "Invia",
        genButton: "Crea",
        noHistory: "Nessuna conversazione salvata.",
        deleteConfirm: "Sei sicuro di voler eliminare questa conversazione?",
        renameButtonTitle: "Rinomina",
        deleteButtonTitle: "Elimina",
        assistantTyping: "L'assistente sta scrivendo",
        errorMessage: "Spiacente, si è verificato un errore.",
        resetConfirmMessage: "Sei sicuro di voler reimpostare la chat? Cela cancellerà tutti i messaggi.",
        clearChatOption: "Cancella Chat",
        changeLanguageOption: "Cambia Lingua",
        createImageOption: "Crea Immagine",
        settingsOption: "Impostazioni",
        answerQuestions: "Rispondere alle Domande",
        attachFileOption: 'Fissa',
        temporaryChatOption: 'Chat Temporanea',
        normalChatOption: 'Chat Normale',
        aiModelsOption: "Modelli IA",
        imageCreationDisabled: "La creazione di immagini è attualmente disabilitata."
    },
    pt: {
        appTitle: "Spectro AI",
        menuButtonLabel: "Abrir menu",
        aiModeTitle: "Modo IA",
        spectroAi: "Spectro AI (Padrão)",
        lightAi: "Spectro Rápido",
        proAi: "Spectro Avançado",
        languageTitle: "Idioma",
        historyTitle: "Histórico de Conversas",
        resetButton: "Reiniciar Chat",
        inputPlaceholder: "Pergunte-me qualquer coisa…",
        sendButton: "Enviar",
        genButton: "Criar",
        noHistory: "Nenhuma conversa salva ainda.",
        deleteConfirm: "Tem certeza que deseja excluir esta conversa?",
        renameButtonTitle: "Renomear",
        deleteButtonTitle: "Excluir",
        assistantTyping: "O assistente está digitando",
        errorMessage: "Desculpe, encontrei um erro.",
        resetConfirmMessage: "Tem certeza que deseja reiniciar o chat? Isso apagará todas as mensagens.",
        clearChatOption: "Limpar Chat",
        changeLanguageOption: "Alterar Idioma",
        createImageOption: "Criar Imagem",
        settingsOption: "Configurações",
        answerQuestions: "Responder Perguntas",
        attachFileOption: 'Fixar',
        temporaryChatOption: 'Chat Temporário',
        normalChatOption: 'Chat Normal',
        aiModelsOption: "Modelos de IA",
        imageCreationDisabled: "A criação de imagens está atualmente desabilitada."
    },
    zh: {
        appTitle: "Spectro AI",
        menuButtonLabel: "打开菜单",
        aiModeTitle: "AI 模式",
        spectroAi: "Spectro AI (标准)",
        lightAi: "Spectro 快速",
        proAi: "Spectro 高级",
        languageTitle: "语言",
        historyTitle: "对话历史",
        resetButton: "重置聊天",
        inputPlaceholder: "问我任何事…",
        sendButton: "发送",
        genButton: "创建",
        noHistory: "暂无保存的对话。",
        deleteConfirm: "确定要删除此对话吗？",
        renameButtonTitle: "重命名",
        deleteButtonTitle: "删除",
        assistantTyping: "助手正在输入",
        errorMessage: "抱歉，发生了一个错误。",
        resetConfirmMessage: "确定要重置聊天吗？这将清除所有消息。",
        clearChatOption: "清除聊天",
        changeLanguageOption: "更改语言",
        createImageOption: "创建图像",
        settingsOption: "设置",
        answerQuestions: "回答问题",
        attachFileOption: '固定',
        temporaryChatOption: '临时聊天',
        normalChatOption: '正常聊天',
        aiModelsOption: "AI模型",
        imageCreationDisabled: "图像创建目前已禁用。"
    },
    ko: {
        appTitle: "Spectro AI",
        menuButtonLabel: "메뉴 열기",
        aiModeTitle: "AI 모드",
        spectroAi: "Spectro AI (표준)",
        lightAi: "Spectro 빠름",
        proAi: "Spectro 고급",
        languageTitle: "언어",
        historyTitle: "대화 기록",
        resetButton: "채팅 초기화",
        inputPlaceholder: "무엇이든 물어보세요…",
        sendButton: "전송",
        genButton: "생성",
        noHistory: "저장된 대화가 없습니다.",
        deleteConfirm: "이 대화를 삭제하시겠습니까?",
        renameButtonTitle: "이름 변경",
        deleteButtonTitle: "삭제",
        assistantTyping: "어시스턴트가 입력 중입니다",
        errorMessage: "죄송합니다. 오류가 발생했습니다.",
        resetConfirmMessage: "채팅을 초기화 하시겠습니까? 이것은 모든 메시지를 지워 버릴 것입니다.",
        clearChatOption: "채팅 삭제",
        changeLanguageOption: "언어 변경",
        createImageOption: "이미지 생성",
        settingsOption: "설정",
        answerQuestions: "질문에 답변",
        attachFileOption: '고정',
        temporaryChatOption: '임시 채팅',
        normalChatOption: '정상 채팅',
        aiModelsOption: "AI 모델",
        imageCreationDisabled: "이미지 생성이 현재 비활성화되어 있습니다."
    },
    ja: {
        appTitle: "Spectro AI",
        menuButtonLabel: "メニューを開く",
        aiModeTitle: "AI モード",
        spectroAi: "Spectro AI (標準)",
        lightAi: "Spectro 高速",
        proAi: "Spectro 高度",
        languageTitle: "言語",
        historyTitle: "会話履歴",
        resetButton: "チャットをリセット",
        inputPlaceholder: "何でも聞いてください…",
        sendButton: "送信",
        genButton: "生成",
        noHistory: "保存された会話はありません。",
        deleteConfirm: "この会話を削除してもよろしいですか？",
        renameButtonTitle: "名前を変更",
        deleteButtonTitle: "削除",
        assistantTyping: "アシスタントが入力中",
        errorMessage: "申し訳ありません、エラーが発生しました。",
        resetConfirmMessage: "チャットをリセットしますか？これによりすべてのメッセージが削除されます。",
        clearChatOption: "チャットをクリア",
        changeLanguageOption: "言語を変更",
        createImageOption: "画像を作成",
        settingsOption: "設定",
        answerQuestions: "質問に答える",
        attachFileOption: '固定',
        temporaryChatOption: '臨時チャット',
        normalChatOption: '通常チャット',
        aiModelsOption: "AIモデル",
        imageCreationDisabled: "画像作成は現在無効になっています。"
    },
    fr: {
        appTitle: "Spectro AI",
        menuButtonLabel: "Ouvrir le menu",
        aiModeTitle: "Mode IA",
        spectroAi: "Spectro IA (Standard)",
        lightAi: "Spectro Rapide",
        proAi: "Spectro Avancé",
        languageTitle: "Langue",
        historyTitle: "Historique des conversations",
        resetButton: "Réinitialiser le chat",
        inputPlaceholder: "Posez-moi n'importe quoi…",
        sendButton: "Envoyer",
        genButton: "Créer",
        noHistory: "Aucune conversation enregistrée.",
        deleteConfirm: "Voulez-vous vraiment supprimer cette conversation ?",
        renameButtonTitle: "Renommer",
        deleteButtonTitle: "Supprimer",
        assistantTyping: "L'assistant est en train d'écrire",
        errorMessage: "Désolé, une erreur s'est produite.",
        resetConfirmMessage: "Voulez-vous vraiment réinitialiser le chat ? Cela supprimera tous les messages.",
        clearChatOption: "Effacer le Chat",
        changeLanguageOption: "Changer de Langue",
        createImageOption: "Créer une Image",
        settingsOption: "Paramètres",
        answerQuestions: "Répondre aux Questions",
        attachFileOption: 'Épingler',
        temporaryChatOption: 'Chat Temporaire',
        normalChatOption: 'Chat Normal',
        aiModelsOption: "Modèles IA",
        imageCreationDisabled: "La création d'images est actuellement désactivée."
    },
    ar: {
        appTitle: "Spectro AI",
        menuButtonLabel: "فتح القائمة",
        aiModeTitle: "وضع الذكاء الاصطناعي",
        spectroAi: "سبيكترو AI (قياسي)",
        lightAi: "سبيكترو سريع",
        proAi: "سبيكترو متقدم",
        languageTitle: "اللغة",
        historyTitle: "سجل المحادثات",
        resetButton: "إعادة تعيين الدردشة",
        inputPlaceholder: "اسألني أي شيء…",
        sendButton: "إرسال",
        genButton: "إنشاء",
        noHistory: "لا توجد محادثات محفوظة بعد.",
        deleteConfirm: "هل أنت متأكد أنك تريد حذف هذه المحادثة؟",
        renameButtonTitle: "إعادة تسمية",
        deleteButtonTitle: "حذف",
        assistantTyping: "المساعد يكتب",
        errorMessage: "عذراً، حدث خطأ.",
        resetConfirmMessage: "هل أنت متأكد أنك تريد إعادة تعيين الدردشة؟ هذا سوف يحذف جميع الرسائل.",
        clearChatOption: "مسح الدردشة",
        changeLanguageOption: "تغيير اللغة",
        createImageOption: "إنشاء صورة",
        settingsOption: "الإعدادات",
        answerQuestions: "الإجابة على الأسئلة",
        attachFileOption: 'تثبيت',
        temporaryChatOption: 'دردشة مؤقتة',
        normalChatOption: 'دردشة عادية',
        aiModelsOption: "نماذج الذكاء الاصطناعي",
        imageCreationDisabled: "إنشاء الصور معطل حاليًا."
    }
    // Add other language translations here
};

/**
 * @typedef {Object} AIMode
 * @property {string} id
 * @property {string} name
 * @property {string} systemPrompt
 * @property {boolean} canGenerateImages
 * @property {boolean} [canGenerateVideos] 
 */

// --- AI Modes Definition ---
/**
 * List of AI modes for user to choose in the AI Models menu.
 * @tweakable List of available AI modes in the models menu
 */
const AI_MODES = [
  {
    id: 'spectro',
    name: 'Spectro Standard',
    /**
     * @tweakable System prompt for Standard AI mode
     */
    systemPrompt: `You are Spectro AI, a general-purpose assistant who can discuss a wide range of topics. Respond helpfully and comprehensively.`,
    /**
     * @tweakable Whether this mode supports image generation
     */
    canGenerateImages: true
  },
  {
    id: 'light',
    name: 'Spectro Short Response',
    /**
     * @tweakable System prompt for Short Response AI mode
     */
    systemPrompt: `You are the Short Response AI. Give concise, direct answers in 1-3 sentences. Focus on clarity and brevity.`,
    /**
     * @tweakable Whether this mode supports image generation
     */
    canGenerateImages: true
  },
  {
    id: 'pro',
    name: 'Spectro Advanced',
    /**
     * @tweakable System prompt for Advanced AI mode
     */
    systemPrompt: `You are the Advanced AI. Provide in-depth, nuanced, and comprehensive responses. Use technical language and detailed explanations.`,
    /**
     * @tweakable Whether this mode supports image generation
     */
    canGenerateImages: true
  },
  {
    id: 'teacher',
    name: 'Spectro Teacher',
    /**
     * @tweakable System prompt for Educational AI mode
     */
    systemPrompt: `You are an educational AI assistant. Focus solely on academic and educational topics. Explain concepts pedagogically, provide learning resources, and offer educational guidance. Do not discuss non-educational matters.`,
    /**
     * @tweakable Whether this mode supports image generation
     */
    canGenerateImages: false
  },
  {
    id: 'medical',
    name: 'Spectro Medical',
    /**
     * @tweakable System prompt for Medical AI mode
     */
    systemPrompt: `You are a medical information assistant. Discuss only health, medical, and biological topics. Provide scientifically accurate information. IMPORTANT: Always include a disclaimer that this is not a substitute for professional medical advice, and users should consult healthcare professionals for diagnosis or treatment.`,
    /**
     * @tweakable Whether this mode supports image generation
     */
    canGenerateImages: false
  },
  {
    id: 'coach',
    name: 'Spectro Friendly',
    /**
     * @tweakable System prompt for Friendly AI mode
     */
    systemPrompt: `You are a supportive, empathetic life coach and personal development assistant. Provide emotional support, motivation, and guidance on personal growth, mental wellness, and interpersonal relationships.`,
    /**
     * @tweakable Whether this mode supports image generation
     */
    canGenerateImages: false
  },
  {
    id: 'creative',
    name: 'Spectro Creative',
    /**
     * @tweakable System prompt for Creative AI mode (images only)
     */
    systemPrompt: `You are Spectro Creative, an imaginative AI assistant. Create visually engaging images based on user prompts. Blend creativity and innovation in the generated images.`,
    /**
     * @tweakable Whether this mode supports video generation (should be false for Creative mode)
     */
    canGenerateVideos: false,
    /**
     * @tweakable Whether this mode supports image generation
     */
    canGenerateImages: true
  }
];

// --- AI Mode name translations ---
const aiModelDisplayNames = {
  en: {
    spectro: "Spectro Standard",
    light: "Spectro Short Response",  
    pro: "Spectro Advanced",
    teacher: "Spectro Teacher",
    medical: "Spectro Medical",
    coach: "Spectro Friendly",
    creative: "Spectro Creative"  
  },
  es: {
    spectro: "Spectro Estándar",
    light: "Spectro Respuesta Corta",
    pro: "Spectro Avanzado",
    teacher: "Spectro Maestro",
    medical: "Spectro Médico",
    coach: "Spectro Amigable",
    creative: "Spectro Creativo"
  },
  pt: {
    spectro: "Spectro Padrão",
    light: "Spectro Resposta Curta",
    pro: "Spectro Avançado",
    teacher: "Spectro Professor",
    medical: "Spectro Médico",
    coach: "Spectro Amigável",
    creative: "Spectro Criativo"
  },
  // ...add more if desired...
};

function getModelName(modelId) {
  return aiModelDisplayNames[currentLanguage]?.[modelId]
    || aiModelDisplayNames[DEFAULT_LANGUAGE][modelId]
    || modelId;
}

function populateLanguageSelect() {
  languageSelect.innerHTML = '';
  SUPPORTED_LANGUAGES.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang.code;
    option.textContent = lang.displayName;
    languageSelect.appendChild(option);
  });
}

function setLanguage(langCode) {
  if (translations[langCode]) {
    currentLanguage = langCode;
    localStorage.setItem('spectroLanguage', currentLanguage);
    applyTranslations();
    console.log("Language set to:", langCode);
  } else {
    console.warn("Unsupported language code:", langCode);
    currentLanguage = DEFAULT_LANGUAGE;
  }
}

// Enhanced translation function with fallback
function getTranslation(key, replacements = {}) {
  let translation = translations[currentLanguage]?.[key] || 
                    translations[DEFAULT_LANGUAGE][key] || 
                    key;
  
  // Replace placeholders
  Object.keys(replacements).forEach(placeholder => {
    translation = translation.replace(`{${placeholder}}`, replacements[placeholder]);
  });
  
  return translation;
}

function applyTranslations() {
  // Add more comprehensive translation points
  document.title = getTranslation('appTitle');
  
  // Header translations
  menuButton.setAttribute('aria-label', getTranslation('menuButtonLabel'));
  
  // Menu section translations
  document.querySelectorAll('.menu-section h3').forEach((header, index) => {
    const translationKeys = [
      'aiModeTitle', 
      'languageTitle', 
      'historyTitle'
    ];
    header.textContent = getTranslation(translationKeys[index]);
  });
  
  // Reset and other buttons
  resetButton.textContent = getTranslation('resetButton');
  
  // Input and send buttons
  userInput.setAttribute('placeholder', getTranslation('inputPlaceholder'));
  sendBtn.textContent = getTranslation('sendButton');
  sendBtn.setAttribute('aria-label', getTranslation('sendButton'));
  genBtn.textContent = getTranslation('genButton');
  genBtn.setAttribute('aria-label', getTranslation('genButton'));
  
  // Other dynamic elements
  populateHistoryList();
  
  // Translate dropdown menu items
  createDropdownIcons();
}

// Add language selection change handler
languageSelect.addEventListener('change', (e) => {
  setLanguage(e.target.value);
});

// Initialize language
setLanguage(localStorage.getItem('spectroLanguage') || DEFAULT_LANGUAGE);
populateLanguageSelect();

function createOptionsDropdown() {
    const DROPDOWN_POSITION = {
        bottom: '100%',
        left: '0',
        right: 'auto'
    };

    const DROPDOWN_Z_INDEX = 100;

    optionsDropdown.style.position = 'absolute';
    optionsDropdown.style.bottom = DROPDOWN_POSITION.bottom;
    optionsDropdown.style.left = DROPDOWN_POSITION.left;
    optionsDropdown.style.right = DROPDOWN_POSITION.right;
    optionsDropdown.style.zIndex = DROPDOWN_Z_INDEX;

    // Adjust dropdown positioning relative to options button
    optionsBtn.style.position = 'relative';
}

function simplifyMenu() {
    const SECTIONS_TO_REMOVE = [
        'AI Mode', 
        'Language'
    ];

    // Remove specified sections from side menu
    document.querySelectorAll('.menu-section h3').forEach(header => {
        if (SECTIONS_TO_REMOVE.includes(header.textContent)) {
            header.closest('.menu-section').remove();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    createOptionsDropdown();
    simplifyMenu();
});

// -- Menu functionality
function toggleMenu() {
    document.body.classList.toggle('menu-open');
}

menuButton.addEventListener('click', toggleMenu);
menuOverlay.addEventListener('click', toggleMenu);

// -- Send button and input area functionality
async function sendMessage(event) {
  event.preventDefault();
  if (currentAiMode === 'creative') {
    // Automatically generate images in Creative mode
    return generateImages(event);
  }
  const messageText = userInput.value.trim();
  if (!messageText && selectedFiles.length === 0) return;

  userInput.disabled = true;
  sendBtn.disabled = true;
  genBtn.disabled = true;
  sendBtn.classList.add('pulsing');

  addUserMessage(messageText, selectedFiles);

  userInput.value = '';
  adjustInputAreaHeight();

  const assistantTypingBubble = addAssistantMessage('');
  const dotsSpan = document.createElement('span');
  dotsSpan.classList.add('dots');
  dotsSpan.textContent = '...'; 
  assistantTypingBubble.classList.add('loading-bounce');
  assistantTypingBubble.appendChild(dotsSpan);
  assistantTypingBubble.ariaLabel = getTranslation('assistantTyping'); 

  const messageContent = [];
  if (messageText) {
    messageContent.push({ type: "text", text: messageText });
  }
  for (const file of selectedFiles) {
    if (file.type.startsWith('image/')) {
      const base64 = await fileToBase64(file);
      messageContent.push({
        type: "image_url",
        image_url: { url: base64 }
      });
    } else {
      messageContent.push({ 
        type: "text", 
        text: `[Document attached: ${file.name}]` 
      });
    }
  }

  conversationHistory.push({ 
    role: "user", 
    content: messageContent.length === 1 && messageContent[0].type === "text" 
      ? messageContent[0].text 
      : messageContent 
  });

  // Clear selected files
  selectedFiles = [];
  updateSelectedFilesDisplay();

  try {
    // --- Look up system prompt based on selected model ---
    const aiModeConfig = AI_MODES.find(m => m.id === currentAiMode) || AI_MODES[0];
    const systemMessageContent = aiModeConfig.systemPrompt;

    const completion = await websim.chat.completions.create({
      messages: [
        { role: "system", content: systemMessageContent },
        ...conversationHistory,
      ],
    });

    const response = completion.content;

    chatArea.removeChild(assistantTypingBubble.parentElement);

    addAssistantMessage(response);
    conversationHistory.push({ role: "assistant", content: response });

    scrollToBottom();

  } catch (error) {
    console.error("Error calling AI:", error);
    chatArea.removeChild(assistantTypingBubble.parentElement);
    addAssistantMessage(getTranslation('errorMessage'));
  } finally {
    userInput.disabled = false;
    sendBtn.disabled = false;
    genBtn.disabled = false;
    sendBtn.classList.remove('pulsing');
    userInput.focus();
  }
}

inputBar.addEventListener('submit', sendMessage);

function adjustInputAreaHeight() {
    userInput.style.height = 'auto';
    userInput.style.height = userInput.scrollHeight + 'px';
}

userInput.addEventListener('input', adjustInputAreaHeight);
adjustInputAreaHeight();

function addUserMessage(text, files = []) {
    const row = document.createElement('div');
    row.classList.add('bubble-row', 'user');
    
    let content = text ? marked.parse(text, {mangle: false, headerIds: false}) : '';
    
    if (files.length > 0) {
        const fileList = files.map(file => 
            `<div class="attached-file">📎 ${file.name}</div>`
        ).join('');
        content += `<div class="file-attachments">${fileList}</div>`;
    }
    
    row.innerHTML = `
        <div class="bubble user">${content}</div>
        <div class="avatar">👤</div>
    `;
    chatArea.appendChild(row);
}

function addAssistantMessage(text) {
    const row = document.createElement('div');
    row.classList.add('bubble-row', 'assistant');
     row.innerHTML = `
        <div class="avatar">🤖</div>
        <div class="bubble assistant">${text.includes('<div class="image-grid">') ? text : marked.parse(text, {mangle: false, headerIds: false})}</div>
    `;
    chatArea.appendChild(row);
    row.querySelector('.bubble').classList.add('cosmic-arrival');
    return row.querySelector('.bubble');
}

function scrollToBottom() {
    chatArea.scrollTop = chatArea.scrollHeight;
}

// -- Generate images (media) functionality
async function generateImages(event) {
    event.preventDefault();

    const messageText = userInput.value.trim();
    if (!messageText) return;

    const currentMode = AI_MODES.find(mode => mode.id === currentAiMode);
    if (!currentMode.canGenerateImages) {
        alert(`Image generation is not supported in ${getModelName(currentAiMode)} mode.`);
        return;
    }

    genBtn.disabled = true;
    sendBtn.disabled = true;
    genBtn.classList.add('pulsing');

    addUserMessage(messageText);
    userInput.value = '';
    adjustInputAreaHeight();

    const loadingBubble = addAssistantMessage('');
    const dotsSpan = document.createElement('span');
    dotsSpan.classList.add('dots');
        dotsSpan.textContent = 'Generating images...';
    loadingBubble.classList.add('loading-bounce');
    loadingBubble.appendChild(dotsSpan);

    try {
        /**
         * @tweakable Number of images to generate for Creative mode
         */
        const MEDIA_IMAGE_COUNT = 6;

        // only generate images, no video
        const imagePromises = Array.from({ length: MEDIA_IMAGE_COUNT }, () =>
            websim.imageGen({ prompt: messageText, width: 256, height: 256 })
        );
        const results = await Promise.all(imagePromises);

        chatArea.removeChild(loadingBubble.parentElement);

        const mediaHTML = `<div class="image-grid">
            ${results.map(r => `
                <img src="${r.url}" alt="Generated image" class="generated-image"
                     onclick="openImageModal('${r.url}')" />
            `).join('')}
        </div>`;

        addAssistantMessage(mediaHTML);
        scrollToBottom();

    } catch (error) {
        console.error("Error generating images:", error);
        chatArea.removeChild(loadingBubble.parentElement);
        addAssistantMessage(getTranslation('errorMessage'));
    } finally {
        genBtn.disabled = false;
        sendBtn.disabled = false;
        genBtn.classList.remove('pulsing');
        userInput.focus();
    }
}

genBtn.addEventListener('click', generateImages);

// Remove file button from input row
fileBtn.style.display = 'none';

// Modify the file attachment option creation
function createFileAttachmentOption() {
    const FILE_ATTACHMENT_TEXT = getTranslation('attachFileOption'); 

    const MAX_FILE_SIZE_MB = 10;

    const MAX_FILES = 5;

    const fileAttachmentOption = document.createElement('button');
    fileAttachmentOption.type = 'button';
    fileAttachmentOption.classList.add('dropdown-item');
    fileAttachmentOption.id = 'dropdown-file-btn';
    fileAttachmentOption.textContent = FILE_ATTACHMENT_TEXT;
    
    fileAttachmentOption.addEventListener('click', () => {
        fileInput.click();
        optionsDropdown.classList.remove('active');
    });

    optionsDropdown.appendChild(fileAttachmentOption);
}

// -- Options dropdown functionality
optionsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    optionsDropdown.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!optionsBtn.contains(e.target) && !optionsDropdown.contains(e.target)) {
        optionsDropdown.classList.remove('active');
    }
});

clearChatBtn.addEventListener('click', () => {
    if (confirm(getTranslation('resetConfirmMessage'))) {
        saveConversation();
        chatArea.innerHTML = '';
        conversationHistory = [];
        populateHistoryList();
        
        // Close menu after reset
        toggleMenu();
    }
    optionsDropdown.classList.remove('active');
});

changeLanguageBtn.addEventListener('click', () => {
    toggleMenu(); // Open the side menu to change language
    optionsDropdown.classList.remove('active');
});

function updateButtonVisibility() {
    if (isImageCreationMode) {
        const IMAGE_CREATION_BORDER_COLOR = 'rgba(128, 0, 255, 0.7)';
        
        const IMAGE_CREATION_BORDER_WIDTH = '2px';
        
        const IMAGE_CREATION_BORDER_STYLE = 'solid';
        
        const IMAGE_CREATION_BLINK_DURATION = '4s';
        
        const IMAGE_CREATION_BLINK_OPACITY = [0.6, 0.9];

        const blinkKeyframes = `
            @keyframes slowNeonBlink {
                0%, 100% { 
                    border-color: ${IMAGE_CREATION_BORDER_COLOR}; 
                    box-shadow: 0 0 10px ${IMAGE_CREATION_BORDER_COLOR};
                    opacity: ${IMAGE_CREATION_BLINK_OPACITY[0]};
                }
                50% { 
                    border-color: ${IMAGE_CREATION_BORDER_COLOR}; 
                    box-shadow: 0 0 20px ${IMAGE_CREATION_BORDER_COLOR};
                    opacity: ${IMAGE_CREATION_BLINK_OPACITY[1]};
                }
            }
        `;
        
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = blinkKeyframes;
        document.head.appendChild(styleSheet);

        inputBar.style.border = `${IMAGE_CREATION_BORDER_WIDTH} ${IMAGE_CREATION_BORDER_STYLE} ${IMAGE_CREATION_BORDER_COLOR}`;
        inputBar.style.animation = `slowNeonBlink ${IMAGE_CREATION_BLINK_DURATION} ease-in-out infinite`;
        inputBar.style.boxShadow = `0 0 10px ${IMAGE_CREATION_BORDER_COLOR}`;
        
        sendButton.style.opacity = BUTTON_FADE_OPACITY.start;
        sendButton.style.transform = `scale(${BUTTON_TRANSITION_SCALE.start})`;
        
        setTimeout(() => {
            sendButton.style.display = 'none';
            genButton.style.display = 'flex';
            
            genButton.style.opacity = BUTTON_FADE_OPACITY.end;
            genButton.style.transform = `scale(${BUTTON_TRANSITION_SCALE.end})`;
        }, IMAGE_MODE_TRANSITION_DURATION / 2);
    } else {
        inputBar.style.border = 'none';
        inputBar.style.animation = 'none';
        inputBar.style.boxShadow = 'none';

        genButton.style.opacity = BUTTON_FADE_OPACITY.start;
        genBtn.style.transform = `scale(${BUTTON_TRANSITION_SCALE.start})`;
        
        setTimeout(() => {
            genBtn.style.display = 'none';
            sendBtn.style.display = 'flex';
            
            sendBtn.style.opacity = BUTTON_FADE_OPACITY.end;
            sendBtn.style.transform = `scale(${BUTTON_TRANSITION_SCALE.end})`;
        }, IMAGE_MODE_TRANSITION_DURATION / 2);
    }
}

function updateCreateImageButtonText() {
    const IMAGE_CREATION_ACTIVE_TEXT = getTranslation('answerQuestions');
    const IMAGE_CREATION_INACTIVE_TEXT = getTranslation('createImageOption');

    createImageBtn.textContent = isImageCreationMode 
        ? IMAGE_CREATION_ACTIVE_TEXT 
        : IMAGE_CREATION_INACTIVE_TEXT;
}

function toggleTemporaryChatMode() {
    const TEMPORARY_CHAT_BORDER_INTENSITY = 0.5;

    const TEMPORARY_CHAT_BORDER_STYLE = 'dashed';

    inputBar.classList.toggle('temporary-chat-active');

    const isTemporaryChatActive = inputBar.classList.contains('temporary-chat-active');

    const temporaryChatOption = document.getElementById('dropdown-temporary-chat-btn');
    temporaryChatOption.textContent = isTemporaryChatActive 
        ? getTranslation('normalChatOption') 
        : getTranslation('temporaryChatOption');

    if (isTemporaryChatActive) {
        inputBar.style.border = `2px ${TEMPORARY_CHAT_BORDER_STYLE} rgba(0, 253, 253, ${TEMPORARY_CHAT_BORDER_INTENSITY})`;
    } else {
        inputBar.style.border = 'none';
    }

    localStorage.setItem('temporaryChatMode', isTemporaryChatActive.toString());
}

createImageBtn.addEventListener('click', () => {
    if (!IMAGE_CREATION_ENABLED) {
        alert(getTranslation('imageCreationDisabled') || "Image creation is currently disabled.");
        return;
    }
    
    isImageCreationMode = !isImageCreationMode;
    
    updateCreateImageButtonText();
    
    updateButtonVisibility();
    
    optionsDropdown.classList.remove('active');
});

document.addEventListener('DOMContentLoaded', () => {
    updateCreateImageButtonText();
    
    genBtn.style.display = 'none';
    genBtn.style.opacity = 0;
});

settingsBtn.addEventListener('click', () => {
    toggleMenu(); // Open the side menu for settings
    optionsDropdown.classList.remove('active');
});

// -- File handling functionality
fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
        if (selectedFiles.length >= MAX_FILES) {
            alert(`Maximum ${MAX_FILES} files allowed`);
            return;
        }
        
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            alert(`File ${file.name} is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB`);
            return;
        }
        
        selectedFiles.push(file);
    });
    
    updateSelectedFilesDisplay();
    fileInput.value = ''; // Reset input
});

function updateSelectedFilesDisplay() {
    selectedFilesContainer.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
        const fileElement = document.createElement('div');
        fileElement.className = 'selected-file';
        
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.onload = () => URL.revokeObjectURL(img.src);
            fileElement.appendChild(img);
        } else {
            const icon = document.createElement('div');
            icon.className = 'file-icon';
            icon.textContent = '📄';
            fileElement.appendChild(icon);
        }
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'file-remove';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = () => removeFile(index);
        
        fileElement.appendChild(removeBtn);
        selectedFilesContainer.appendChild(fileElement);
    });
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    updateSelectedFilesDisplay();
}

window.removeFile = removeFile;

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// -- Save and load conversation functionality
function saveConversation(title) {
    if (conversationHistory.length === 0) {
        return; 
    }

    let generatedTitle = title;
    if (!generatedTitle) {
         const firstUserMessage = conversationHistory.find(msg => msg.role === 'user');
         generatedTitle = firstUserMessage ? firstUserMessage.content.substring(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '') : `${getTranslation('historyTitle')} ${Date.now()}`;
    }

    const newConversation = {
        id: Date.now(),
        title: generatedTitle,
        history: [...conversationHistory]
    };

    savedConversations.unshift(newConversation);

    if (savedConversations.length > MAX_SAVED_CONVERSATIONS) {
        savedConversations = savedConversations.slice(0, MAX_SAVED_CONVERSATIONS);
    }

    localStorage.setItem('spectroConversations', JSON.stringify(savedConversations));
    populateHistoryList(); 
}

function loadConversation(id) {
    const conversation = savedConversations.find(conv => conv.id === id);
    if (conversation) {
        chatArea.innerHTML = '';
        conversationHistory = [...conversation.history];
        conversationHistory.forEach(msg => {
            if (msg.role === 'user') {
                addUserMessage(msg.content, msg.files);
            } else if (msg.role === 'assistant') {
                addAssistantMessage(msg.content);
            }
        });
        scrollToBottom();
        toggleMenu();
    }
}

function deleteConversation(id) {
    if (confirm(getTranslation('deleteConfirm'))) { 
        savedConversations = savedConversations.filter(conv => conv.id !== id);
        localStorage.setItem('spectroConversations', JSON.stringify(savedConversations));
        populateHistoryList(); 
    }
}

function renameConversation(id, newTitle) {
     const conversation = savedConversations.find(conv => conv.id === id);
     if (conversation) {
         conversation.title = newTitle;
         localStorage.setItem('spectroConversations', JSON.stringify(savedConversations));
     }
}

function populateHistoryList() {
    historyList.innerHTML = '';
    if (savedConversations.length === 0) {
        historyList.innerHTML = `<li>${getTranslation('noHistory')}</li>`; 
        return;
    }

    savedConversations.forEach(conv => {
        const listItem = document.createElement('li');
        listItem.classList.add('history-item');
        listItem.dataset.id = conv.id;

        const titleSpan = document.createElement('span');
        titleSpan.classList.add('history-item-title');
        titleSpan.textContent = conv.title;
        titleSpan.contentEditable = "false";

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('history-item-actions');

        const renameButton = document.createElement('button');
        renameButton.textContent = '✏️';
        renameButton.title = getTranslation('renameButtonTitle'); 
        renameButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isEditing = titleSpan.contentEditable === "true";
            titleSpan.contentEditable = isEditing ? "false" : "true";
            renameButton.textContent = isEditing ? '✏️' : '✅';
            if (!isEditing) {
                 titleSpan.focus();
                 const range = document.createRange();
                 range.selectNodeContents(titleSpan);
                 const selection = window.getSelection();
                 selection.removeAllRanges();
                 selection.addRange(range);
            } else {
                 renameConversation(conv.id, titleSpan.textContent);
                 titleSpan.blur();
            }
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '🗑️';
        deleteButton.title = getTranslation('deleteButtonTitle'); 
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteConversation(conv.id);
        });

        actionsDiv.appendChild(renameButton);
        actionsDiv.appendChild(deleteButton);

        listItem.appendChild(titleSpan);
        listItem.appendChild(actionsDiv);

        listItem.addEventListener('click', () => {
             loadConversation(conv.id);
        });

        titleSpan.addEventListener('keypress', (e) => {
             if (e.key === 'Enter') {
                 e.preventDefault();
                 titleSpan.contentEditable = "false";
                 renameButton.textContent = '✏️';
                 renameConversation(conv.id, titleSpan.textContent);
                 titleSpan.blur();
             }
        });

        titleSpan.addEventListener('blur', () => {
             if (titleSpan.contentEditable === "true") {
                 titleSpan.contentEditable = "false";
                 renameButton.textContent = '✏️';
                 renameConversation(conv.id, titleSpan.textContent);
             }
        });

        historyList.appendChild(listItem);
    });
}

populateHistoryList();

resetButton.addEventListener('click', () => {
    const confirmReset = confirm(getTranslation('resetConfirmMessage'));
    
    if (confirmReset) {
        saveConversation();
        
        chatArea.innerHTML = '';
        
        conversationHistory = [];
        
        populateHistoryList();
        
        toggleMenu();
    }
});

// -- AI Models Modal --

/**
 * @tweakable The width (in px) of the AI Models modal
 */
const AI_MODELS_MODAL_WIDTH = 310;
/**
 * @tweakable The max height (in px) of the AI Models modal
 */
const AI_MODELS_MODAL_MAX_HEIGHT = 410;
/**
 * @tweakable The modal's background color
 */
const AI_MODELS_MODAL_BG = 'rgba(20,22,40,0.98)';
/**
 * @tweakable The accent color for the selected AI model
 */
const AI_MODELS_MODAL_ACCENT = '#14ffec';

function removeExistingAiModelsModal() {
  const existing = document.getElementById('ai-models-modal-overlay');
  if (existing) existing.remove();
}

/**
 * Shows the AI Models modal dialog in the center of the screen.
 */
function showAiModelsModal() {
  removeExistingAiModelsModal();

  // Overlay
  const overlay = document.createElement('div');
  overlay.id = 'ai-models-modal-overlay';
  overlay.style.position = 'fixed';
  overlay.style.left = '0'; overlay.style.top = '0';
  overlay.style.width = '100vw'; overlay.style.height = '100vh';
  overlay.style.background = 'rgba(0,0,0,0.45)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center'; 
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '340';
  overlay.style.backdropFilter = 'blur(7px) saturate(1.1)';
  overlay.style.transition = 'background 0.3s';

  // Modal
  const modal = document.createElement('div');
  modal.style.background = AI_MODELS_MODAL_BG;
  modal.style.borderRadius = '18px';
  modal.style.width = `${AI_MODELS_MODAL_WIDTH}px`;
  modal.style.maxWidth = '94vw';
  modal.style.maxHeight = `${AI_MODELS_MODAL_MAX_HEIGHT}px`;
  modal.style.padding = '1.1em 1.4em 1.2em 1.4em';
  modal.style.display = 'flex';
  modal.style.flexDirection = 'column';
  modal.style.alignItems = 'stretch';
  modal.style.boxShadow = `0 2px 30px 0 rgba(20,255,236,0.22), 0 6px 38px 0 rgba(0,0,0,0.23)`;
  modal.style.position = 'relative';
  modal.style.overflowY = 'auto';
  modal.style.animation = 'fadein-up 250ms cubic-bezier(.3,1.7,.49,.82)';

  // Modal Title
  const title = document.createElement('div');
  title.textContent = getTranslation('aiModelsOption') || 'AI Models';
  title.style.fontWeight = '800';
  title.style.letterSpacing = '-0.5px';
  title.style.fontSize = '1.14em';
  title.style.marginBottom = '1.2em';
  title.style.color = AI_MODELS_MODAL_ACCENT;
  modal.appendChild(title);

  // Models list
  AI_MODES.forEach((mode) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ai-model-choice';
    btn.textContent = getModelName(mode.id);
    btn.style.width = '100%';
    btn.style.marginBottom = '0.43em';
    btn.style.padding = '1.12em 0.7em';
    btn.style.background = mode.id === currentAiMode ? 'linear-gradient(94deg,#14ffec 30%,#1e9fff 86%)' : 'transparent';
    btn.style.color = mode.id === currentAiMode ? '#14152a' : '#d8fffa';
    btn.style.border = mode.id === currentAiMode ? `2px solid ${AI_MODELS_MODAL_ACCENT}` : '1.5px solid #282943';
    btn.style.borderRadius = '10px';
    btn.style.fontWeight = mode.id === currentAiMode ? '800' : '500';
    btn.style.fontSize = '1em';
    btn.style.outline = 'none';
    btn.style.transition = 'all 0.15s';
    btn.style.cursor = 'pointer';
    btn.setAttribute('data-mode-id', mode.id);

    btn.addEventListener('click', () => {
      // Select only one at a time
      currentAiMode = mode.id;
      localStorage.setItem('spectroAiMode', currentAiMode);
      // Update UI to highlight
      modal.querySelectorAll('.ai-model-choice').forEach(b => {
        b.style.background = 'transparent';
        b.style.color = '#d8fffa';
        b.style.border = '1.5px solid #282943';
        b.style.fontWeight = '500';
      });
      btn.style.background = 'linear-gradient(94deg,#14ffec 30%,#1e9fff 86%)';
      btn.style.color = '#14152a';
      btn.style.border = `2px solid ${AI_MODELS_MODAL_ACCENT}`;
      btn.style.fontWeight = '800';
      // Close after short delay
      setTimeout(() => {
        overlay.remove();
      }, 140);
    });

    modal.appendChild(btn);
  });

  // Close ('X') button
  const closeX = document.createElement('button');
  closeX.textContent = '×';
  closeX.setAttribute('aria-label','Close');
  closeX.style.position = 'absolute';
  closeX.style.top = '6px';
  closeX.style.right = '15px';
  closeX.style.background = 'none';
  closeX.style.border = 'none';
  closeX.style.color = '#fff';
  closeX.style.fontSize = '2.3em';
  closeX.style.fontWeight = '400';
  closeX.style.cursor = 'pointer';
  closeX.style.lineHeight = '1.1';
  closeX.style.opacity = '0.82';
  closeX.style.padding = '0 4px';
  closeX.style.borderRadius = '14px';
  closeX.style.transition = 'background 0.17s';
  closeX.addEventListener('mouseover',()=>{closeX.style.background='#ffffff10'});
  closeX.addEventListener('mouseout',()=>{closeX.style.background='none'});
  closeX.addEventListener('click',()=>overlay.remove());
  modal.appendChild(closeX);

  overlay.appendChild(modal);

  // Close when clicking outside modal
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.body.appendChild(overlay);
}

// -- Patch three-dot menu to open models modal instead of expanding inline list
// Find and update the menu insertion code to point to the modal.

function insertModelsOptionInDropdown() {
  // Remove any existing models dropdown (before re-render, eg. language change)
  const prev = document.getElementById('dropdown-ai-models-btn');
  if (prev) prev.nextSibling?.remove();
  if (prev) prev.remove();

  const aiModelsBtn = document.createElement('button');
  aiModelsBtn.type = 'button';
  aiModelsBtn.classList.add('dropdown-item');
  aiModelsBtn.id = 'dropdown-ai-models-btn';
  aiModelsBtn.textContent = getTranslation('aiModelsOption') || "AI Models";
  aiModelsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    optionsDropdown.classList.remove('active');
    showAiModelsModal();
  });
  optionsDropdown.appendChild(aiModelsBtn);
}
document.addEventListener('DOMContentLoaded', insertModelsOptionInDropdown);
languageSelect.addEventListener('change', insertModelsOptionInDropdown);

// -- Image modal functionality
function openImageModal(imageSrc) {
        const MODAL_BG_OPACITY = 0.95;

        const MODAL_TRANSITION_DURATION = 290;

        const IMAGE_ZOOM_SCALE = 1.0;

    modalImage.src = imageSrc;
    imageModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    modalImage.style.transform = `scale(${IMAGE_ZOOM_SCALE})`;
    imageModal.style.backgroundColor = `rgba(0,0,0,${MODAL_BG_OPACITY})`;
    modalImage.style.transition = `transform ${MODAL_TRANSITION_DURATION}ms ease-out`;
    
    // Show download button when image is zoomed
    const downloadBtn = document.getElementById('modal-download-btn');
    if (downloadBtn) {
        downloadBtn.style.display = 'flex';
    }
    
    setTimeout(() => {
        modalImage.style.transform = 'scale(1)';
    }, 50);
}

function closeImageModal() {
    imageModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Hide download button when closing modal
    const downloadBtn = document.getElementById('modal-download-btn');
    if (downloadBtn) {
        downloadBtn.style.display = 'none';
    }
}

modalCloseBtn.addEventListener('click', closeImageModal);

imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
        closeImageModal();
    }
});

// Add download functionality to modal
function setupModalDownload() {
        const DOWNLOAD_BTN_TOP_OFFSET = 80;
    
        const DOWNLOAD_BTN_RIGHT_OFFSET = 20;
    
        const DOWNLOAD_BTN_SIZE = 44;
    
        const DOWNLOAD_BTN_BG_OPACITY = 0.3;
    
        const DOWNLOAD_BTN_HOVER_BG_OPACITY = 0.5;

    const downloadBtn = document.createElement('button');
    downloadBtn.id = 'modal-download-btn';
    downloadBtn.innerHTML = '↓';
    downloadBtn.setAttribute('aria-label', 'Download image');
    downloadBtn.style.cssText = `
        position: absolute;
        top: ${DOWNLOAD_BTN_TOP_OFFSET}px;
        right: ${DOWNLOAD_BTN_RIGHT_OFFSET}px;
        background: rgba(20, 255, 236, ${DOWNLOAD_BTN_BG_OPACITY});
        border: 2px solid rgba(20, 255, 236, 0.6);
        color: white;
        font-size: 1.5rem;
        width: ${DOWNLOAD_BTN_SIZE}px;
        height: ${DOWNLOAD_BTN_SIZE}px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);
        z-index: 52;
        display: none;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    `;
    
    downloadBtn.addEventListener('mouseenter', () => {
        downloadBtn.style.background = `rgba(20, 255, 236, ${DOWNLOAD_BTN_HOVER_BG_OPACITY})`;
        downloadBtn.style.transform = 'scale(1.1)';
        downloadBtn.style.boxShadow = '0 0 15px rgba(20, 255, 236, 0.6)';
    });
    
    downloadBtn.addEventListener('mouseleave', () => {
        downloadBtn.style.background = `rgba(20, 255, 236, ${DOWNLOAD_BTN_BG_OPACITY})`;
        downloadBtn.style.transform = 'scale(1)';
        downloadBtn.style.boxShadow = 'none';
    });
    
    downloadBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        
        try {
            const imageSrc = modalImage.src;
            const response = await fetch(imageSrc);
            const blob = await response.blob();
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            
                        const DOWNLOAD_FILENAME = 'spectro-generated-image.png';
            link.download = DOWNLOAD_FILENAME;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up the object URL
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading image:', error);
            // Fallback method
            const link = document.createElement('a');
            link.href = modalImage.src;
            link.download = 'spectro-generated-image.png';
            link.target = '_blank';
            link.click();
        }
    });
    
    imageModal.appendChild(downloadBtn);
}

// Initialize modal download functionality
document.addEventListener('DOMContentLoaded', setupModalDownload);

// -- Scroll navigation functionality
const SCROLL_THRESHOLD = 200;

const SCROLL_BUTTON_ANIMATION_DURATION = 0.3;

function createScrollNavigationButton() {
    const scrollButton = document.createElement('button');
    scrollButton.id = 'scroll-navigation-btn';
    scrollButton.classList.add('scroll-navigation-btn');
    scrollButton.setAttribute('aria-label', 'Scroll Navigation');
    
    const icon = document.createElement('div');
    icon.classList.add('scroll-icon');
    scrollButton.appendChild(icon);

    document.body.appendChild(scrollButton);

    let isAtBottom = true;

    function updateScrollButton() {
        const scrollPosition = chatArea.scrollTop;
        const scrollHeight = chatArea.scrollHeight;
        const clientHeight = chatArea.clientHeight;

        isAtBottom = (scrollHeight - scrollPosition - clientHeight) < 50;

        if (scrollPosition > SCROLL_THRESHOLD && !isAtBottom) {
            icon.classList.add('scroll-down');
            scrollButton.classList.add('active');
        } else if (scrollPosition < scrollHeight - clientHeight - SCROLL_THRESHOLD) {
            icon.classList.remove('scroll-down');
            scrollButton.classList.add('active');
        } else {
            scrollButton.classList.remove('active');
        }
    }

    function handleScrollButtonClick() {
        if (isAtBottom) {
            chatArea.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            chatArea.scrollTo({
                top: chatArea.scrollHeight,
                behavior: 'smooth'
            });
        }
    }

    chatArea.addEventListener('scroll', updateScrollButton);
    scrollButton.addEventListener('click', handleScrollButtonClick);

    updateScrollButton();
}

createScrollNavigationButton();

// -- Enhance button interactivity
function enhanceButtonInteractivity() {
    const sendBtn = document.getElementById('send-btn');
    const genBtn = document.getElementById('gen-btn');

    [sendBtn, genBtn].forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            button.style.transform = `scale(${1 + BUTTON_GLOW_INTENSITY / 10})`;
            button.style.boxShadow = `
                0 0 15px rgba(20, 255, 236, ${BUTTON_GLOW_INTENSITY}), 
                0 0 25px rgba(30, 153, 255, ${BUTTON_GLOW_INTENSITY / 2})
            `;
        });

        button.addEventListener('mouseleave', (e) => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = 'none';
        });

        button.addEventListener('mousedown', (e) => {
            button.style.transform = `scale(0.95)`;
            button.style.boxShadow = `
                0 0 10px rgba(20, 255, 236, ${BUTTON_GLOW_INTENSITY}), 
                0 0 20px rgba(30, 153, 255, ${BUTTON_GLOW_INTENSITY / 2})
            `;
        });

        button.addEventListener('mouseup', (e) => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = 'none';
        });
    });
}

enhanceButtonInteractivity();

// -- Enhance header scroll behavior
const HEADER_SCROLL_THRESHOLD = 50;

const HEADER_SCROLL_ANIMATION_SPEED = 0.3;

function enhanceHeaderScrollBehavior() {
  const header = document.querySelector('header');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        const headerOpacity = Math.min(currentScrollTop / HEADER_SCROLL_THRESHOLD, 1.5);
    header.style.backgroundColor = `rgba(24, 25, 38, ${headerOpacity})`;

        const boxShadowOpacity = Math.min(currentScrollTop / HEADER_SCROLL_THRESHOLD * 0.2, 0.2);
    header.style.boxShadow = `0 2px 28px 0 rgba(20, 255, 236, ${boxShadowOpacity})`;

    lastScrollTop = currentScrollTop;
  });
}

document.addEventListener('DOMContentLoaded', enhanceHeaderScrollBehavior);

function createDropdownIcons() {
    const MENU_ITEM_VISIBILITY = {
        clearChat: true,
        changeLanguage: true,
        createImage: false,
        settings: true
    };

    const MENU_ITEM_STYLE = {
        textColor: 'inherit',
        fontWeight: 'normal',
        letterSpacing: 'normal'
    };

    const MENU_ITEM_CUSTOM_TEXT = {
        clearChat: null,
        changeLanguage: null,
        createImage: null,
        settings: null
    };

    clearChatBtn.style.color = MENU_ITEM_STYLE.textColor;
    clearChatBtn.style.fontWeight = MENU_ITEM_STYLE.fontWeight;
    clearChatBtn.style.letterSpacing = MENU_ITEM_STYLE.letterSpacing;

    changeLanguageBtn.style.color = MENU_ITEM_STYLE.textColor;
    changeLanguageBtn.style.fontWeight = MENU_ITEM_STYLE.fontWeight;
    changeLanguageBtn.style.letterSpacing = MENU_ITEM_STYLE.letterSpacing;

    settingsBtn.style.color = MENU_ITEM_STYLE.textColor;
    settingsBtn.style.fontWeight = MENU_ITEM_STYLE.fontWeight;
    settingsBtn.style.letterSpacing = MENU_ITEM_STYLE.letterSpacing;

    clearChatBtn.textContent = MENU_ITEM_CUSTOM_TEXT.clearChat || getTranslation('clearChatOption');
    changeLanguageBtn.textContent = MENU_ITEM_CUSTOM_TEXT.changeLanguage || getTranslation('changeLanguageOption');
    settingsBtn.textContent = MENU_ITEM_CUSTOM_TEXT.settings || getTranslation('settingsOption');
}

function createTemporaryChatOption() {
    const TEMPORARY_CHAT_TEXT = getTranslation('temporaryChatOption');

    const temporaryChatOption = document.createElement('button');
    temporaryChatOption.type = 'button';
    temporaryChatOption.classList.add('dropdown-item');
    temporaryChatOption.id = 'dropdown-temporary-chat-btn';
    temporaryChatOption.textContent = TEMPORARY_CHAT_TEXT;
    
    temporaryChatOption.addEventListener('click', () => {
        toggleTemporaryChatMode();
        optionsDropdown.classList.remove('active');
    });

    optionsDropdown.appendChild(temporaryChatOption);
}

document.addEventListener('DOMContentLoaded', () => {
    createTemporaryChatOption();

    const wasTemporaryChatActive = localStorage.getItem('temporaryChatMode') === 'true';
    if (wasTemporaryChatActive) {
        inputBar.classList.add('temporary-chat-active');
        inputBar.style.border = `2px dashed rgba(0, 253, 253, 0.5)`;
    }
});

function initializeOptionsButton() {
    optionsBtn.style.order = '-1'; 
    optionsBtn.style.marginRight = 'auto'; 
}

function createMiniAIMenu() {
    const menuButton = document.getElementById('menu-button');
    const miniMenu = document.createElement('div');
    miniMenu.id = 'mini-ai-menu';
    miniMenu.className = 'mini-ai-menu';
    
    const MINI_MENU_BG_OPACITY = 0.95;
    
    miniMenu.style.cssText = `
        position: absolute;
        top: 100%;
        right: ${10}px;
        background: rgba(13, 14, 22, ${MINI_MENU_BG_OPACITY});
        border: 1px solid rgba(0, 253, 253, 0.2);
        border-radius: 8px;
        padding: 0.5rem;
        display: none;
        z-index: 100;
        backdrop-filter: blur(10px);
    `;

    const modes = [
        {id: 'spectro', name: getTranslation('spectroAi')},
        {id: 'light', name: getTranslation('lightAi')},
        {id: 'pro', name: getTranslation('proAi')}
    ];

    modes.forEach(mode => {
        const button = document.createElement('button');
        button.className = 'mini-menu-item';
        button.textContent = mode.name;
        button.addEventListener('click', () => {
            currentAiMode = mode.id;
            localStorage.setItem('spectroAiMode', currentAiMode);
            miniMenu.style.display = 'none';
        });
        miniMenu.appendChild(button);
    });

    document.body.appendChild(miniMenu);

    menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = miniMenu.style.display === 'block';
        miniMenu.style.display = isVisible ? 'none' : 'block';
    });

    document.addEventListener('click', () => {
        miniMenu.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeOptionsButton();
    createMiniAIMenu();
});

/** 
 * @tweakable Control whether Enter key sends message by default 
 */
const ENTER_SENDS_MESSAGE = true;

/** 
 * @tweakable Modifier key required to send message (if not using default Enter behavior)
 * Possible values: 'shift', 'ctrl', 'alt', or null
 */
const ENTER_SEND_MODIFIER = null;

function setupMessageSendHandler() {
  userInput.addEventListener('keydown', (e) => {
    // Check if Enter should send message based on configuration
    const shouldSendOnEnter = ENTER_SENDS_MESSAGE && 
      (!ENTER_SEND_MODIFIER || 
       (ENTER_SEND_MODIFIER === 'shift' && e.shiftKey) ||
       (ENTER_SEND_MODIFIER === 'ctrl' && e.ctrlKey) ||
       (ENTER_SEND_MODIFIER === 'alt' && e.altKey));

    // Prevent default line break if sending message
    if (e.key === 'Enter' && !e.shiftKey && shouldSendOnEnter) {
      e.preventDefault();
      
      // Trigger form submission to use existing send message logic
      inputBar.dispatchEvent(new Event('submit'));
    }
  });
}

// Add the message send handler when DOM is loaded
document.addEventListener('DOMContentLoaded', setupMessageSendHandler);

const IMAGE_CREATION_ENABLED = false;

function insertOptionsInDropdown() {
    const DROPDOWN_OPTIONS = {
        clearChat: true,
        changeLanguage: true,
        createImage: false,  
        settings: true,
        aiModels: true
    };

    optionsDropdown.innerHTML = '';

    if (DROPDOWN_OPTIONS.clearChat) {
        clearChatBtn.textContent = getTranslation('clearChatOption');
        optionsDropdown.appendChild(clearChatBtn);
    }

    if (DROPDOWN_OPTIONS.changeLanguage) {
        changeLanguageBtn.textContent = getTranslation('changeLanguageOption');
        optionsDropdown.appendChild(changeLanguageBtn);
    }

    if (DROPDOWN_OPTIONS.createImage) {
        createImageBtn.textContent = getTranslation('createImageOption');
        optionsDropdown.appendChild(createImageBtn);
    }

    if (DROPDOWN_OPTIONS.settings) {
        settingsBtn.textContent = getTranslation('settingsOption');
        optionsDropdown.appendChild(settingsBtn);
    }

    if (DROPDOWN_OPTIONS.aiModels) {
        insertModelsOptionInDropdown();
    }
}

document.addEventListener('DOMContentLoaded', insertOptionsInDropdown);
languageSelect.addEventListener('change', insertOptionsInDropdown);