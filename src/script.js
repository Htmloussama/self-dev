/**
 * Pr.Oussama Educational Platform - Shared Scripts
 * Handles Theme Customization, Language Toggle, and UI Interactions
 */

// --- THEME PRESETS ---
const THEME_ACADEMIQUE = {
    name: 'Académique',
    bg: '#0A0E2A',
    surface: 'rgba(17, 25, 54, 0.7)',
    accent: '#00D4FF',
    highlight: '#FFD700',
    text: '#E8EAF6',
    textMuted: '#8892B0',
    radius: '12px',
    fontHeading: "'Playfair Display', serif",
    fontBody: "'Source Serif 4', serif",
    cardStyle: 'glass'
};

const THEME_MINIMALISTE = {
    name: 'Minimaliste',
    bg: '#F5F5F0',
    surface: '#FFFFFF',
    accent: '#1A1A2E',
    highlight: '#E63946',
    text: '#1A1A2E',
    textMuted: '#666666',
    radius: '0px',
    fontHeading: "'DM Sans', sans-serif",
    fontBody: "'DM Serif Display', serif",
    cardStyle: 'flat'
};

const THEME_CYBER = {
    name: 'Cyber Sombre',
    bg: '#0D0D0D',
    surface: 'rgba(20, 20, 20, 0.8)',
    accent: '#39FF14',
    highlight: '#FF00FF',
    text: '#39FF14',
    textMuted: '#008F11',
    radius: '4px',
    fontHeading: "'Space Mono', monospace",
    fontBody: "'IBM Plex Mono', monospace",
    cardStyle: 'outlined'
};

const THEME_DESERT = {
    name: 'Désert Chaud',
    bg: '#1C1208',
    surface: 'rgba(45, 30, 15, 0.7)',
    accent: '#F4A261',
    highlight: '#E9C46A',
    text: '#F1E3D3',
    textMuted: '#A68A64',
    radius: '20px',
    fontHeading: "'Cormorant Garamond', serif",
    fontBody: "'Lato', sans-serif",
    cardStyle: 'glass'
};

const THEME_OCEAN = {
    name: 'Océan Propre',
    bg: '#E8F4F8',
    surface: '#FFFFFF',
    accent: '#0077B6',
    highlight: '#00B4D8',
    text: '#023E8A',
    textMuted: '#48CAE4',
    radius: '16px',
    fontHeading: "'Nunito', sans-serif",
    fontBody: "'Merriweather', serif",
    cardStyle: 'flat'
};

const THEMES = {
    'académique': THEME_ACADEMIQUE,
    'minimaliste': THEME_MINIMALISTE,
    'cyber': THEME_CYBER,
    'désert': THEME_DESERT,
    'océan': THEME_OCEAN
};

// --- STATE ---
let currentTheme = { ...THEME_ACADEMIQUE };
let currentLang = 'FR';
let isLightMode = false;

// --- CORE FUNCTIONS ---

function applyTheme(themeObj) {
    const root = document.documentElement;
    
    let bg = themeObj.bg;
    let surface = themeObj.surface;
    let text = themeObj.text;
    let textMuted = themeObj.textMuted;
    let border = 'rgba(255, 255, 255, 0.1)';

    if (isLightMode) {
        bg = '#FFFFFF';
        surface = '#F0F2F5';
        text = '#1A1A2E';
        textMuted = '#666666';
        border = 'rgba(0, 0, 0, 0.1)';
        
        // Specific adjustments for light themes that are already light
        if (themeObj.name === 'Minimaliste' || themeObj.name === 'Océan Propre') {
            bg = themeObj.bg;
            surface = themeObj.surface;
            text = themeObj.text;
            textMuted = themeObj.textMuted;
        }
    }

    root.style.setProperty('--color-bg', bg);
    root.style.setProperty('--color-surface', surface);
    root.style.setProperty('--color-accent', themeObj.accent);
    root.style.setProperty('--color-highlight', themeObj.highlight);
    root.style.setProperty('--color-text', text);
    root.style.setProperty('--color-text-muted', textMuted);
    root.style.setProperty('--color-border', border);
    root.style.setProperty('--radius', themeObj.radius);
    root.style.setProperty('--font-heading', themeObj.fontHeading);
    root.style.setProperty('--font-body', themeObj.fontBody);
    
    // Handle Card Style
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('card-flat', 'card-outlined');
        if (themeObj.cardStyle === 'flat') card.classList.add('card-flat');
        if (themeObj.cardStyle === 'outlined') card.classList.add('card-outlined');
    });

    currentTheme = { ...themeObj };
    updateCustomizerUI();
}

function loadSavedTheme() {
    const saved = localStorage.getItem('pr_oussama_theme');
    if (saved) {
        const theme = JSON.parse(saved);
        applyTheme(theme);
        if (theme.fontSize) {
            document.documentElement.style.setProperty('--font-size-scale', theme.fontSize);
        }
    } else {
        applyTheme(THEME_ACADEMIQUE);
    }
}

function saveTheme() {
    localStorage.setItem('pr_oussama_theme', JSON.stringify(currentTheme));
    alert('Preferences saved!');
}

function resetTheme() {
    localStorage.removeItem('pr_oussama_theme');
    applyTheme(THEME_ACADEMIQUE);
    location.reload();
}

function initCustomizerPanel() {
    const panel = document.getElementById('customizerPanel');
    const btn = document.getElementById('customizerBtn');
    const close = document.getElementById('closePanel');

    if (btn) btn.onclick = () => panel.classList.add('open');
    if (close) close.onclick = () => panel.classList.remove('open');

    // Dark/Light Toggle
    const modeToggle = document.getElementById('modeToggle');
    if (modeToggle) {
        modeToggle.onclick = () => {
            isLightMode = !isLightMode;
            applyTheme(currentTheme);
            modeToggle.innerHTML = isLightMode ? '<i class="fas fa-sun"></i> Light' : '<i class="fas fa-moon"></i> Dark';
            modeToggle.classList.toggle('active', isLightMode);
        };
    }

    // Theme Preset Listeners
    document.querySelectorAll('.theme-item').forEach(item => {
        item.onclick = () => {
            const themeKey = item.dataset.theme;
            applyTheme(THEMES[themeKey]);
            document.querySelectorAll('.theme-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        };
    });

    // Manual Controls
    const accentPicker = document.getElementById('accentPicker');
    if (accentPicker) {
        accentPicker.oninput = (e) => {
            document.documentElement.style.setProperty('--color-accent', e.target.value);
            currentTheme.accent = e.target.value;
        };
    }

    const bgPicker = document.getElementById('bgPicker');
    if (bgPicker) {
        bgPicker.oninput = (e) => {
            document.documentElement.style.setProperty('--color-bg', e.target.value);
            currentTheme.bg = e.target.value;
        };
    }

    const fontSlider = document.getElementById('fontSlider');
    if (fontSlider) {
        fontSlider.oninput = (e) => {
            const scale = e.target.value / 100;
            document.documentElement.style.setProperty('--font-size-scale', scale);
            currentTheme.fontSize = scale;
            document.getElementById('fontSizeVal').innerText = e.target.value + '%';
        };
    }

    const radiusSlider = document.getElementById('radiusSlider');
    if (radiusSlider) {
        radiusSlider.oninput = (e) => {
            const val = e.target.value + 'px';
            document.documentElement.style.setProperty('--radius', val);
            currentTheme.radius = val;
            document.getElementById('radiusVal').innerText = val;
        };
    }

    // Density Toggles
    document.querySelectorAll('.density-item').forEach(item => {
        item.onclick = () => {
            const density = item.dataset.density === 'compact' ? 0.7 : 1;
            document.documentElement.style.setProperty('--density', density);
            currentTheme.density = density;
            document.querySelectorAll('.density-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        };
    });

    // Card Style Toggles
    document.querySelectorAll('.card-style-item').forEach(item => {
        item.onclick = () => {
            const style = item.dataset.style;
            currentTheme.cardStyle = style;
            applyTheme(currentTheme);
            document.querySelectorAll('.card-style-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        };
    });
}

function updateCustomizerUI() {
    // Sync inputs with currentTheme
    const accentPicker = document.getElementById('accentPicker');
    if (accentPicker) accentPicker.value = currentTheme.accent;
    
    const bgPicker = document.getElementById('bgPicker');
    if (bgPicker) bgPicker.value = currentTheme.bg;
}

// --- LANGUAGE TOGGLE ---
const translations = {
    'FR': {
        'nav_home': 'Accueil',
        'nav_courses': 'Cours',
        'nav_files': 'Bibliothèque',
        'nav_about': 'À Propos',
        'nav_contact': 'Contact',
        'hero_title': 'Votre Partenaire Académique',
        'hero_subtitle': 'Débloquez votre potentiel académique avec des cours structurés et des ressources de qualité.',
        'btn_explore': 'Explorer les Cours',
        'stats_students': 'Étudiants',
        'stats_courses': 'Cours',
        'stats_files': 'Fichiers',
        'stats_subjects': 'Matières'
    },
    'AR': {
        'nav_home': 'الرئيسية',
        'nav_courses': 'الدورات',
        'nav_files': 'المكتبة',
        'nav_about': 'من نحن',
        'nav_contact': 'اتصل بنا',
        'hero_title': 'شريكك في النجاح الأكاديمي',
        'hero_subtitle': 'أطلق العنان لإمكانياتك الأكاديمية من خلال دورات منظمة وموارد تعليمية متميزة.',
        'btn_explore': 'استكشف الدورات',
        'stats_students': 'طالب',
        'stats_courses': 'دورة',
        'stats_files': 'ملف',
        'stats_subjects': 'مادة'
    }
};

function toggleLanguage() {
    currentLang = currentLang === 'FR' ? 'AR' : 'FR';
    document.documentElement.dir = currentLang === 'AR' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang.toLowerCase();
    
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.dataset.i18n;
        if (translations[currentLang][key]) {
            el.innerText = translations[currentLang][key];
        }
    });

    document.getElementById('langBtn').innerText = currentLang === 'FR' ? 'AR' : 'FR';
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadSavedTheme();
    initCustomizerPanel();
    
    // Sticky Navbar
    window.onscroll = () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };

    // Mobile Menu
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    if (menuBtn) {
        menuBtn.onclick = () => {
            navLinks.classList.toggle('mobile-open');
        };
    }

    // Page Load Animations
    const animElements = document.querySelectorAll('.animate-on-load');
    animElements.forEach((el, index) => {
        el.style.animationDelay = (index * 0.1) + 's';
        el.classList.add('animate-up');
    });
});
