import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Palette, Save, Eye, Brush, CheckCircle2, Plus, Trash2, Type, AlignLeft,
    List, CheckSquare, Paperclip, Lock, Unlock, X, Pipette, LayoutTemplate,
    ArrowUp, ArrowDown, Asterisk, LayoutGrid, Menu, FolderOpen, FileJson,
    Share2, FileDown, Hash, ExternalLink, Link as LinkIcon, ListPlus,
    Image as ImageIcon, FileText, Globe, Languages
} from 'lucide-react';
import LZString from 'lz-string';
import { jsPDF } from 'jspdf';
import FontUrl from "./Bahnschrift.ttf"

// ==========================================
// 1. CONSTANTS & UTILS
// ==========================================

const AVAILABLE_LANGS = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'uk', label: 'Українська' },
    { code: 'jp', label: '日本語 (Japanese)' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'pl', label: 'Polski' },
    { code: 'zh', label: '中文 (Chinese)' },
];

const translations = {
    en: {
        appTitle: "Builder", myTemplates: "My Templates", noTemplates: "No saved templates",
        shareLink: "Share Link", linkCopied: "Copied!", saveTemplate: "Save Template", saved: "Saved",
        formHeader: "Form Header", titleLabel: "Title / Form Name", artistLabel: "Artist Name",
        prefLangLabel: "Preferred Languages", addLang: "Add Language", themeLabel: "Theme",
        fieldLabel: "Field Label", makeOptional: "Make optional", makeRequired: "Make required",
        unlock: "Unlock", lock: "Lock from editing", deleteField: "Delete field", moveUp: "Move Up", moveDown: "Move Down",
        presetValue: "Preset Value (Locked)", defaultValue: "Default Value", contentContent: "Content Text",
        dropdown: "Dropdown", list: "List", buttons: "Buttons", optionsLabel: "Options (Check to preset/lock)",
        addOption: "Add Option", addItem: "Add Item", addAnother: "Add Another",
        defaultItems: "Default Items", linkUrl: "Link URL", requireClick: "Require Click",
        agreementItems: "Agreement Items", addAgreement: "Add Agreement", checkboxText: "Checkbox Text",
        enterText: "Enter text...", enterDesc: "Enter description...", itemName: "Item Name",
        optionLabel: "Option", fileUpload: "File upload field",
        typeShort: "Short Text", typeLong: "Long Text", typeDynamic: "Dynamic List", typeSingle: "Single Select",
        typeMulti: "Multi Select", typeImages: "Images", typeConsent: "Agreement", typeInfo: "Text Block",
        formPreview: "Form Preview", livePreview: "Live Preview", submitPreview: "Submit (Preview)",
        downloadPdf: "Download PDF", uploadDisabled: "Upload disabled", clickToUpload: "Click to upload images",
        noImages: "No images attached", requiredField: "Required", requiredOpenLink: "Required to open link",
        openDoc: "Open Document", langsLabel: "Languages:", wantOwn: "Want to make your own ArtForm?",
        createOwn: "Create Your Own", clickHere: "Click here!",
        alertLibsLoading: "Libraries loading...", alertFillRequired: "Please fill in all required fields *",
        alertValid: "Form valid! (Demo)", promptSaveName: "Template name:",
        confirmLoad: "Load template \"{name}\"?", confirmDelete: "Delete template?",
        errorLoad: "Error loading",
        defTitle: "Commission Slot", defArtist: "Anna Smith", defAgree: "I agree", defList: "List", defNewField: "New Field",
        lockTip: "Locking this option fixes its state"
    },
    ru: {
        appTitle: "Конструктор", myTemplates: "Мои шаблоны", noTemplates: "Нет шаблонов",
        shareLink: "Поделиться", linkCopied: "Скопировано!", saveTemplate: "Сохранить", saved: "Сохранено",
        formHeader: "Шапка", titleLabel: "Название", artistLabel: "Художник",
        prefLangLabel: "Языки", addLang: "Добавить язык", themeLabel: "Тема",
        fieldLabel: "Название поля", makeOptional: "Необязательно", makeRequired: "Обязательно",
        unlock: "Разблокировать", lock: "Заблокировать", deleteField: "Удалить",
        moveUp: "Вверх", moveDown: "Вниз", presetValue: "Значение (Lock)", defaultValue: "Значение",
        contentContent: "Текст", dropdown: "Выпадающий", list: "Список", buttons: "Кнопки",
        optionsLabel: "Опции (Выбрать для пресета)", addOption: "Добавить", addItem: "Добавить", addAnother: "Еще",
        defaultItems: "Пункты", linkUrl: "Ссылка", requireClick: "Кликнуть",
        agreementItems: "Пункты", addAgreement: "Добавить", checkboxText: "Текст согласия",
        enterText: "Введите текст...", enterDesc: "Описание...", itemName: "Название",
        optionLabel: "Опция", fileUpload: "Загрузка файлов",
        typeShort: "Строка", typeLong: "Текст", typeDynamic: "Список", typeSingle: "Один",
        typeMulti: "Несколько", typeImages: "Картинки", typeConsent: "Согласие", typeInfo: "Инфо",
        formPreview: "Предпросмотр", livePreview: "Живой просмотр", submitPreview: "Отправить",
        downloadPdf: "Скачать PDF", uploadDisabled: "Загрузка выкл.", clickToUpload: "Загрузить",
        noImages: "Нет картинок", requiredField: "Обязательно", requiredOpenLink: "Открыть ссылку",
        openDoc: "Открыть", langsLabel: "Языки:", wantOwn: "Хотите такую анкету?",
        createOwn: "Создать", clickHere: "Жми сюда!",
        alertLibsLoading: "Загрузка библиотек...", alertFillRequired: "Заполните обязательные поля *",
        alertValid: "Успешно!", promptSaveName: "Название:",
        confirmLoad: "Загрузить \"{name}\"?", confirmDelete: "Удалить?",
        errorLoad: "Ошибка",
        defTitle: "Слот", defArtist: "Художник", defAgree: "Согласен", defList: "Список", defNewField: "Поле",
        lockTip: "Замок фиксирует состояние"
    },
    uk: {
        appTitle: "Конструктор", myTemplates: "Шаблони", noTemplates: "Немає шаблонів",
        shareLink: "Поділитися", linkCopied: "Скопійовано!", saveTemplate: "Зберегти", saved: "Збережено",
        formHeader: "Шапка", titleLabel: "Назва", artistLabel: "Художник",
        prefLangLabel: "Мови", addLang: "Додати мову", themeLabel: "Тема",
        fieldLabel: "Назва поля", makeOptional: "Необов'язково", makeRequired: "Обов'язково",
        unlock: "Розблокувати", lock: "Заблокувати", deleteField: "Видалити",
        moveUp: "Вгору", moveDown: "Вниз", presetValue: "Значення (Lock)", defaultValue: "Значення",
        contentContent: "Текст", dropdown: "Випадаючий", list: "Список", buttons: "Кнопки",
        optionsLabel: "Опції (Обрати для пресету)", addOption: "Додати", addItem: "Додати", addAnother: "Ще",
        defaultItems: "Пункти", linkUrl: "Посилання", requireClick: "Клікнути",
        agreementItems: "Пункти", addAgreement: "Додати", checkboxText: "Текст згоди",
        enterText: "Введіть текст...", enterDesc: "Опис...", itemName: "Назва",
        optionLabel: "Опція", fileUpload: "Завантаження",
        typeShort: "Рядок", typeLong: "Текст", typeDynamic: "Список", typeSingle: "Один",
        typeMulti: "Кілька", typeImages: "Зображення", typeConsent: "Згода", typeInfo: "Інфо",
        formPreview: "Перегляд", livePreview: "Живий перегляд", submitPreview: "Відправити",
        downloadPdf: "Скачати PDF", uploadDisabled: "Завантаження вимк.", clickToUpload: "Завантажити",
        noImages: "Немає зображень", requiredField: "Обов'язково", requiredOpenLink: "Потрібно відкрити посилання",
        openDoc: "Відкрити", langsLabel: "Мови:", wantOwn: "Хочете таку анкету?",
        createOwn: "Створити", clickHere: "Тисни тут!",
        alertLibsLoading: "Завантаження...", alertFillRequired: "Заповніть обов'язкові поля *",
        alertValid: "Успішно!", promptSaveName: "Назва:",
        confirmLoad: "Завантажити \"{name}\"?", confirmDelete: "Видалити?",
        errorLoad: "Помилка",
        defTitle: "Слот", defArtist: "Художник", defAgree: "Згоден", defList: "Список", defNewField: "Поле",
        lockTip: "Замок фіксує стан"
    }
};

const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 0, g: 0, b: 0 };
};

const generateHashID = (str) => {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
};

// ==========================================
// 2. SUB-COMPONENTS
// ==========================================

// --- 2.1 HEADER COMPONENT ---
const Header = ({ lang, changeLanguage, t, isCopied, handleShareLink, handleSaveToStorage, setShowTemplateMenu, viewMode, themeStyles, isSaved }) => {
    if (viewMode) return null;

    return (
        <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-md sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Palette className={`w-8 h-8 ${themeStyles.textClass}`} style={themeStyles.textStyle} />
                        <h1 className="text-xl font-bold tracking-tight hidden sm:block">ArtForm <span className="text-gray-500 font-normal">{t('appTitle')}</span></h1>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1">
                        <Globe size={14} className="text-gray-400" />
                        <select
                            value={lang}
                            onChange={(e) => changeLanguage(e.target.value)}
                            className="bg-transparent border-none text-xs font-medium text-gray-300 focus:ring-0 cursor-pointer uppercase"
                        >
                            <option value="en">EN</option>
                            <option value="uk">UA</option>
                            <option value="ru">RU</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto">
                    <button onClick={() => setShowTemplateMenu(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-300 hover:bg-gray-800 border border-transparent hover:border-gray-700 whitespace-nowrap">
                        <FolderOpen size={18} /><span className="hidden sm:inline">{t('myTemplates')}</span>
                    </button>
                    <div className="h-6 w-px bg-gray-800 mx-1"></div>
                    <button onClick={handleShareLink} className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-blue-400 hover:bg-blue-900/20 border border-blue-900/30 whitespace-nowrap">
                        {isCopied ? <CheckCircle2 size={18} /> : <Share2 size={18} />} <span className="hidden sm:inline">{isCopied ? t('linkCopied') : t('shareLink')}</span>
                    </button>
                    <button onClick={handleSaveToStorage} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-white hover:opacity-90 whitespace-nowrap ${isSaved ? 'bg-green-500/20 text-green-400 !bg-none' : themeStyles.bgClass}`} style={isSaved ? {} : themeStyles.bgStyle}>
                        {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />} {isSaved ? t('saved') : t('saveTemplate')}
                    </button>
                </div>
            </div>
        </header>
    );
};

// --- 2.2 TEMPLATE MENU MODAL ---
const TemplateMenu = ({ show, onClose, savedTemplates, onLoad, onDelete, t }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><FolderOpen className="text-blue-400" size={20} /> {t('myTemplates')}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-2 space-y-2">
                    {savedTemplates.length === 0 ? (
                        <div className="text-center py-8 text-gray-500"><FileJson size={32} className="mx-auto mb-2 opacity-50" /><p>{t('noTemplates')}</p></div>
                    ) : (
                        savedTemplates.map(tpl => (
                            <div key={tpl.id} onClick={() => onLoad(tpl)} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 border border-gray-600 cursor-pointer group">
                                <div><h4 className="font-medium text-gray-200">{tpl.name}</h4><p className="text-xs text-gray-400">from {tpl.createdAt}</p></div>
                                <button onClick={(e) => onDelete(tpl.id, e)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-md opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// --- 2.3 BUILDER: FIELD CONFIGURATION CARD ---
const BuilderFieldCard = ({
    field, index, totalFields, t,
    onUpdate, onRemove, onMoveUp, onMoveDown,
    onAddOption, onUpdateOption, onRemoveOption,
    onAddListItem, onUpdateListItem, onRemoveListItem,
    onAddConsent, onUpdateConsent, onRemoveConsent,
    onToggleOptionLock, // New Handler
    onPresetSelection // New Handler for selecting values in builder
}) => {

    const isSelect = field.type === 'single_select' || field.type === 'multi_select';

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 shadow-sm group">
            <div className="flex items-start gap-4 mb-4">
                <div className="flex flex-col gap-1 mt-2">
                    <button onClick={() => onMoveUp(index, -1)} disabled={index === 0} className="p-1 rounded hover:bg-gray-700 text-gray-400 disabled:opacity-30" title={t('moveUp')}><ArrowUp size={18} /></button>
                    <button onClick={() => onMoveDown(index, 1)} disabled={index === totalFields - 1} className="p-1 rounded hover:bg-gray-700 text-gray-400 disabled:opacity-30" title={t('moveDown')}><ArrowDown size={18} /></button>
                </div>
                <div className="flex-1 space-y-4">
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="text-xs text-gray-500 font-mono uppercase mb-1 block">{field.type === 'info_text' ? t('contentContent') : t('fieldLabel')}</label>
                            <input type="text" value={field.label} onChange={(e) => onUpdate(field.id, 'label', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm focus:border-blue-500 outline-none" />
                        </div>
                        <div className="flex items-end gap-1 mt-6">
                            {field.type !== 'info_text' && (
                                <button onClick={() => onUpdate(field.id, 'isRequired', !field.isRequired)} className={`p-2 rounded-md border ${field.isRequired ? 'bg-red-900/30 border-red-600 text-red-400' : 'bg-gray-900 border-gray-700 text-gray-500'}`} title={field.isRequired ? t('makeOptional') : t('makeRequired')}><Asterisk size={18} /></button>
                            )}
                            {/* Hide global lock for select types as requested */}
                            {!isSelect && (
                                <button onClick={() => onUpdate(field.id, 'isLocked', !field.isLocked)} className={`p-2 rounded-md border ${field.isLocked ? 'bg-amber-900/30 border-amber-600 text-amber-400' : 'bg-gray-900 border-gray-700 text-gray-500'}`} title={field.isLocked ? t('unlock') : t('lock')}>{field.isLocked ? <Lock size={18} /> : <Unlock size={18} />}</button>
                            )}
                            <button onClick={() => onRemove(field.id)} className="p-2 rounded-md bg-gray-900 border border-transparent hover:border-red-800 text-gray-500 hover:text-red-400" title={t('deleteField')}><Trash2 size={18} /></button>
                        </div>
                    </div>

                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                        {field.type === 'consent' && (
                            <div className="space-y-4">
                                <label className="text-xs text-gray-500 font-mono uppercase">{t('agreementItems')}</label>
                                {field.options.map((opt) => (
                                    <div key={opt.id} className="flex flex-col gap-2 p-3 bg-gray-800 rounded-lg border border-gray-700">
                                        <div className="flex gap-2">
                                            <input type="text" value={opt.label} onChange={(e) => onUpdateConsent(field.id, opt.id, 'label', e.target.value)} placeholder={t('checkboxText')} className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500" />
                                            <button onClick={() => onRemoveConsent(field.id, opt.id)} className="text-gray-500 hover:text-red-400 px-2"><X size={16} /></button>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <div className="flex-1 flex items-center gap-2 bg-gray-900 border border-gray-600 rounded px-2">
                                                <LinkIcon size={12} className="text-gray-500" />
                                                <input
                                                    type="text"
                                                    value={opt.link}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        onUpdateConsent(field.id, opt.id, 'link', val);
                                                        if (!val) onUpdateConsent(field.id, opt.id, 'requireOpen', false);
                                                    }}
                                                    placeholder={t('linkUrl') + ' (Optional)'}
                                                    className="flex-1 bg-transparent border-none py-1.5 text-xs focus:ring-0 text-gray-300"
                                                />
                                            </div>
                                            <label className={`flex items-center gap-1 text-xs whitespace-nowrap transition-colors ${!opt.link ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-pointer'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={opt.requireOpen}
                                                    disabled={!opt.link}
                                                    onChange={(e) => onUpdateConsent(field.id, opt.id, 'requireOpen', e.target.checked)}
                                                    className="rounded bg-gray-900 border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                /> {t('requireClick')}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => onAddConsent(field.id)} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"><Plus size={14} /> {t('addAgreement')}</button>
                            </div>
                        )}

                        {field.type === 'dynamic_list' && (
                            <div className="space-y-3">
                                <label className="text-xs text-gray-500 font-mono uppercase">{t('defaultItems')}</label>
                                {field.value.map((item) => (
                                    <div key={item.id} className="flex gap-2 items-center">
                                        <input type="text" value={item.key} onChange={(e) => onUpdateListItem(field.id, item.id, 'key', e.target.value)} placeholder={t('itemName')} className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-500" />
                                        <button onClick={() => onRemoveListItem(field.id, item.id)} className="text-gray-500 hover:text-red-400 px-2"><X size={16} /></button>
                                    </div>
                                ))}
                                <button onClick={() => onAddListItem(field.id)} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2 font-medium"><Plus size={14} /> {t('addItem')}</button>
                            </div>
                        )}

                        {(field.type === 'single_select' || field.type === 'multi_select') && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs text-gray-500 font-mono uppercase">{t('optionsLabel')}</label>
                                    <div className="flex bg-gray-800 p-0.5 rounded-lg border border-gray-700">
                                        <button onClick={() => onUpdate(field.id, 'displayStyle', 'default')} className={`px-2 py-1 rounded text-[10px] ${field.displayStyle === 'default' ? 'bg-gray-600 text-white' : 'text-gray-500'}`}>{t('list')}</button>
                                        <button onClick={() => onUpdate(field.id, 'displayStyle', 'buttons')} className={`px-2 py-1 rounded text-[10px] ${field.displayStyle === 'buttons' ? 'bg-gray-600 text-white' : 'text-gray-500'}`}>{t('buttons')}</button>
                                    </div>
                                </div>
                                {field.options.map((opt) => {
                                    // Check if selected in builder (to reflect state for multi)
                                    const isSelected = Array.isArray(field.value) ? field.value.includes(opt.value) : field.value === opt.value;

                                    return (
                                        <div key={opt.id} className="flex gap-2 items-center">
                                            {/* Selection Control in Builder */}
                                            <div
                                                onClick={() => onPresetSelection(field.id, opt.value, field.type === 'multi_select')}
                                                className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-600 bg-gray-900'} ${field.type === 'single_select' ? 'rounded-full' : 'rounded-md'}`}
                                                title="Preset/Select default value"
                                            >
                                                {isSelected && <div className={`bg-white ${field.type === 'single_select' ? 'w-2 h-2 rounded-full' : 'w-3 h-3 rounded-sm'}`} />}
                                            </div>

                                            <input type="text" value={opt.label} onChange={(e) => onUpdateOption(field.id, opt.id, e.target.value)} className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-gray-500" />

                                            {/* Individual Lock */}
                                            <button
                                                onClick={() => onToggleOptionLock(field.id, opt.id)}
                                                className={`p-1.5 rounded border transition-colors ${opt.isLocked ? 'bg-amber-900/30 border-amber-600 text-amber-400' : 'border-gray-700 text-gray-500 hover:text-gray-300'}`}
                                                title={t('lockTip')}
                                            >
                                                {opt.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                                            </button>

                                            <button onClick={() => onRemoveOption(field.id, opt.id)} className="text-gray-500 hover:text-red-400 px-2"><X size={16} /></button>
                                        </div>
                                    )
                                })}
                                <button onClick={() => onAddOption(field.id)} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2 font-medium"><Plus size={14} /> {t('addOption')}</button>
                            </div>
                        )}

                        {field.type === 'short_text' && (
                            <>
                                <label className="text-xs text-gray-500 font-mono uppercase mb-1 block">{field.isLocked ? t('presetValue') : t('defaultValue')}</label>
                                <input type="text" value={field.value} onChange={(e) => onUpdate(field.id, 'value', e.target.value)} placeholder={t('enterText')} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm opacity-100 focus:outline-none focus:border-gray-500" />
                            </>
                        )}
                        {(field.type === 'long_text' || field.type === 'info_text') && (
                            <>
                                <label className="text-xs text-gray-500 font-mono uppercase mb-1 block">{field.type === 'info_text' ? t('contentContent') : (field.isLocked ? t('presetValue') : t('defaultValue'))}</label>
                                <textarea value={field.value} onChange={(e) => onUpdate(field.id, 'value', e.target.value)} placeholder={field.type === 'info_text' ? t('enterDesc') : t('enterText')} rows={field.type === 'info_text' ? 4 : 2} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500 resize-none" />
                            </>
                        )}
                        {field.type === 'file' && <div className="text-xs text-gray-500 italic border border-dashed border-gray-700 p-2 rounded text-center">{t('fileUpload')}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 2.4 PREVIEW: FIELD RENDERER ---
const PreviewFieldRenderer = ({
    field, viewMode, themeStyles, t,
    onValueChange, onDynamicItemChange, onDynamicItemRemove, onDynamicItemAdd,
    onFileUpload, onFileRemove, onLinkClick
}) => {

    if (field.type === 'info_text') {
        return (
            <div className="mt-6 mb-2">
                <h4 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-1 mb-2" style={{ color: themeStyles.activeColor }}>{field.label}</h4>
                <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{field.value || '...'}</div>
            </div>
        );
    }

    return (
        <div className="space-y-2 animate-fadeIn">
            <label className="block text-sm font-bold text-gray-700">
                {field.label || 'Untitled'}
                {field.isRequired && <span className="text-red-500 ml-1" title={t('requiredField')}>*</span>}
                {/* Global lock icon removed for Selects, shown only for simple fields */}
                {field.isLocked && (field.type !== 'single_select' && field.type !== 'multi_select') && <Lock size={12} className="inline ml-1 text-amber-500 mb-1" />}
            </label>

            {field.type === 'short_text' && <input type="text" required={field.isRequired} disabled={field.isLocked} value={field.value} onChange={(e) => onValueChange(field.id, e.target.value)} className={`w-full border rounded-lg px-4 py-2.5 transition-all ${field.isLocked ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : 'bg-white border-gray-300 focus:ring-2 focus:ring-offset-1 focus:border-transparent invalid:border-red-400 invalid:ring-red-400'}`} style={!field.isLocked ? themeStyles.ringStyle : {}} />}

            {field.type === 'long_text' && <textarea required={field.isRequired} disabled={field.isLocked} value={field.value} onChange={(e) => onValueChange(field.id, e.target.value)} rows={3} className={`w-full border rounded-lg px-4 py-2.5 transition-all resize-none ${field.isLocked ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : 'bg-white border-gray-300 focus:ring-2 focus:ring-offset-1 focus:border-transparent invalid:border-red-400'}`} style={!field.isLocked ? themeStyles.ringStyle : {}} />}

            {field.type === 'single_select' && (
                <>
                    {(!field.displayStyle || field.displayStyle === 'default') && (
                        <div className="relative">
                            <select
                                required={field.isRequired}
                                value={field.value}
                                // Disable main select only if selected option is locked? 
                                // Logic: If current selection is locked, can't change.
                                // OR if user tries to pick another one, it might be restricted.
                                // For simple HTML select, best to just disable if current selection is locked.
                                disabled={field.options.find(o => o.value === field.value)?.isLocked}
                                onChange={(e) => onValueChange(field.id, e.target.value)}
                                className={`w-full border rounded-lg px-4 py-2.5 appearance-none bg-white border-gray-300 disabled:bg-gray-100 disabled:text-gray-500`}
                                style={themeStyles.ringStyle}
                            >
                                <option value="">Select...</option>
                                {field.options.map(o => (
                                    // We can disable specific options in dropdown too if needed, but keeping it simple
                                    <option key={o.id} value={o.value}>{o.label} {o.isLocked ? '(Locked)' : ''}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-3.5 pointer-events-none text-gray-400"><List size={16} /></div>
                        </div>
                    )}
                    {field.displayStyle === 'buttons' && (
                        <div className="flex flex-wrap gap-2">
                            {field.options.map(o => {
                                const isSelected = field.value === o.value;
                                // const isDisabled = o.isLocked && !isSelected; // Cannot select if locked by someone else? No, instruction says "lock selects THIS option".
                                // Actually, if Single Select: "Clicking lock selects THIS option and blocks change".
                                // So if ANY option is locked, the whole field is effectively frozen on that option.
                                const isFieldLocked = field.options.some(opt => opt.isLocked);

                                return (
                                    <div
                                        key={o.id}
                                        onClick={() => !isFieldLocked && onValueChange(field.id, o.value)}
                                        className={`px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-all ${isSelected ? 'text-white border-transparent shadow-md' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'} ${isFieldLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        style={isSelected ? { backgroundColor: themeStyles.activeColor } : {}}
                                    >
                                        {o.label} {o.isLocked && <Lock size={10} className="inline ml-1" />}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {field.type === 'multi_select' && (
                <>
                    {(!field.displayStyle || field.displayStyle === 'default') && (
                        <div className={`border rounded-lg p-3 space-y-2 bg-white border-gray-300`}>
                            {field.options.map(o => {
                                const currentValues = Array.isArray(field.value) ? field.value : [];
                                const isChecked = currentValues.includes(o.value);
                                return (
                                    <label key={o.id} className={`flex items-center gap-2 text-sm ${o.isLocked ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer text-gray-700'}`}>
                                        <input type="checkbox" disabled={o.isLocked} checked={isChecked} onChange={() => onValueChange(field.id, o.value, true)} className="rounded border-gray-300 w-4 h-4" style={themeStyles.accentStyle} /> {o.label} {o.isLocked && <Lock size={10} />}
                                    </label>
                                );
                            })}
                        </div>
                    )}
                    {field.displayStyle === 'buttons' && (
                        <div className="flex flex-wrap gap-2">
                            {field.options.map((o) => {
                                const currentValues = Array.isArray(field.value) ? field.value : [];
                                const isSelected = currentValues.includes(o.value);
                                return (
                                    <div
                                        key={o.id}
                                        onClick={() => !o.isLocked && onValueChange(field.id, o.value, true)}
                                        className={`px-3 py-2 rounded-md border text-sm font-medium cursor-pointer transition-all select-none flex items-center gap-2 ${isSelected ? 'text-white border-transparent shadow-md' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'} ${o.isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        style={isSelected ? { backgroundColor: themeStyles.activeColor } : {}}
                                    >
                                        {o.label} {o.isLocked && <Lock size={10} />}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {field.type === 'dynamic_list' && (
                <div className="space-y-3">
                    {field.value.map((item) => (
                        <div key={item.id} className="flex gap-2 items-center">
                            <div className="w-1/3">
                                <input type="text" value={item.key} onChange={(e) => onDynamicItemChange(field.id, item.id, 'key', e.target.value)} placeholder={t('itemName')} disabled={field.isLocked && viewMode} className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                            </div>
                            <div className="flex-1">
                                <input type="text" value={item.text} onChange={(e) => onDynamicItemChange(field.id, item.id, 'text', e.target.value)} placeholder="..." disabled={field.isLocked && viewMode} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                            </div>
                            <button type="button" onClick={() => onDynamicItemRemove(field.id, item.id)} className="text-gray-400 hover:text-red-500 p-2"><X size={16} /></button>
                        </div>
                    ))}
                    <button type="button" onClick={() => onDynamicItemAdd(field.id)} className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"><Plus size={14} /> {t('addAnother')}</button>
                </div>
            )}

            {field.type === 'file' && (
                <div className="space-y-3">
                    <div className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors group ${field.isLocked ? 'bg-gray-50 border-gray-200 cursor-not-allowed' : 'border-gray-300 hover:border-gray-400 cursor-pointer hover:bg-gray-50'}`}>
                        <input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={field.isLocked} onChange={(e) => onFileUpload(field.id, e)} />
                        <Paperclip className="mx-auto text-gray-400 mb-2 group-hover:text-gray-600" size={24} />
                        <span className="text-sm text-gray-500">{field.isLocked ? t('uploadDisabled') : t('clickToUpload')}</span>
                    </div>
                    {field.value && field.value.length > 0 && (
                        <div className="grid gap-2">
                            {field.value.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        {file.type.startsWith('image/') ? <ImageIcon size={14} className="text-blue-500" /> : <FileText size={14} className="text-gray-500" />}
                                        <span className="truncate max-w-[200px]">{file.name}</span>
                                    </div>
                                    <button type="button" onClick={() => onFileRemove(field.id, idx)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {field.type === 'consent' && (
                <div className="space-y-2">
                    {field.options.map(opt => {
                        const isChecked = (Array.isArray(field.value) ? field.value : []).includes(opt.id);
                        const linkVisited = (field.linkVisited || {})[opt.id];
                        return (
                            <div key={opt.id} className={`border rounded-lg p-3 transition-all ${isChecked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                                <div className="flex items-start gap-3">
                                    <input type="checkbox" id={`c-${opt.id}`} checked={isChecked} disabled={opt.requireOpen && !linkVisited} onChange={() => onValueChange(field.id, opt.id, true)} className="w-5 h-5 rounded border-gray-300" style={themeStyles.accentStyle} />
                                    <div className="text-sm flex-1">
                                        <label htmlFor={`c-${opt.id}`} className={`block font-medium ${opt.requireOpen && !linkVisited ? 'text-gray-400' : 'text-gray-900 cursor-pointer'}`}>{opt.label}</label>
                                        {opt.link && <div onClick={() => onLinkClick(field.id, opt.id, opt.link)} className="mt-1 inline-flex items-center gap-1 text-blue-500 hover:underline cursor-pointer"><LinkIcon size={12} /> {t('openDoc')}</div>}
                                        {opt.requireOpen && !linkVisited && <p className="text-xs text-amber-500 mt-1 flex items-center gap-1"><Lock size={10} /> {t('requiredOpenLink')}</p>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ==========================================
// 3. MAIN APP COMPONENT
// ==========================================

const App = () => {
    // --- LOCALIZATION ---
    const getBrowserLang = () => {
        const saved = localStorage.getItem('artform_lang');
        if (saved) return saved;
        const l = navigator.language || navigator.userLanguage || 'en';
        if (l.startsWith('ru')) return 'ru';
        if (l.startsWith('uk')) return 'uk';
        return 'en';
    };
    const [lang, setLang] = useState('en');
    useEffect(() => { setLang(getBrowserLang()); }, []);
    const changeLanguage = (l) => { setLang(l); localStorage.setItem('artform_lang', l); };
    const t = (key, params = {}) => {
        let text = translations[lang]?.[key] || translations['en'][key] || key;
        Object.keys(params).forEach(param => { text = text.replace(`{${param}}`, params[param]); });
        return text;
    };

    // --- CORE STATE ---
    const [headerInfo, setHeaderInfo] = useState({ title: 'Comission template', artist: 'Jane doe', preferredLanguages: ['en'] });
    const [fields, setFields] = useState([
        { id: '1', type: 'short_text', label: 'Your name', value: '', displayStyle: 'default', options: [], isLocked: false, isRequired: true },
        { id: '6', type: 'dynamic_list', label: 'Contacts', value: [{ id: 'def1', key: 'Telegram', text: '' }, { id: 'def2', key: 'Email', text: '' }], displayStyle: 'default', options: [], isLocked: false, isRequired: true },
        { id: '2', type: 'long_text', label: 'Your idea', value: '', displayStyle: 'default', options: [], isLocked: false, isRequired: true },
        { id: '3', type: 'single_select', label: 'Format', value: 'head', displayStyle: 'buttons', options: [{ id: 'opt1', label: 'Head', value: 'head' }, { id: 'opt2', label: 'Half', value: 'half' }, { id: 'opt3', label: 'Full', value: 'full' }], isLocked: false, isRequired: true },
        { id: '4', type: 'single_select', label: 'Complexity', value: 'sketch', displayStyle: 'buttons', options: [{ id: 'opt1', label: 'Sketch', value: 'sketch' }, { id: 'opt2', label: 'Flat color', value: 'flat' }, { id: 'opt3', label: 'Full render', value: 'render' }], isLocked: false, isRequired: true },
        { id: '5', type: 'file', label: 'Reference Images', value: [], displayStyle: 'default', options: [], isLocked: false, isRequired: false }
    ]);
    const [themeColor, setThemeColor] = useState('purple');
    const [customColor, setCustomColor] = useState('#6366f1');
    const [isSaved, setIsSaved] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [savedTemplates, setSavedTemplates] = useState([]);
    const [showTemplateMenu, setShowTemplateMenu] = useState(false);
    const [viewMode, setViewMode] = useState(false);

    // --- DERIVED & HOOKS ---
    const activeColorHex = themeColor === 'custom' ? customColor : { purple: '#9333ea', blue: '#2563eb', emerald: '#059669', rose: '#e11d48', amber: '#d97706' }[themeColor];

    const langSelectRef = useRef();

    const configHash = useMemo(() => {
        const configString = JSON.stringify({
            headerInfo, fields: fields.map(f => {
                if (f.type === 'info_text') return { ...f, value: f.value }; // Keep info text content
                if (f.type === 'dynamic_list') return { ...f, value: undefined };
                if (f.type === 'consent') return { ...f, value: undefined, linkVisited: undefined };
                return { ...f, value: undefined, linkVisited: undefined };
            }), themeColor, customColor
        });
        return generateHashID(configString);
    }, [headerInfo, fields, themeColor, customColor]);

    const themeStyles = useMemo(() => {
        const isCustom = themeColor === 'custom';
        return {
            bgClass: isCustom ? '' : { purple: 'bg-purple-600', blue: 'bg-blue-600', emerald: 'bg-emerald-600', rose: 'bg-rose-600', amber: 'bg-amber-600' }[themeColor],
            bgStyle: isCustom ? { backgroundColor: customColor } : {},
            textClass: isCustom ? '' : { purple: 'text-purple-400', blue: 'text-blue-400', emerald: 'text-emerald-400', rose: 'text-rose-400', amber: 'text-amber-400' }[themeColor],
            textStyle: isCustom ? { color: customColor } : {},
            ringStyle: isCustom ? { '--tw-ring-color': customColor, borderColor: customColor } : { '--tw-ring-color': activeColorHex },
            activeColor: activeColorHex,
            accentStyle: { accentColor: activeColorHex }
        };
    }, [themeColor, customColor, activeColorHex]);

    // --- LIFECYCLE ---
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const compressedData = params.get('f');
        if (compressedData) {
            try {
                const decompressed = LZString.decompressFromEncodedURIComponent(compressedData);
                if (decompressed) {
                    const parsed = JSON.parse(decompressed);
                    setHeaderInfo(parsed.headerInfo);
                    setFields(parsed.fields);
                    setThemeColor(parsed.themeColor);
                    if (parsed.customColor) setCustomColor(parsed.customColor);
                    setViewMode(true);
                }
            } catch (e) { console.error(e); }
        }
        const loaded = localStorage.getItem('artform_templates');
        if (loaded) try { setSavedTemplates(JSON.parse(loaded)); } catch { /* empty */ }
    }, []);

    // --- ACTIONS: HEADER & TEMPLATES ---
    const handleShareLink = () => {
        if (!LZString) { alert(t('alertLibsLoading')); return; }
        const data = {
            headerInfo, fields: fields.map(f => {
                console.log(f)
                if (f.type === 'info_text') return { ...f, value: f.value }; // Persist info text
                if (f.type === 'dynamic_list') return { ...f, value: f.value.map(v => ({ ...v, text: '' })) };
                if (f.type === 'consent') return { ...f, value: [], linkVisited: {} };
                if (f.type === 'single_select' && f.options.some(v => v.isLocked)) return { ...f }
                if (f.type === 'multi_select' && f.options.some(v => v.isLocked)) return { ...f }
                // Preserve lock states and options
                return { ...f, value: (f.type === 'file' ? [] : ''), linkVisited: false };
            }), themeColor, customColor
        };

        const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(data));
        const url = `${window.location.origin}${window.location.pathname}?f=${compressed}`;
        navigator.clipboard.writeText(url).then(() => { setIsCopied(true); setTimeout(() => setIsCopied(false), 3000); });
    };

    const handleSaveToStorage = () => {
        const name = prompt(t('promptSaveName'), headerInfo.title);
        if (!name) return;
        const newTpl = { id: Date.now().toString(), name, createdAt: new Date().toLocaleDateString('en-US'), data: { headerInfo, fields, themeColor, customColor } };
        const updated = [...savedTemplates, newTpl];
        setSavedTemplates(updated);
        localStorage.setItem('artform_templates', JSON.stringify(updated));
        setIsSaved(true); setTimeout(() => setIsSaved(false), 3000);
    };

    const loadTemplate = (template) => {
        if (!window.confirm(t('confirmLoad', { name: template.name }))) return;
        try {
            const { headerInfo, fields, themeColor, customColor } = template.data;
            setHeaderInfo(headerInfo);
            setFields(fields);
            setThemeColor(themeColor);
            if (customColor) setCustomColor(customColor);
            setShowTemplateMenu(false);
        } catch { alert(t('errorLoad')); }
    };

    const deleteTemplate = (id, e) => {
        e.stopPropagation();
        if (!window.confirm(t('confirmDelete'))) return;
        const updated = savedTemplates.filter(t => t.id !== id);
        setSavedTemplates(updated);
        localStorage.setItem('artform_templates', JSON.stringify(updated));
    };

    // --- ACTIONS: BUILDER (FIELD CRUD) ---
    const addField = (type) => {
        const newF = { id: Date.now().toString(), type, label: type === 'consent' ? t('defAgree') : (type === 'dynamic_list' ? t('defList') : t('defNewField')), value: type === 'multi_select' || type === 'dynamic_list' || type === 'file' || type === 'consent' ? [] : '', displayStyle: 'default', linkUrl: '', requireLinkOpen: false, linkVisited: {}, options: (type === 'single_select' || type === 'multi_select') ? [{ id: Date.now() + '1', label: t('optionLabel') + ' 1', value: 'opt1', isLocked: false }] : [], isLocked: false, isRequired: type === 'consent' };
        if (type === 'dynamic_list') newF.value = [{ id: Date.now() + 'dl', key: t('itemName'), text: '' }];
        if (type === 'consent') newF.options = [{ id: Date.now() + 'c1', label: t('checkboxText'), link: '', requireOpen: false }];
        setFields([...fields, newF]);
    };
    const removeField = (id) => setFields(fields.filter(f => f.id !== id));
    const updateField = (id, k, v) => setFields(fields.map(f => f.id === id ? { ...f, [k]: v } : f));
    const moveField = (idx, dir) => {
        if ((dir === -1 && idx === 0) || (dir === 1 && idx === fields.length - 1)) return;
        const newF = [...fields];[newF[idx], newF[idx + dir]] = [newF[idx + dir], newF[idx]]; setFields(newF);
    };

    // --- ACTIONS: SUB-ITEMS CRUD ---
    const modifySubItem = (type, fieldId, action, payload) => {
        setFields(fields.map(f => {
            if (f.id !== fieldId) return f;
            if (type === 'option') {
                if (action === 'add') return { ...f, options: [...f.options, { id: Date.now().toString(), label: `${t('optionLabel')} ${f.options.length + 1}`, value: `opt${Date.now()}`, isLocked: false }] };
                if (action === 'update') return { ...f, options: f.options.map(o => o.id === payload.id ? { ...o, label: payload.val } : o) };
                if (action === 'remove') return { ...f, options: f.options.filter(o => o.id !== payload.id) };
            }
            if (type === 'list') {
                if (action === 'add') return { ...f, value: [...f.value, { id: Date.now().toString(), key: '', text: '' }] };
                if (action === 'update') return { ...f, value: f.value.map(i => i.id === payload.id ? { ...i, [payload.prop]: payload.val } : i) };
                if (action === 'remove') return { ...f, value: f.value.filter(i => i.id !== payload.id) };
            }
            if (type === 'consent') {
                if (action === 'add') return { ...f, options: [...f.options, { id: Date.now().toString(), label: t('checkboxText'), link: '', requireOpen: false }] };
                if (action === 'update') return { ...f, options: f.options.map(o => o.id === payload.id ? { ...o, [payload.prop]: payload.val } : o) };
                if (action === 'remove') return { ...f, options: f.options.filter(o => o.id !== payload.id) };
            }
            return f;
        }));
    };

    const addOption = (fid) => modifySubItem('option', fid, 'add');
    const updateOption = (fid, oid, val) => modifySubItem('option', fid, 'update', { id: oid, val });
    const removeOption = (fid, oid) => modifySubItem('option', fid, 'remove', { id: oid });

    const addListItem = (fid) => modifySubItem('list', fid, 'add');
    const updateListItem = (fid, iid, prop, val) => modifySubItem('list', fid, 'update', { id: iid, prop, val });
    const removeListItem = (fid, iid) => modifySubItem('list', fid, 'remove', { id: iid });

    const addConsent = (fid) => modifySubItem('consent', fid, 'add');
    const updateConsent = (fid, oid, prop, val) => modifySubItem('consent', fid, 'update', { id: oid, prop, val });
    const removeConsent = (fid, oid) => modifySubItem('consent', fid, 'remove', { id: oid });

    // --- OPTION LOCKING LOGIC ---
    const toggleOptionLock = (fieldId, optionId) => {
        setFields(prev => prev.map(f => {
            if (f.id !== fieldId) return f;

            if (f.type === 'single_select') {
                // Single select lock: select this, lock this, unlock others
                const target = f.options.find(o => o.id === optionId);
                const isLocking = !target.isLocked;
                return {
                    ...f,
                    value: isLocking ? target.value : f.value, // if locking, set value
                    options: f.options.map(o => ({
                        ...o,
                        isLocked: o.id === optionId ? isLocking : false // mutex lock
                    }))
                };
            }

            if (f.type === 'multi_select') {
                // Multi select lock: toggle lock state. Value is preserved in f.value array.
                return {
                    ...f,
                    options: f.options.map(o => o.id === optionId ? { ...o, isLocked: !o.isLocked } : o)
                };
            }
            return f;
        }));
    };

    // --- PREVIEW INTERACTION ---
    const handlePreviewValue = (fieldId, val, isMulti) => {
        setFields(fields.map(f => {
            if (f.id !== fieldId) return f;
            if (isMulti) {
                const curr = Array.isArray(f.value) ? f.value : [];
                const next = curr.includes(val) ? curr.filter(v => v !== val) : [...curr, val];
                return { ...f, value: next };
            }
            return { ...f, value: val };
        }));
    };

    const onPresetSelection = (fieldId, val, isMulti) => {
        handlePreviewValue(fieldId, val, isMulti);
    };

    const handleFileUpload = (fieldId, e) => {
        const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
        Promise.all(files.map(file => new Promise(resolve => {
            const r = new FileReader(); r.onloadend = () => resolve({ name: file.name, type: file.type, data: r.result }); r.readAsDataURL(file);
        }))).then(newFiles => {
            setFields(fields.map(f => f.id === fieldId ? { ...f, value: [...(f.value || []), ...newFiles] } : f));
        });
    };

    const removeFile = (fieldId, idx) => {
        setFields(fields.map(f => f.id === fieldId ? { ...f, value: f.value.filter((_, i) => i !== idx) } : f));
    };

    const handlePreviewSubmit = (e) => {
        e.preventDefault();
        const invalid = fields.filter(f => {
            if (f.type === 'dynamic_list') return f.isRequired && (!f.value || f.value.length === 0);
            if (f.type === 'consent' && f.isRequired) { const checked = f.value || []; return f.options.some(o => !checked.includes(o.id)); }
            if (f.type === 'file') return f.isRequired && f.value.length === 0;
            if (f.type === 'info_text') return false;
            return f.isRequired && (!f.value || (Array.isArray(f.value) && f.value.length === 0));
        });
        if (invalid.length > 0) { alert(t('alertFillRequired')); return; }
        alert(t('alertValid'));
    };

    const handleGeneratePDF = async (e) => {
        e.preventDefault();
        const invalid = fields.filter(f => {
            if (f.type === 'dynamic_list') return f.isRequired && (!f.value || f.value.length === 0);
            if (f.type === 'consent' && f.isRequired) { const checked = f.value || []; return f.options.some(o => !checked.includes(o.id)); }
            if (f.type === 'file') return f.isRequired && f.value.length === 0;
            if (f.type === 'info_text') return false;
            if (f.type === 'info_text') return false;
            return f.isRequired && (!f.value || (Array.isArray(f.value) && f.value.length === 0));
        });
        if (invalid.length > 0) { alert(t('alertFillRequired')); return; }

        const doc = new jsPDF();

        try {
            const response = await fetch(FontUrl);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            await new Promise(resolve => reader.onloadend = resolve);
            const base64data = reader.result.split(',')[1];

            doc.addFileToVFS("Bahnschrift.ttf", base64data);
            doc.addFont("Bahnschrift.ttf", "Bahnschrift", "normal");

            doc.addFileToVFS("Bahnschrift-bold.ttf", base64data);
            doc.addFont("Bahnschrift-bold.ttf", "Bahnschrift", "bold");

            doc.setFont("Bahnschrift");
        } catch (err) {
            console.error("Could not load font, falling back to default", err);
        }

        const margin = 10;
        let yPos = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const contentWidth = pageWidth - (margin * 2);
        const { r, g, b } = hexToRgb(activeColorHex);

        doc.setFillColor(r, g, b); doc.rect(0, 0, pageWidth, 15, 'F');
        const date = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
        doc.setFontSize(8); doc.setTextColor(150, 150, 150);
        const meta = `Generated: ${date} • ID: ${configHash}`;
        doc.text(meta, pageWidth - margin - doc.getTextWidth(meta), 25);

        yPos = 30;
        doc.setFontSize(24); doc.setTextColor(40, 40, 40); doc.setFont(undefined, 'bold');
        doc.text(headerInfo.title, margin, yPos); yPos += 10;
        doc.setFontSize(12); doc.setTextColor(100, 100, 100); doc.setFont(undefined, 'normal');
        doc.text(`Artist: ${headerInfo.artist}`, margin, yPos); yPos += 6;

        if (headerInfo.preferredLanguages?.length > 0) {
            const langs = headerInfo.preferredLanguages.map(c => AVAILABLE_LANGS.find(l => l.code === c)?.label.split(' ')[0] || c.toUpperCase()).join(', ');
            doc.setFontSize(10); doc.setTextColor(130, 130, 130); doc.text(`Languages: ${langs}`, margin, yPos); yPos += 8;
        } else yPos += 2;

        doc.setDrawColor(r, g, b); doc.setLineWidth(0.5); doc.line(margin, yPos, pageWidth - margin, yPos); yPos += 15;

        fields.forEach(f => {
            if (yPos > pageHeight - margin - 20) { doc.addPage(); yPos = 20; doc.setFillColor(r, g, b); doc.rect(0, 0, pageWidth, 5, 'F'); yPos += 10; }

            if (f.type === 'info_text') {
                doc.setFontSize(14); doc.setTextColor(r, g, b); doc.setFont(undefined, 'bold'); doc.text(f.label, margin, yPos); yPos += 6;
                doc.setFontSize(10); doc.setTextColor(80, 80, 80); doc.setFont(undefined, 'normal');
                const lines = doc.splitTextToSize(f.value || '', contentWidth); doc.text(lines, margin, yPos); yPos += (lines.length * 5) + 10;
                return;
            }

            doc.setFontSize(10); doc.setTextColor(r, g, b); doc.setFont(undefined, 'bold'); doc.text(f.label.toUpperCase(), margin, yPos); yPos += 6;
            doc.setFontSize(12); doc.setTextColor(20, 20, 20); doc.setFont(undefined, 'normal');

            if (f.type === 'file') {
                if (!f.value || f.value.length === 0) { doc.text("No images", margin, yPos); yPos += 8; }
                else {
                    f.value.forEach(file => {
                        if (file.type.startsWith('image/')) {
                            try {
                                const props = doc.getImageProperties(file.data);
                                let w = contentWidth, h = (props.height * w) / props.width;
                                if (h > pageHeight - 40) { h = pageHeight - 40; w = (props.width * h) / props.height; }
                                if (yPos + h > pageHeight - margin) { doc.addPage(); yPos = 20; doc.setFillColor(r, g, b); doc.rect(0, 0, pageWidth, 5, 'F'); yPos += 10; }
                                doc.addImage(file.data, file.type.split('/')[1].toUpperCase(), margin + (contentWidth - w) / 2, yPos, w, h); yPos += h + 10;
                            } catch { doc.text("[Image Error]", margin, yPos); yPos += 8; }
                        }
                    });
                    yPos += 5;
                }
            } else if (f.type === 'dynamic_list') {
                if (!f.value || f.value.length === 0) { doc.text("—", margin, yPos); yPos += 8; }
                else {
                    f.value.forEach(i => {
                        const l = `${i.key}: ${i.text || '—'}`;
                        const sl = doc.splitTextToSize(l, contentWidth - 4);
                        const h = (sl.length * 6) + 4;
                        doc.setFillColor(250, 250, 250); doc.setDrawColor(230, 230, 230); doc.rect(margin, yPos - 4, contentWidth, h, 'FD');
                        doc.text(sl, margin + 2, yPos + 1); yPos += h + 2;
                    });
                    yPos += 6;
                }
            } else if (f.type === 'consent') {
                f.options.forEach(o => {
                    const chk = (f.value || []).includes(o.id) ? "[x]" : "[ ]";
                    const l = `${chk} ${o.label}`;
                    const sl = doc.splitTextToSize(l, contentWidth);
                    doc.text(sl, margin, yPos); yPos += (sl.length * 6) + 2;
                });
                yPos += 6;
            } else {
                let txt = "—";
                if (f.value) {
                    if (Array.isArray(f.value)) txt = f.value.map(v => f.options?.find(o => o.value === v)?.label || v).join(', ');
                    else txt = f.options?.find(o => o.value === f.value)?.label || String(f.value);
                }
                const sl = doc.splitTextToSize(txt, contentWidth - 4);
                const h = (sl.length * 6) + 6;
                doc.setFillColor(250, 250, 250); doc.setDrawColor(230, 230, 230); doc.rect(margin, yPos - 4, contentWidth, h, 'FD');
                doc.text(sl, margin + 2, yPos + 1); yPos += h + 8;
            }
        });
        doc.save(`${headerInfo.title.replace(/\s+/g, '_')}_Commission.pdf`);
    };

    const fieldTypes = [{ type: 'short_text', label: t('typeShort'), icon: Type }, { type: 'long_text', label: t('typeLong'), icon: AlignLeft }, { type: 'info_text', label: t('typeInfo'), icon: FileText }, { type: 'dynamic_list', label: t('typeDynamic'), icon: ListPlus }, { type: 'single_select', label: t('typeSingle'), icon: List }, { type: 'multi_select', label: t('typeMulti'), icon: CheckSquare }, { type: 'file', label: t('typeImages'), icon: ImageIcon }, { type: 'consent', label: t('typeConsent'), icon: CheckCircle2 },];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-gray-700 relative flex flex-col">
            <TemplateMenu show={showTemplateMenu} onClose={() => setShowTemplateMenu(false)} savedTemplates={savedTemplates} onLoad={loadTemplate} onDelete={deleteTemplate} t={t} />
            <Header lang={lang} changeLanguage={changeLanguage} t={t} isCopied={isCopied} handleShareLink={handleShareLink} handleSaveToStorage={handleSaveToStorage} setShowTemplateMenu={setShowTemplateMenu} viewMode={viewMode} themeStyles={themeStyles} isSaved={isSaved} />

            <main className={`max-w-7xl mx-auto px-4 py-8 grid gap-8 transition-all ${viewMode ? 'grid-cols-1 max-w-3xl' : 'grid-cols-1 lg:grid-cols-12'}`}>
                {!viewMode && (
                    <section className="lg:col-span-7 space-y-6">
                        <div className="bg-gray-800/30 p-5 rounded-xl border border-gray-800 space-y-5">
                            <div className="flex items-center gap-2 mb-2"><LayoutTemplate className="w-5 h-5 text-gray-400" /><h2 className="text-lg font-semibold text-gray-200">{t('formHeader')}</h2></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500 font-mono uppercase">{t('titleLabel')}</label>
                                    <input type="text" value={headerInfo.title} onChange={(e) => setHeaderInfo(prev => ({ ...prev, title: e.target.value }))} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500 font-mono uppercase">{t('artistLabel')}</label>
                                    <input type="text" value={headerInfo.artist} onChange={(e) => setHeaderInfo(prev => ({ ...prev, artist: e.target.value }))} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" />
                                </div>
                            </div>
                            <div className="border-t border-gray-700/50 pt-4 space-y-3">
                                <div className="flex items-center gap-2"><Languages className="w-4 h-4 text-gray-500" /><span className="text-sm text-gray-400">{t('prefLangLabel')}</span></div>
                                <div className="flex flex-wrap gap-2">
                                    {(headerInfo.preferredLanguages || []).map(code => (
                                        <div key={code} className="flex items-center gap-1 bg-gray-900 border border-gray-700 px-2 py-1 rounded-md text-sm text-gray-300">
                                            <span>{AVAILABLE_LANGS.find(l => l.code === code)?.flag} {AVAILABLE_LANGS.find(l => l.code === code)?.label}</span>
                                            <div className="flex items-center ml-2 border-l border-gray-700 pl-2 gap-1">
                                                <button onClick={() => { const ls = [...headerInfo.preferredLanguages], i = ls.indexOf(code); if (i > 0) { [ls[i], ls[i - 1]] = [ls[i - 1], ls[i]]; setHeaderInfo({ ...headerInfo, preferredLanguages: ls }); } }} className="hover:text-white"><ArrowUp size={12} /></button>
                                                <button onClick={() => setHeaderInfo(p => ({ ...p, preferredLanguages: p.preferredLanguages.filter(c => c !== code) }))} className="hover:text-red-400"><X size={12} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <select
                                        ref={langSelectRef}
                                        className="bg-gray-900 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-300 outline-none focus:border-blue-500"
                                        defaultValue=""
                                        onChange={(e) => {
                                            const value = e.target.value.trim();

                                            console.log("select value:", JSON.stringify(value));
                                            console.log("before:", headerInfo.preferredLanguages);

                                            if (value && !headerInfo.preferredLanguages.includes(value)) {
                                                setHeaderInfo(p => ({
                                                    ...p,
                                                    preferredLanguages: [...p.preferredLanguages, value]
                                                }));
                                            }

                                            // безопасный сброс — НЕ вызывает повторный onChange
                                            langSelectRef.current.value = "";
                                        }}
                                    >
                                        <option value="">{t('addLang')}...</option>
                                        {AVAILABLE_LANGS
                                            .filter(l => !headerInfo.preferredLanguages.includes(l.code))
                                            .map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                                    </select>

                                </div>
                            </div>
                            <div className="border-t border-gray-700/50 pt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2"><Brush className="w-4 h-4 text-gray-500" /><span className="text-sm text-gray-400">{t('themeLabel')}</span></div>
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-2">
                                        {Object.keys({ purple: 1, blue: 1, emerald: 1, rose: 1, amber: 1 }).map((c) => (
                                            <button key={c} onClick={() => setThemeColor(c)} className={`w-6 h-6 rounded-full ${c === 'purple' ? 'bg-purple-600' : c === 'blue' ? 'bg-blue-600' : c === 'emerald' ? 'bg-emerald-600' : c === 'rose' ? 'bg-rose-600' : 'bg-amber-600'} ${themeColor === c ? 'ring-2 ring-white scale-110' : 'opacity-50'}`} />
                                        ))}
                                    </div>
                                    <div className="w-px h-6 bg-gray-700 mx-1"></div>
                                    <label className={`relative cursor-pointer group flex items-center justify-center w-8 h-8 rounded-full border-2 ${themeColor === 'custom' ? 'border-white' : 'border-gray-600'}`}>
                                        <div className="w-full h-full rounded-full absolute inset-0 opacity-50" style={{ backgroundColor: customColor }} />
                                        <Pipette size={14} className="relative z-10 text-white" />
                                        <input type="color" value={customColor} onChange={(e) => { setCustomColor(e.target.value); setThemeColor('custom'); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <BuilderFieldCard
                                    key={field.id} field={field} index={index} totalFields={fields.length} t={t}
                                    onUpdate={updateField} onRemove={removeField} onMoveUp={moveField} onMoveDown={moveField}
                                    onAddOption={addOption} onUpdateOption={updateOption} onRemoveOption={removeOption}
                                    onAddListItem={addListItem} onUpdateListItem={updateListItem} onRemoveListItem={removeListItem}
                                    onAddConsent={addConsent} onUpdateConsent={updateConsent} onRemoveConsent={removeConsent}
                                    onToggleOptionLock={toggleOptionLock} onPresetSelection={onPresetSelection}
                                />
                            ))}
                            {fields.length === 0 && <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-xl text-gray-500">{t('listEmpty')}</div>}
                        </div>
                        <div className="sticky bottom-4 bg-gray-900/90 backdrop-blur border border-gray-700 p-4 rounded-xl shadow-2xl flex flex-wrap gap-2 justify-center z-10">
                            {fieldTypes.map((ft) => <button key={ft.type} onClick={() => addField(ft.type)} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5"><ft.icon size={16} className={themeStyles.textClass} style={themeStyles.textStyle} /> {ft.label}</button>)}
                        </div>
                    </section>
                )}

                <section className={`${viewMode ? 'col-span-1' : 'lg:col-span-5 lg:sticky lg:top-24'} h-fit animate-slideIn`}>
                    <div className="flex items-center gap-2 mb-6 justify-between">
                        {!viewMode && <div className="flex items-center gap-2"><Eye className="w-5 h-5 text-gray-400" /><h2 className="text-lg font-semibold text-gray-200">{t('formPreview')}</h2></div>}
                        {!viewMode && <span className="text-xs font-mono text-gray-500 uppercase">{t('livePreview')}</span>}
                    </div>
                    <form onSubmit={viewMode ? handleGeneratePDF : handlePreviewSubmit} className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-2xl min-h-[500px] flex flex-col transition-all">
                        <div className={`h-3 w-full ${themeStyles.bgClass}`} style={themeStyles.bgStyle} />
                        <div className="p-8 space-y-6 flex-1">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">{headerInfo.title || 'Title'}</h3>
                                <p className="text-gray-500 text-sm">By {headerInfo.artist || 'Artist Name'}</p>
                                {(headerInfo.preferredLanguages || []).length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3"><span className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-0.5">{t('langsLabel')}</span>
                                        {headerInfo.preferredLanguages.map(c => <span key={c} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">{AVAILABLE_LANGS.find(l => l.code === c)?.flag} {AVAILABLE_LANGS.find(l => l.code === c)?.label}</span>)}
                                    </div>
                                )}
                            </div>
                            {fields.map(f => (
                                <PreviewFieldRenderer
                                    key={f.id} field={f} viewMode={viewMode} themeStyles={themeStyles} t={t}
                                    onValueChange={handlePreviewValue} onDynamicItemChange={updateListItem}
                                    onDynamicItemRemove={removeListItem} onDynamicItemAdd={addListItem}
                                    onFileUpload={handleFileUpload} onFileRemove={removeFile} onLinkClick={(fid, oid, url) => { if (!url) return; window.open(url, '_blank'); setFields(fields.map(ff => ff.id === fid ? { ...ff, linkVisited: { ...ff.linkVisited, [oid]: true } } : ff)); }}
                                />
                            ))}
                        </div>
                        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-between items-center mt-auto">
                            <div className="text-xs text-gray-400 font-mono flex items-center gap-1.5"><Hash size={12} className="opacity-50" />{configHash}</div>
                            <button type="submit" className={`text-xs font-bold uppercase px-4 py-2 rounded text-white opacity-90 transition-opacity hover:opacity-100 ${themeStyles.bgClass}`} style={themeStyles.bgStyle}>
                                {viewMode ? <span className="flex items-center gap-2"><FileDown size={18} /> {t('downloadPdf')}</span> : t('submitPreview')}
                            </button>
                        </div>
                    </form>
                    {viewMode && (
                        <div className="mt-8 text-center">
                            <p className="text-gray-500 text-sm">{t('wantOwn')} <a href={window.location.pathname} onClick={(e) => { e.preventDefault(); window.location.href = window.location.origin + window.location.pathname; }} className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">{t('clickHere')}</a></p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default App;