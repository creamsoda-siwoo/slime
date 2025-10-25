// FIX: Import React, ReactDOM, and React hooks using ES module syntax to resolve 'Cannot find name' errors.
import React, { useState, useEffect, useCallback, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom/client';

// --- ICONS ---
const LevelIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
);
const XPIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
    </svg>
);
const CoinIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 6v1m0-1c-1.11 0-2.08-.402-2.599-1M12 18c1.11 0 2.08-.402-2.599-1M8.999 12H8m8 0h-.001M12 21a9 9 0 110-18 9 9 0 010 18z" />
    </svg>
);
const SwordIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);
const PowerShotIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);
const CoinIconForSkill = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 6v1m0-1c-1.11 0-2.08-.402-2.599-1M12 18c1.11 0 2.08-.402-2.599-1M8.999 12H8m8 0h-.001M12 21a9 9 0 110-18 9 9 0 010 18z" />
    </svg>
);
const EquipIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
);
const UnEquipIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);


// --- MONSTER ICONS ---
const SlimeIcon = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs><radialGradient id="slimeGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.5)' }} /><stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0)' }} /></radialGradient></defs>
        <path d="M 10,60 C 10,30 30,10 50,10 C 70,10 90,30 90,60 C 90,80 80,90 50,90 C 20,90 10,80 10,60 Z" fill="currentColor" />
        <circle cx="50" cy="50" r="40" fill="url(#slimeGradient)" /><circle cx="35" cy="45" r="5" fill="white" /><circle cx="65" cy="45" r="5" fill="white" /><circle cx="36" cy="46" r="2" fill="black" /><circle cx="66" cy="46" r="2" fill="black" />
    </svg>
);
const GoblinIcon = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M50 10 C 25 10, 10 30, 10 55 C 10 80, 20 90, 40 90 L 60 90 C 80 90, 90 80, 90 55 C 90 30, 75 10, 50 10 Z" fill="currentColor"/>
        <path d="M 20 50 L 10 30 L 30 45 Z" fill="currentColor" stroke="black" strokeWidth="2"/>
        <path d="M 80 50 L 90 30 L 70 45 Z" fill="currentColor" stroke="black" strokeWidth="2"/>
        <circle cx="35" cy="50" r="6" fill="yellow" /><circle cx="65" cy="50" r="6" fill="yellow" />
        <circle cx="35" cy="50" r="3" fill="black" /> <circle cx="65" cy="50" r="3" fill="black" />
        <rect x="30" y="70" width="40" height="5" rx="2" fill="black" />
        <rect x="38" y="65" width="5" height="5" fill="white" /><rect x="57" y="65" width="5" height="5" fill="white" />
    </svg>
);
const MushroomEntIcon = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="35" y="50" width="30" height="45" fill="currentColor" />
        <path d="M50 15 C 20 15, 10 30, 10 50 L 90 50 C 90 30, 80 15, 50 15 Z" fill="red" stroke="white" strokeWidth="3" />
        <circle cx="25" cy="35" r="5" fill="white" /><circle cx="50" cy="30" r="6" fill="white" /><circle cx="75" cy="35" r="5" fill="white" />
        <circle cx="42" cy="70" r="4" fill="black" /><circle cx="58" cy="70" r="4" fill="black" />
    </svg>
);
const ShadowImpIcon = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M50,10 C 80,40 90,80 50,90 C 10,80 20,40 50,10 Z" fill="currentColor" />
        <path d="M 50 10 L 40 30 L 60 30 Z" fill="currentColor" stroke="black" strokeWidth="2"/>
        <path d="M 20 70 L 10 90 L 30 80 Z" fill="currentColor" stroke="black" strokeWidth="1"/>
        <path d="M 80 70 L 90 90 L 70 80 Z" fill="currentColor" stroke="black" strokeWidth="1"/>
        <circle cx="40" cy="50" r="5" fill="red" /><circle cx="60" cy="50" r="5" fill="red" />
    </svg>
);
const SkeletonWarriorIcon = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="50" cy="30" r="20" fill="currentColor" />
        <circle cx="42" cy="28" r="5" fill="black" /><circle cx="58" cy="28" r="5" fill="black" />
        <rect x="45" y="38" width="10" height="5" fill="black" /><rect x="35" y="50" width="30" height="5" rx="2" fill="currentColor" />
        <rect x="30" y="55" width="5" height="20" fill="currentColor" /><rect x="65" y="55" width="5" height="20" fill="currentColor" />
        <rect x="47.5" y="55" width="5" height="30" fill="currentColor" />
    </svg>
);
const StoneGolemIcon = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="20" y="15" width="60" height="40" rx="5" fill="currentColor"/>
        <rect x="10" y="55" width="30" height="35" rx="5" fill="currentColor"/>
        <rect x="60" y="55" width="30" height="35" rx="5" fill="currentColor"/>
        <rect x="30" y="25" width="40" height="10" fill="darkslategray" />
    </svg>
);
const GiantSlimeKingIcon = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M5,50 C 5,20 20,5 50,5 C 80,5 95,20 95,50 C 95,70 85,95 50,95 C 15,95 5,70 5,50 Z" fill="currentColor" />
        <path d="M30 15 L 20 30 L 40 30 Z" fill="gold" stroke="black" strokeWidth="1" />
        <path d="M50 5 L 40 25 L 60 25 Z" fill="gold" stroke="black" strokeWidth="1" />
        <path d="M70 15 L 60 30 L 80 30 Z" fill="gold" stroke="black" strokeWidth="1" />
        <circle cx="35" cy="45" r="7" fill="white" /><circle cx="65" cy="45" r="7" fill="white" />
        <circle cx="36" cy="46" r="3" fill="black" /><circle cx="66" cy="46" r="3" fill="black" />
        <path d="M 30 70 Q 50 85 70 70" stroke="black" strokeWidth="3" fill="none" />
    </svg>
);

// --- CONSTANTS & GAME DATA ---
const SAVED_GAME_KEY = 'slimeHunterSaveData_v4';
const LEVEL_CAP = 999;
const INITIAL_PLAYER = { nickname: '용사님', level: 1, xp: 0, xpToNextLevel: 10, gold: 0, baseAttack: 1, dps: 0 };
const INITIAL_INVENTORY = { equipment: [], jewels: [], equipped: { WEAPON: null, ARMOR: null, RING: null } };
const INITIAL_GAME_STATE = {
    player: INITIAL_PLAYER,
    upgrades: {},
    inventory: INITIAL_INVENTORY,
    monster: null,
    logs: [{ message: '슬라임 헌터에 오신 것을 환영합니다!', color: 'text-yellow-300' }],
    damageNumbers: [],
};

const MONSTER_TEMPLATES = [
    { name: '초록 슬라임', baseHp: 8, baseGold: 2, baseXp: 5, color: 'text-green-400', minLevel: 1, image: SlimeIcon },
    { name: '파랑 슬라임', baseHp: 12, baseGold: 3, baseXp: 7, color: 'text-blue-400', minLevel: 2, image: SlimeIcon },
    { name: '고블린', baseHp: 20, baseGold: 5, baseXp: 10, color: 'text-emerald-500', minLevel: 4, image: GoblinIcon },
    { name: '버섯 엔트', baseHp: 35, baseGold: 6, baseXp: 12, color: 'text-orange-400', minLevel: 6, special: 'HEAL', image: MushroomEntIcon },
    { name: '그림자 임프', baseHp: 15, baseGold: 15, baseXp: 8, color: 'text-purple-500', minLevel: 8, image: ShadowImpIcon },
    { name: '스켈레톤 전사', baseHp: 50, baseGold: 10, baseXp: 20, color: 'text-gray-300', minLevel: 10, image: SkeletonWarriorIcon },
    { name: '돌 골렘', baseHp: 80, baseGold: 15, baseXp: 30, color: 'text-slate-500', minLevel: 12, image: StoneGolemIcon },
];
const BOSS_TEMPLATE = { name: '거대 슬라임 왕', baseHp: 100, baseGold: 50, baseXp: 100, color: 'text-yellow-400', minLevel: 5, image: GiantSlimeKingIcon, special: undefined };

const UPGRADES_CONFIG = [
    { id: 'CLICK_UPGRADE', name: '검 강화', description: (l, c, b) => `클릭 공격력을 +${b} 만큼 영구적으로 증가시킵니다.`, cost: (l) => Math.floor(10 * Math.pow(1.2, Math.min(l, LEVEL_CAP))), benefit: (l) => Math.floor(1 * Math.pow(1.1, Math.min(l, LEVEL_CAP))) },
    { id: 'DPS_UPGRADE', name: '자동 공격 용병 고용', description: (l, c, b) => `초당 ${b}의 자동 공격을 추가합니다.`, cost: (l) => Math.floor(25 * Math.pow(1.5, Math.min(l, LEVEL_CAP))), benefit: (l) => Math.floor(1 * Math.pow(1.3, Math.min(l, LEVEL_CAP))) },
    { id: 'POWER_SHOT_UPGRADE', name: '파워 샷 쿨타임 감소', description: (l) => `파워 샷의 재사용 대기시간을 5% 감소시킵니다. (현재: -${Math.min(90, l * 5)}%)`, cost: (l) => Math.floor(150 * Math.pow(1.8, Math.min(l, LEVEL_CAP))), benefit: (l) => 0.05 },
    { id: 'POWER_SHOT_DAMAGE_UPGRADE', name: '파워 샷 데미지 강화', description: (l, c, b) => `파워 샷의 데미지를 ${b * 100}% 만큼 영구적으로 증가시킵니다. (현재: +${(Number(l) * Number(b) * 100).toFixed(0)}%)`, cost: (l) => Math.floor(180 * Math.pow(1.8, Math.min(l, LEVEL_CAP))), benefit: (l) => 0.1 },
    { id: 'GOLD_BONUS_UPGRADE', name: '황금 탐지기', description: (l, c, b) => `레벨당 골드 획득량이 ${b * 100}% 만큼 영구적으로 증가합니다. (현재: +${(l * b * 100).toFixed(1)}%)`, cost: (l) => Math.floor(100 * Math.pow(1.6, Math.min(l, LEVEL_CAP))), benefit: (l) => 0.02 },
    { id: 'XP_BONUS_UPGRADE', name: '성장의 부적', description: (l, c, b) => `레벨당 경험치 획득량이 ${b * 100}% 만큼 영구적으로 증가합니다. (현재: +${(l * b * 100).toFixed(1)}%)`, cost: (l) => Math.floor(120 * Math.pow(1.7, Math.min(l, LEVEL_CAP))), benefit: (l) => 0.015 },
    { id: 'BLESSING_UPGRADE', name: '여신의 축복', description: (l, c, b) => `모든 능력치(공격력, DPS, 보너스)를 ${b}배 증가시킵니다. (현재: x${Math.pow(b, l).toFixed(2)})`, cost: (l) => 10000 * Math.pow(10, Math.min(l, LEVEL_CAP)), benefit: (l) => 2 },
];
const RARITY_CONFIG = {
    COMMON: { chance: 0, multiplier: 1, color: 'text-white' },
    UNCOMMON: { chance: 0.25, multiplier: 1.8, color: 'text-green-400' },
    RARE: { chance: 0.10, multiplier: 3.0, color: 'text-blue-400' },
    EPIC: { chance: 0.04, multiplier: 5.0, color: 'text-purple-500' },
    LEGENDARY: { chance: 0.01, multiplier: 8.0, color: 'text-yellow-400' },
};
const EQUIPMENT_BASES = {
    WEAPON: ['단검', '장검', '도끼', '망치', '마법 지팡이'],
    ARMOR: ['가죽 갑옷', '사슬 갑옷', '판금 갑옷', '마법 로브'],
    RING: ['힘의 반지', '민첩의 반지', '지혜의 반지', '행운의 반지'],
};
const JEWEL_CONFIG = {
    RUBY: { name: '루비', stats: { attack: 1 } },
    SAPPHIRE: { name: '사파이어', stats: { dps: 1 } },
    EMERALD: { name: '에메랄드', stats: { xpBonus: 0.01 } },
    TOPAZ: { name: '토파즈', stats: { goldBonus: 0.01 } },
    AMETHYST: { name: '자수정', stats: { powerShotDamageBonus: 0.02 } },
};
const JEWEL_SHAPES = ['CIRCLE', 'SQUARE', 'TRIANGLE'];

// --- GAME LOGIC HELPERS ---
const sanitizeNumber = (value, fallback = 0) => {
    const num = Number(value);
    return Number.isFinite(num) && !isNaN(num) ? num : fallback;
};

const sanitizePlayerState = (playerObj) => {
    const s = sanitizeNumber;
    const sanitizedLevel = s(playerObj.level, 1);
    let sanitizedXpToNextLevel = s(playerObj.xpToNextLevel, 10);
    if (sanitizedXpToNextLevel <= 0) {
        sanitizedXpToNextLevel = Math.floor(10 * Math.pow(1.2, Math.min(sanitizedLevel - 1, LEVEL_CAP)));
    }
    return {
        ...playerObj,
        level: sanitizedLevel,
        xp: s(playerObj.xp),
        xpToNextLevel: sanitizedXpToNextLevel,
        gold: s(playerObj.gold),
        baseAttack: s(playerObj.baseAttack, 1),
        dps: s(playerObj.dps),
    };
};

const MONSTER_GENERATOR = (level) => {
    const safeLevel = sanitizeNumber(level, 1);
    let template;
    if (safeLevel >= BOSS_TEMPLATE.minLevel && Math.random() < 0.05) {
        template = BOSS_TEMPLATE;
    } else {
        const availableMonsters = MONSTER_TEMPLATES.filter(m => safeLevel >= m.minLevel);
        template = availableMonsters[Math.floor(Math.random() * availableMonsters.length)] || MONSTER_TEMPLATES[0];
    }
    const levelMultiplier = Math.pow(1.25, Math.min(safeLevel - 1, LEVEL_CAP));
    const hp = Math.floor(template.baseHp * levelMultiplier);
    const goldReward = Math.floor(template.baseGold * levelMultiplier);
    const xpReward = Math.floor(template.baseXp * levelMultiplier);
    return { 
        id: Date.now() + Math.random(), name: `${template.name} (Lv.${safeLevel})`, 
        hp: sanitizeNumber(hp, 1), maxHp: sanitizeNumber(hp, 1), 
        goldReward: sanitizeNumber(goldReward), xpReward: sanitizeNumber(xpReward), 
        level: safeLevel, color: template.color, special: template.special, image: template.image 
    };
};

const generateEquipment = (playerLevel) => {
    const s = sanitizeNumber;
    const safePlayerLevel = s(playerLevel, 1);
    const roll = Math.random();
    let rarity = 'COMMON';
    if (roll < RARITY_CONFIG.LEGENDARY.chance) rarity = 'LEGENDARY';
    else if (roll < RARITY_CONFIG.EPIC.chance) rarity = 'EPIC';
    else if (roll < RARITY_CONFIG.RARE.chance) rarity = 'RARE';
    else if (roll < RARITY_CONFIG.UNCOMMON.chance) rarity = 'UNCOMMON';

    const type = Object.keys(EQUIPMENT_BASES)[Math.floor(Math.random() * 3)];
    const baseName = EQUIPMENT_BASES[type][Math.floor(Math.random() * EQUIPMENT_BASES[type].length)];
    
    const stats = {};
    const multiplier = RARITY_CONFIG[rarity].multiplier;
    const statPower = Math.max(1, Math.floor(safePlayerLevel * multiplier * (1 + Math.random() * 0.2)));

    switch (type) {
        case 'WEAPON': stats['attack'] = statPower; if (rarity !== 'COMMON') stats['dps'] = Math.floor(statPower / 2); break;
        case 'ARMOR': stats['goldBonus'] = Math.round(statPower * 1.5) / 100; break;
        case 'RING': stats['xpBonus'] = Math.round(statPower * 1.5) / 100; break;
    }
    const sockets = [];
    let socketCount = 0;
    if (rarity === 'UNCOMMON') socketCount = Math.random() < 0.5 ? 1 : 2;
    else if (rarity === 'RARE') socketCount = 2 + (Math.random() < 0.5 ? 1 : 0);
    else if (rarity === 'EPIC') socketCount = 3 + (Math.random() < 0.5 ? 1 : 0);
    else if (rarity === 'LEGENDARY') socketCount = 4;
    else socketCount = Math.random() < 0.3 ? 1 : 0;
    for (let i = 0; i < socketCount; i++) {
        sockets.push({ shape: JEWEL_SHAPES[Math.floor(Math.random() * JEWEL_SHAPES.length)], jewelId: null });
    }
    const name = `${rarity !== 'COMMON' ? `[${rarity}] ` : ''}${baseName}`;
    return { id: `eq-${Date.now()}`, name, type, rarity, stats, sockets };
};

const generateJewel = (playerLevel) => {
    const s = sanitizeNumber;
    const safePlayerLevel = s(playerLevel, 1);
    const roll = Math.random();
    let rarity = 'COMMON';
    if (roll < RARITY_CONFIG.LEGENDARY.chance / 2) rarity = 'LEGENDARY';
    else if (roll < RARITY_CONFIG.EPIC.chance / 2) rarity = 'EPIC';
    else if (roll < RARITY_CONFIG.RARE.chance / 2) rarity = 'RARE';
    else if (roll < RARITY_CONFIG.UNCOMMON.chance / 2) rarity = 'UNCOMMON';

    const type = Object.keys(JEWEL_CONFIG)[Math.floor(Math.random() * Object.keys(JEWEL_CONFIG).length)];
    const shape = JEWEL_SHAPES[Math.floor(Math.random() * JEWEL_SHAPES.length)];
    const config = JEWEL_CONFIG[type];
    const multiplier = RARITY_CONFIG[rarity].multiplier;

    const baseStatKey = Object.keys(config.stats)[0];
    const baseStatValue = config.stats[baseStatKey];
    
    const finalStatValue = baseStatValue < 1
        ? Math.round(baseStatValue * multiplier * 100) / 100
        : Math.floor(baseStatValue * multiplier * (safePlayerLevel / 5 + 1));

    const stats = { [baseStatKey]: finalStatValue };
    const name = `${rarity !== 'COMMON' ? `[${rarity}] ` : ''}${config.name}`;
    
    return { id: `jw-${Date.now()}`, name, type, shape, rarity, stats };
};

// --- PURE CALCULATION FUNCTIONS ---
const deriveStats = (gameState) => {
    const s = sanitizeNumber;
    const { player, upgrades, inventory } = gameState;
    let totalAttack = s(player.baseAttack) + s(upgrades['CLICK_UPGRADE']?.totalBenefit);
    let totalDps = s(player.dps) + s(upgrades['DPS_UPGRADE']?.totalBenefit);
    let goldBonus = s(upgrades['GOLD_BONUS_UPGRADE']?.level) * 0.02;
    let xpBonus = s(upgrades['XP_BONUS_UPGRADE']?.level) * 0.015;
    const psdUpgrade = UPGRADES_CONFIG.find(u => u.id === 'POWER_SHOT_DAMAGE_UPGRADE');
    let powerShotDamageBonus = s(upgrades['POWER_SHOT_DAMAGE_UPGRADE']?.level) * s(psdUpgrade?.benefit(0));

    Object.values(inventory.equipped).forEach(eqId => {
        if (!eqId) return;
        const item = inventory.equipment.find(e => e.id === eqId);
        if (!item) return;

        Object.entries(item.stats).forEach(([stat, value]) => {
            const numericValue = s(value);
            if (stat === 'attack') totalAttack += numericValue;
            if (stat === 'dps') totalDps += numericValue;
            if (stat === 'goldBonus') goldBonus += numericValue;
            if (stat === 'xpBonus') xpBonus += numericValue;
        });

        item.sockets.forEach(socket => {
            if (!socket.jewelId) return;
            const jewel = inventory.jewels.find(j => j.id === socket.jewelId);
            if (!jewel) return;
            
            Object.entries(jewel.stats).forEach(([stat, value]) => {
                const numericValue = s(value);
                 if (stat === 'attack') totalAttack += numericValue;
                 if (stat === 'dps') totalDps += numericValue;
                 if (stat === 'goldBonus') goldBonus += numericValue;
                 if (stat === 'xpBonus') xpBonus += numericValue;
                 if (stat === 'powerShotDamageBonus') powerShotDamageBonus += numericValue;
            });
        });
    });

    const blessingLevel = s(upgrades['BLESSING_UPGRADE']?.level);
    if (blessingLevel > 0) {
        const blessingUpgrade = UPGRADES_CONFIG.find(u => u.id === 'BLESSING_UPGRADE');
        const blessingMultiplier = Math.pow(s(blessingUpgrade?.benefit(0), 1), blessingLevel);
        totalAttack *= blessingMultiplier;
        totalDps *= blessingMultiplier;
    }

    return { 
        totalAttack: s(totalAttack, 1), totalDps: s(totalDps), 
        goldBonus: s(goldBonus), xpBonus: s(xpBonus), powerShotDamageBonus: s(powerShotDamageBonus) 
    };
};


// --- COMPONENTS ---
const StatBar = React.memo(({ value, maxValue, color, icon, label }) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    return (
        <div>
            <div className="flex justify-between items-center text-sm mb-1 text-gray-300">
                <div className="flex items-center gap-2">{icon}<span>{label}</span></div>
                <span>{Math.floor(value).toLocaleString()} / {Math.ceil(maxValue).toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%`, transition: 'width 0.3s ease-in-out' }}></div>
            </div>
        </div>
    );
});

const PlayerStats = React.memo(({ player, onNicknameChange, calculatedStats }) => {
    const { totalAttack, totalDps, goldBonus, xpBonus, powerShotDamageBonus } = calculatedStats;
    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState(player.nickname);
    const inputRef = useRef(null);

    const handleSave = () => {
        if (nickname.trim()) onNicknameChange(nickname.trim());
        else setNickname(player.nickname);
        setIsEditing(false);
    };

    useEffect(() => { if (isEditing) inputRef.current?.focus(); }, [isEditing]);
    useEffect(() => { setNickname(player.nickname); }, [player.nickname]);

    return (
        <div className="flex flex-col gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            {isEditing ? (
                 <input ref={inputRef} type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} onBlur={handleSave} onKeyDown={(e) => e.key === 'Enter' && handleSave()} className="text-xl font-bold text-center bg-gray-800 text-yellow-300 rounded-md border border-yellow-500" />
            ) : (
                <h2 className="text-xl font-bold text-center text-yellow-400 cursor-pointer hover:text-yellow-300 transition-colors" onClick={() => setIsEditing(true)} title="클릭하여 닉네임 변경">{player.nickname}</h2>
            )}
            <div className="space-y-3">
                <div className="flex items-center justify-between text-gray-300 px-1">
                    <div className="flex items-center gap-2"><LevelIcon /><span>레벨</span></div>
                    <span className="font-bold text-lg text-yellow-400">{player.level}</span>
                </div>
                <StatBar value={player.xp} maxValue={player.xpToNextLevel} color="bg-blue-400" icon={<XPIcon />} label="경험치" />
                <div className="flex items-center justify-between text-gray-300 px-1">
                    <div className="flex items-center gap-2"><CoinIcon /><span>골드</span></div>
                    <span className="font-bold text-lg text-amber-400">{Math.floor(player.gold).toLocaleString()}</span>
                </div>
            </div>
            <div className="mt-2 text-sm space-y-1 text-gray-300">
                <p>클릭 공격력: {totalAttack.toLocaleString()}</p>
                <p>자동 공격력(DPS): {totalDps.toFixed(1)}</p>
                <p>골드 보너스: +{(goldBonus * 100).toFixed(1)}%</p>
                <p>경험치 보너스: +{(xpBonus * 100).toFixed(1)}%</p>
                <p>파워 샷 데미지 보너스: +{(powerShotDamageBonus * 100).toFixed(0)}%</p>
            </div>
        </div>
    );
});

const MonsterDisplay = React.memo(({ monster, onAttack, damageNumbers, isShaking }) => {
    if (!monster) return <div className="h-64 flex items-center justify-center"><p>몬스터를 기다리는 중...</p></div>;
    const MonsterImage = monster.image;
    return (
        <div className={`relative flex flex-col items-center justify-center p-4 transition-transform duration-100 ${isShaking ? 'animate-screen-shake' : ''}`}>
            <h3 className={`text-2xl font-bold ${monster.color}`}>{monster.name}</h3>
            <p className="text-sm text-gray-400">HP: {Math.max(0, Math.ceil(monster.hp)).toLocaleString()} / {monster.maxHp.toLocaleString()}</p>
            <div className="relative w-48 h-48 my-4 cursor-pointer" onClick={onAttack}>
                <MonsterImage className={`w-full h-full ${monster.color}`} />
            </div>
            <div className="w-full max-w-xs bg-gray-700 rounded-full h-4 border-2 border-gray-600">
                <div className="bg-red-500 h-full rounded-full" style={{ width: `${(monster.hp / monster.maxHp) * 100}%` }}></div>
            </div>
            {damageNumbers.map(dn => (
                <div key={dn.id} className={`absolute text-2xl font-bold pointer-events-none ${dn.isSkill ? 'text-orange-400 animate-damage-popup-skill' : 'text-red-400 animate-damage-popup'}`} style={{ top: `${dn.y}%`, left: `${dn.x}%` }}>
                    {dn.damage.toLocaleString()}
                </div>
            ))}
        </div>
    );
});

const GameLog = React.memo(({ logs }) => {
    const logContainerRef = useRef(null);
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div ref={logContainerRef} className="h-32 bg-black/30 rounded-lg p-2 overflow-y-auto text-sm">
            {logs.slice(-50).map((log, index) => (
                <p key={index} className={log.color || 'text-gray-400'}>{log.message}</p>
            ))}
        </div>
    );
});

const PowerShotButton = React.memo(({ onClick, cooldown, maxCooldown }) => {
    // FIX: Add a check to prevent division by zero, which can cause an arithmetic error.
    // FIX: Explicitly cast props to Number to prevent type errors in arithmetic operations.
    const cooldownPercentage = Number(maxCooldown) > 0 ? (Number(cooldown) / Number(maxCooldown)) * 100 : 0;
    const isDisabled = Number(cooldown) > 0;

    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className="relative w-full flex items-center justify-center gap-2 p-3 text-lg font-bold bg-orange-600 rounded-lg shadow-lg hover:bg-orange-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 overflow-hidden"
        >
            {isDisabled ? (`쿨타임: ${(Number(cooldown) / 1000).toFixed(1)}초`) : (<><PowerShotIcon /><span>파워 샷!</span></>)}
            {isDisabled && (<div className="absolute bottom-0 left-0 h-full bg-black/50" style={{ width: `${cooldownPercentage}%` }}></div>)}
        </button>
    );
});

const UpgradePanel = React.memo(({ upgrades, player, onUpgrade }) => {
    return (
        <div className="flex flex-col gap-2">
            {UPGRADES_CONFIG.map(config => {
                const level = upgrades[config.id]?.level || 0;
                const cost = config.cost(level);
                const benefit = config.benefit(level);
                const canAfford = player.gold >= cost;

                return (
                    <div key={config.id} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                        <h4 className="font-bold text-yellow-400">{config.name} (Lv.{level})</h4>
                        <p className="text-sm text-gray-300 my-1">{config.description(level, cost, benefit)}</p>
                        <button
                            onClick={() => onUpgrade(config.id)}
                            disabled={!canAfford}
                            className="w-full mt-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
                        >
                            <CoinIcon className="h-4 w-4" />
                            <span>{cost.toLocaleString()}</span>
                        </button>
                    </div>
                );
            })}
        </div>
    );
});

const Tooltip = forwardRef(({ item, style }, ref) => {
    if (!item) return null;
    const rarityColor = RARITY_CONFIG[item.rarity]?.color || 'text-white';
    
    return (
        <div ref={ref} style={style} className={`absolute z-10 p-3 bg-gray-900 border border-gray-600 rounded-lg shadow-lg text-sm w-64 pointer-events-none`}>
            <p className={`font-bold ${rarityColor}`}>{item.name}</p>
            {item.type && <p className="text-gray-400 capitalize">{item.type.toLowerCase()}</p>}
            <hr className="my-2 border-gray-600" />
            <div className="space-y-1">
                {Object.entries(item.stats).map(([stat, value]) => (
                    <p key={stat} className="text-green-400">
                        + {stat === 'attack' || stat === 'dps' ? `${value.toLocaleString()}` : `${(value * 100).toFixed(1)}%`} {
                            { attack: '공격력', dps: '자동 공격력', goldBonus: '골드 보너스', xpBonus: '경험치 보너스', powerShotDamageBonus: '파워 샷 데미지' }[stat]
                        }
                    </p>
                ))}
            </div>
             {item.sockets && item.sockets.length > 0 && (
                <>
                    <hr className="my-2 border-gray-600" />
                    <div className="flex gap-2 items-center">
                        <p>소켓:</p>
                        <div className="flex gap-1">
                        {item.sockets.map((socket, i) => {
                             const jewel = socket.jewelId ? JEWEL_CONFIG[socket.jewelType] : null;
                             return (<div key={i} className={`w-4 h-4 rounded-full border-2 border-gray-500 ${jewel ? `socket-jewel-${socket.jewelType}` : ''}`} />);
                        })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
});

const InventoryPanel = ({ inventory, onEquip, onSocketJewel, onUnsocketJewel }) => {
    const [tooltipItem, setTooltipItem] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const tooltipRef = useRef(null);
    
    const handleMouseEnter = (item) => { setTooltipItem(item); };
    const handleMouseLeave = () => { setTooltipItem(null); };
    const handleMouseMove = (e) => {
        if (tooltipRef.current) {
            const { clientX, clientY } = e;
            const { width, height } = tooltipRef.current.getBoundingClientRect();
            let x = clientX + 15;
            let y = clientY + 15;
            if (x + width > window.innerWidth) x = clientX - width - 15;
            if (y + height > window.innerHeight) y = clientY - height - 15;
            setTooltipPos({ x, y });
        }
    };
    
    // FIX: Changed component signature to accept `props` object to resolve TypeScript error with the `key` prop.
    const ItemSlot = (props) => {
        const { item, type, isEquipped = false } = props;
        return (
            <div 
                 className={`w-16 h-16 bg-gray-800/50 border-2 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 relative
                    ${isEquipped ? 'border-yellow-400' : 'border-gray-600'}
                    ${item ? RARITY_CONFIG[item.rarity].color.replace('text-', 'border-') : ''}
                 `}
                 onClick={() => item && onEquip(item)}
                 onMouseEnter={() => item && handleMouseEnter(item)}
                 onMouseMove={handleMouseMove}
                 onMouseLeave={handleMouseLeave}
            >
                {item ? <span className="text-xs text-center p-1">{item.name}</span> : <span className="text-gray-500 text-xs">{type}</span>}
                {item && isEquipped && <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center"><EquipIcon className="h-3 w-3" /></div>}
            </div>
        );
    };

    // FIX: Changed component signature to accept `props` object to resolve TypeScript error with the `key` prop.
    const JewelSlot = (props) => {
        const { jewel, type } = props;
        return (
            <div 
                className={`w-12 h-12 bg-gray-800/50 border rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-700
                    ${jewel ? `jewel-name-${type}` : 'border-gray-600'}`}
                 onMouseEnter={() => jewel && handleMouseEnter(jewel)}
                 onMouseMove={handleMouseMove}
                 onMouseLeave={handleMouseLeave}
            >
                 {jewel ? <span className="text-xs text-center p-1">{jewel.name}</span> : <span className="text-gray-500 text-xs">보석</span>}
            </div>
        );
    };
    
    const equippedWeapon = inventory.equipment.find(e => e.id === inventory.equipped.WEAPON);
    const equippedArmor = inventory.equipment.find(e => e.id === inventory.equipped.ARMOR);
    const equippedRing = inventory.equipment.find(e => e.id === inventory.equipped.RING);

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h4 className="font-bold text-yellow-400 mb-2">장착된 장비</h4>
                <div className="grid grid-cols-3 gap-2">
                    <ItemSlot item={equippedWeapon} type="무기" isEquipped={!!inventory.equipped.WEAPON} />
                    <ItemSlot item={equippedArmor} type="방어구" isEquipped={!!inventory.equipped.ARMOR} />
                    <ItemSlot item={equippedRing} type="반지" isEquipped={!!inventory.equipped.RING} />
                </div>
            </div>
            <div>
                <h4 className="font-bold text-yellow-400 mb-2">장비 가방</h4>
                <div className="grid grid-cols-5 gap-2 h-40 overflow-y-auto p-1 bg-black/20 rounded-md">
                    {inventory.equipment.filter(i => !Object.values(inventory.equipped).includes(i.id)).map(item => <ItemSlot key={item.id} item={item} type={item.type} />)}
                </div>
            </div>
            <div>
                <h4 className="font-bold text-yellow-400 mb-2">보석 가방</h4>
                <div className="grid grid-cols-6 gap-2 h-28 overflow-y-auto p-1 bg-black/20 rounded-md">
                     {inventory.jewels.map(jewel => <JewelSlot key={jewel.id} jewel={jewel} type={jewel.type} />)}
                </div>
            </div>
             {tooltipItem && <Tooltip item={tooltipItem} ref={tooltipRef} style={{ top: `${tooltipPos.y}px`, left: `${tooltipPos.x}px`, position: 'fixed' }} />}
        </div>
    );
};


const SettingsPanel = ({ onSave, onReset, onExport, onImport }) => {
    const fileInputRef = useRef(null);

    const handleImportClick = () => {
        if(fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            onImport(file);
        }
        event.target.value = null; // Reset file input
    };

    return (
        <div className="flex flex-col gap-3">
            <button onClick={onSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors">게임 저장</button>
            <button onClick={onExport} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors">데이터 내보내기</button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
            <button onClick={handleImportClick} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 transition-colors">데이터 가져오기</button>
            <button onClick={onReset} className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-600 transition-colors">게임 초기화</button>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
const App = () => {
    const [gameState, setGameState] = useState(() => {
        try {
            const savedData = localStorage.getItem(SAVED_GAME_KEY);
            if (!savedData) return INITIAL_GAME_STATE;
            const parsed = JSON.parse(savedData);
            return {
                ...INITIAL_GAME_STATE,
                ...parsed,
                player: sanitizePlayerState(parsed.player || INITIAL_PLAYER),
                inventory: parsed.inventory || INITIAL_INVENTORY,
                upgrades: parsed.upgrades || {},
                monster: null, // Always start with a new monster
                damageNumbers: [],
            };
        } catch (e) {
            console.error("저장된 데이터 파싱 오류:", e);
            return INITIAL_GAME_STATE;
        }
    });

    const [powerShotCooldown, setPowerShotCooldown] = useState(0);
    const [isShaking, setIsShaking] = useState(false);
    const [activeTab, setActiveTab] = useState('UPGRADES');
    
    const defeatedMonsterRef = useRef(null);
    const calculatedStats = useMemo(() => deriveStats(gameState), [gameState]);

    const addLog = useCallback((message, color) => {
        setGameState(prevState => ({
            ...prevState,
            logs: [...prevState.logs.slice(-49), { message, color }]
        }));
    }, []);

    // --- State Updaters (Safe against race conditions) ---

    const handleNicknameChange = useCallback((newName) => {
        setGameState(prevState => ({
            ...prevState,
            player: { ...prevState.player, nickname: newName }
        }));
    }, []);

    const handleAttack = useCallback(() => {
        setGameState(prevState => {
            if (!prevState.monster || prevState.monster.hp <= 0) return prevState;
            const currentStats = deriveStats(prevState);
            const damage = sanitizeNumber(currentStats.totalAttack, 1);
            return {
                ...prevState,
                monster: { ...prevState.monster, hp: prevState.monster.hp - damage },
                damageNumbers: [...prevState.damageNumbers.slice(-9), { id: Date.now(), damage, isSkill: false, x: 40 + Math.random() * 20, y: 30 + Math.random() * 20 }]
            };
        });
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 100);
    }, []);
    
    const handlePowerShot = useCallback(() => {
        if (powerShotCooldown > 0) return;

        const psUpgrade = UPGRADES_CONFIG.find(u => u.id === 'POWER_SHOT_UPGRADE');
        const cooldownReduction = 1 - Math.min(0.9, sanitizeNumber(gameState.upgrades['POWER_SHOT_UPGRADE']?.level) * sanitizeNumber(psUpgrade?.benefit(0)));
        const finalCooldown = 30000 * cooldownReduction;
        setPowerShotCooldown(finalCooldown);

        setGameState(prevState => {
            if (!prevState.monster || prevState.monster.hp <= 0) return prevState;
            const currentStats = deriveStats(prevState);
            const damage = sanitizeNumber(currentStats.totalAttack, 1) * 5 * (1 + sanitizeNumber(currentStats.powerShotDamageBonus));
            return {
                ...prevState,
                monster: { ...prevState.monster, hp: prevState.monster.hp - damage },
                logs: [...prevState.logs.slice(-49), { message: `파워 샷! ${damage.toLocaleString()}의 피해!`, color: 'text-orange-300' }],
                damageNumbers: [...prevState.damageNumbers.slice(-9), { id: Date.now(), damage, isSkill: true, x: 40 + Math.random() * 20, y: 30 + Math.random() * 20 }]
            };
        });
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 200);
    }, [powerShotCooldown, gameState.upgrades]);

    const handleUpgrade = useCallback((upgradeId) => {
        setGameState(prevState => {
            const config = UPGRADES_CONFIG.find(u => u.id === upgradeId);
            if (!config) return prevState;
            const currentLevel = sanitizeNumber(prevState.upgrades[upgradeId]?.level);
            const cost = config.cost(currentLevel);
            if (prevState.player.gold < cost) return prevState;
            
            const newLevel = currentLevel + 1;
            const newBenefit = config.benefit(currentLevel);
            const currentTotalBenefit = sanitizeNumber(prevState.upgrades[upgradeId]?.totalBenefit);
            const newTotalBenefit = config.id === 'BLESSING_UPGRADE' ? 0 : currentTotalBenefit + newBenefit;

            return {
                ...prevState,
                player: { ...prevState.player, gold: prevState.player.gold - cost },
                upgrades: { ...prevState.upgrades, [upgradeId]: { level: newLevel, totalBenefit: newTotalBenefit } }
            };
        });
    }, []);

    const handleEquipItem = useCallback((itemToEquip) => {
        setGameState(prevState => {
            const { inventory } = prevState;
            const newEquipped = { ...inventory.equipped };
            const currentEquippedId = newEquipped[itemToEquip.type];
            newEquipped[itemToEquip.type] = currentEquippedId === itemToEquip.id ? null : itemToEquip.id;
            return { ...prevState, inventory: { ...inventory, equipped: newEquipped } };
        });
    }, []);

    const handleSave = useCallback(() => {
        localStorage.setItem(SAVED_GAME_KEY, JSON.stringify(gameState));
        addLog('게임이 저장되었습니다.', 'text-green-400');
    }, [gameState, addLog]);

    const handleReset = useCallback(() => {
        if (window.confirm('정말 모든 진행 상황을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            localStorage.removeItem(SAVED_GAME_KEY);
            setGameState({ ...INITIAL_GAME_STATE, logs: [{ message: '게임이 초기화되었습니다.', color: 'text-red-400' }] });
        }
    }, []);

    const handleExport = useCallback(() => {
        const dataStr = JSON.stringify(gameState, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', 'slime_hunter_save.json');
        linkElement.click();
        linkElement.remove();
        addLog('게임 데이터를 내보냈습니다.', 'text-blue-300');
    }, [gameState, addLog]);

    const handleImport = useCallback((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target.result as string);
                setGameState(prevState => ({
                    ...INITIAL_GAME_STATE, ...parsed,
                    player: sanitizePlayerState(parsed.player || INITIAL_PLAYER),
                    inventory: parsed.inventory || INITIAL_INVENTORY,
                    upgrades: parsed.upgrades || {},
                    monster: null, damageNumbers: [],
                    logs: [...(parsed.logs || prevState.logs).slice(-49), { message: '데이터를 성공적으로 가져왔습니다!', color: 'text-green-300'}]
                }));
            } catch (err) {
                console.error("파일 읽기 오류:", err);
                addLog('데이터 가져오기에 실패했습니다. 유효한 파일이 아닙니다.', 'text-red-400');
            }
        };
        reader.readAsText(file);
    }, [addLog]);

    const handleMonsterDefeated = useCallback((defeatedMonster) => {
        if (!defeatedMonster) return;
        setGameState(prevState => {
            const currentStats = deriveStats(prevState);
            const player = sanitizePlayerState(prevState.player);
            
            const goldGained = Math.floor(sanitizeNumber(defeatedMonster.goldReward, 0) * (1 + currentStats.goldBonus));
            const xpGained = Math.floor(sanitizeNumber(defeatedMonster.xpReward, 0) * (1 + currentStats.xpBonus));

            let newGold = player.gold + goldGained;
            let newXp = player.xp + xpGained;
            let newLevel = player.level;
            let newXpToNextLevel = player.xpToNextLevel;
            let newBaseAttack = player.baseAttack;
            const logs = [...prevState.logs, { message: `몬스터를 처치하여 ${goldGained.toLocaleString()} 골드와 ${xpGained.toLocaleString()} 경험치를 획득했습니다.`, color: 'text-cyan-300' }];

            while (newLevel < LEVEL_CAP && newXp >= newXpToNextLevel) {
                newXp -= newXpToNextLevel;
                newLevel++;
                newBaseAttack += 1;
                newXpToNextLevel = Math.floor(10 * Math.pow(1.2, Math.min(newLevel - 1, LEVEL_CAP)));
                logs.push({ message: `레벨 업! ${newLevel}레벨이 되었습니다!`, color: 'text-yellow-300 font-bold' });
            }

            const newEquipment = [...prevState.inventory.equipment];
            const newJewels = [...prevState.inventory.jewels];
            if (Math.random() < 0.1) {
                if (Math.random() < 0.8) {
                    const newItem = generateEquipment(newLevel);
                    if (newEquipment.length < 50) newEquipment.push(newItem);
                    logs.push({ message: `[${newItem.rarity}] ${newItem.name}을(를) 획득했습니다!`, color: RARITY_CONFIG[newItem.rarity].color });
                } else {
                    const newJewel = generateJewel(newLevel);
                    if (newJewels.length < 50) newJewels.push(newJewel);
                    logs.push({ message: `[${newJewel.rarity}] ${newJewel.name}을(를) 획득했습니다!`, color: RARITY_CONFIG[newJewel.rarity].color });
                }
            }
            
            return {
                ...prevState,
                player: { ...player, gold: newGold, xp: newXp, level: newLevel, xpToNextLevel: newXpToNextLevel, baseAttack: newBaseAttack },
                inventory: { ...prevState.inventory, equipment: newEquipment, jewels: newJewels },
                monster: null,
                logs: logs.slice(-50),
            };
        });
    }, []);
    
    // --- Game Loops ---
    useEffect(() => {
        if (gameState.monster && gameState.monster.hp <= 0 && defeatedMonsterRef.current?.id !== gameState.monster.id) {
            defeatedMonsterRef.current = gameState.monster;
            handleMonsterDefeated(gameState.monster);
        }
    }, [gameState.monster, handleMonsterDefeated]);

    useEffect(() => {
        if (gameState.monster === null) {
            setGameState(prevState => ({ ...prevState, monster: MONSTER_GENERATOR(prevState.player.level) }));
            defeatedMonsterRef.current = null;
        }
    }, [gameState.monster, gameState.player.level]);

    useEffect(() => {
        const dpsInterval = setInterval(() => {
            setGameState(prevState => {
                if (!prevState.monster || prevState.monster.hp <= 0) return prevState;
                const currentStats = deriveStats(prevState);
                if (currentStats.totalDps <= 0) return prevState;
                const dpsDamage = currentStats.totalDps / 10;
                return { ...prevState, monster: { ...prevState.monster, hp: prevState.monster.hp - dpsDamage } };
            });
        }, 100);
        return () => clearInterval(dpsInterval);
    }, []);

    useEffect(() => {
        const cooldownInterval = setInterval(() => {
            setPowerShotCooldown(prev => Math.max(0, prev - 100));
            setGameState(prevState => ({ ...prevState, damageNumbers: prevState.damageNumbers.filter(dn => Date.now() - dn.id < 1000) }));
        }, 100);
        return () => clearInterval(cooldownInterval);
    }, []);

    useEffect(() => {
        const saveInterval = setInterval(handleSave, 30000);
        return () => clearInterval(saveInterval);
    }, [handleSave]);


    // --- Render ---
    const { player, monster, logs, damageNumbers, upgrades, inventory } = gameState;
    const psUpgrade = UPGRADES_CONFIG.find(u => u.id === 'POWER_SHOT_UPGRADE');
    const cooldownReduction = 1 - Math.min(0.9, sanitizeNumber(upgrades['POWER_SHOT_UPGRADE']?.level) * sanitizeNumber(psUpgrade?.benefit(0)));
    const maxCooldown = 30000 * cooldownReduction;

    return (
        <div className="min-h-screen bg-gray-800 bg-gradient-to-br from-gray-900 to-slate-800 font-sans p-4 flex flex-col items-center">
            <header className="w-full max-w-4xl mb-4 text-center">
                <h1 className="text-4xl font-bold text-yellow-300" style={{ textShadow: '0 0 10px #fde047' }}>슬라임 헌터</h1>
            </header>
            <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 flex flex-col gap-4">
                    <PlayerStats player={player} onNicknameChange={handleNicknameChange} calculatedStats={calculatedStats} />
                </div>
                <div className="md:col-span-1 flex flex-col gap-4">
                    <MonsterDisplay monster={monster} onAttack={handleAttack} damageNumbers={damageNumbers} isShaking={isShaking} />
                    <PowerShotButton onClick={handlePowerShot} cooldown={powerShotCooldown} maxCooldown={maxCooldown} />
                    <GameLog logs={logs} />
                </div>
                <div className="md:col-span-1 flex flex-col gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <div className="flex border-b border-gray-600">
                        <button onClick={() => setActiveTab('UPGRADES')} className={`flex-1 py-2 text-center font-bold ${activeTab === 'UPGRADES' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'}`}>강화</button>
                        <button onClick={() => setActiveTab('INVENTORY')} className={`flex-1 py-2 text-center font-bold ${activeTab === 'INVENTORY' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'}`}>인벤토리</button>
                        <button onClick={() => setActiveTab('SETTINGS')} className={`flex-1 py-2 text-center font-bold ${activeTab === 'SETTINGS' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'}`}>설정</button>
                    </div>
                    <div className="overflow-y-auto" style={{maxHeight: 'calc(100vh - 250px)'}}>
                        {activeTab === 'UPGRADES' && <UpgradePanel upgrades={upgrades} player={player} onUpgrade={handleUpgrade} />}
                        {activeTab === 'INVENTORY' && <InventoryPanel inventory={inventory} onEquip={handleEquipItem} onSocketJewel={() => {}} onUnsocketJewel={() => {}} />}
                        {activeTab === 'SETTINGS' && <SettingsPanel onSave={handleSave} onReset={handleReset} onExport={handleExport} onImport={handleImport} />}
                    </div>
                </div>
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);