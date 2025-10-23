import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

// --- TYPES ---
interface Player {
  nickname: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  gold: number;
  baseAttack: number;
  dps: number;
}

interface Monster {
  id: number;
  name: string;
  hp: number;
  maxHp: number;
  goldReward: number;
  xpReward: number;
  level: number;
  color: string;
  special?: 'HEAL';
  image: React.FC<React.SVGProps<SVGSVGElement>>;
}

interface Upgrade {
  id: string;
  name: string;
  description: (level: number, cost: number, benefit: number) => string;
  level: number;
  cost: (level: number) => number;
  benefit: (level: number) => number;
}

interface DamageNumber {
  id: number;
  amount: number | string;
  x: number;
  y: number;
  type: 'click' | 'dps' | 'heal' | 'skill';
}

type EquipmentType = 'WEAPON' | 'ARMOR' | 'RING';
type Rarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

type JewelType = 'RUBY' | 'SAPPHIRE' | 'EMERALD' | 'TOPAZ' | 'AMETHYST';
type JewelShape = 'CIRCLE' | 'SQUARE' | 'TRIANGLE';

interface Socket {
  shape: JewelShape;
  jewelId: string | null;
}

interface Jewel {
  id: string;
  name: string;
  type: JewelType;
  shape: JewelShape;
  rarity: Rarity;
  stats: {
    attack?: number;
    dps?: number;
    goldBonus?: number;
    xpBonus?: number;
    powerShotDamageBonus?: number;
  };
}

interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  rarity: Rarity;
  stats: {
    attack?: number;
    dps?: number;
    goldBonus?: number;
    xpBonus?: number;
  };
  sockets: Socket[];
  cost?: number;
}


// --- ICONS ---
const LevelIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
);
const XPIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
    </svg>
);
const CoinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 6v1m0-1c-1.11 0-2.08-.402-2.599-1M12 18c1.11 0 2.08-.402-2.599-1M8.999 12H8m8 0h-.001M12 21a9 9 0 110-18 9 9 0 010 18z" />
    </svg>
);
const SwordIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);
const PowerShotIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);
const CoinIconForSkill = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 6v1m0-1c-1.11 0-2.08-.402-2.599-1M12 18c1.11 0 2.08-.402-2.599-1M8.999 12H8m8 0h-.001M12 21a9 9 0 110-18 9 9 0 010 18z" />
    </svg>
);

// --- MONSTER ICONS ---
const SlimeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs><radialGradient id="slimeGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.5)' }} /><stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0)' }} /></radialGradient></defs>
        <path d="M 10,60 C 10,30 30,10 50,10 C 70,10 90,30 90,60 C 90,80 80,90 50,90 C 20,90 10,80 10,60 Z" fill="currentColor" />
        <circle cx="50" cy="50" r="40" fill="url(#slimeGradient)" /><circle cx="35" cy="45" r="5" fill="white" /><circle cx="65" cy="45" r="5" fill="white" /><circle cx="36" cy="46" r="2" fill="black" /><circle cx="66" cy="46" r="2" fill="black" />
    </svg>
);
const GoblinIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
const MushroomEntIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="35" y="50" width="30" height="45" fill="currentColor" />
        <path d="M50 15 C 20 15, 10 30, 10 50 L 90 50 C 90 30, 80 15, 50 15 Z" fill="red" stroke="white" strokeWidth="3" />
        <circle cx="25" cy="35" r="5" fill="white" /><circle cx="50" cy="30" r="6" fill="white" /><circle cx="75" cy="35" r="5" fill="white" />
        <circle cx="42" cy="70" r="4" fill="black" /><circle cx="58" cy="70" r="4" fill="black" />
    </svg>
);
const ShadowImpIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M50,10 C 80,40 90,80 50,90 C 10,80 20,40 50,10 Z" fill="currentColor" />
        <path d="M 50 10 L 40 30 L 60 30 Z" fill="currentColor" stroke="black" strokeWidth="2"/>
        <path d="M 20 70 L 10 90 L 30 80 Z" fill="currentColor" stroke="black" strokeWidth="1"/>
        <path d="M 80 70 L 90 90 L 70 80 Z" fill="currentColor" stroke="black" strokeWidth="1"/>
        <circle cx="40" cy="50" r="5" fill="red" /><circle cx="60" cy="50" r="5" fill="red" />
    </svg>
);
const SkeletonWarriorIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="50" cy="30" r="20" fill="currentColor" />
        <circle cx="42" cy="28" r="5" fill="black" /><circle cx="58" cy="28" r="5" fill="black" />
        <rect x="45" y="38" width="10" height="5" fill="black" /><rect x="35" y="50" width="30" height="5" rx="2" fill="currentColor" />
        <rect x="30" y="55" width="5" height="20" fill="currentColor" /><rect x="65" y="55" width="5" height="20" fill="currentColor" />
        <rect x="47.5" y="55" width="5" height="30" fill="currentColor" />
    </svg>
);
const StoneGolemIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="20" y="15" width="60" height="40" rx="5" fill="currentColor"/>
        <rect x="10" y="55" width="30" height="35" rx="5" fill="currentColor"/>
        <rect x="60" y="55" width="30" height="35" rx="5" fill="currentColor"/>
        <rect x="30" y="25" width="40" height="10" fill="darkslategray" />
    </svg>
);
const GiantSlimeKingIcon = (props: React.SVGProps<SVGSVGElement>) => (
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

interface MonsterTemplate {
    name: string;
    baseHp: number;
    baseGold: number;
    baseXp: number;
    color: string;
    minLevel: number;
    special?: 'HEAL';
    image: React.FC<React.SVGProps<SVGSVGElement>>;
}

// --- CONSTANTS & GAME DATA ---
const SAVED_GAME_KEY = 'slimeHunterSaveData_v3';
const INITIAL_PLAYER: Player = { nickname: '용사님', level: 1, xp: 0, xpToNextLevel: 10, gold: 0, baseAttack: 1, dps: 0 };

const MONSTER_TEMPLATES: MonsterTemplate[] = [
    { name: '초록 슬라임', baseHp: 8, baseGold: 2, baseXp: 5, color: 'text-green-400', minLevel: 1, image: SlimeIcon },
    { name: '파랑 슬라임', baseHp: 12, baseGold: 3, baseXp: 7, color: 'text-blue-400', minLevel: 2, image: SlimeIcon },
    { name: '고블린', baseHp: 20, baseGold: 5, baseXp: 10, color: 'text-emerald-500', minLevel: 4, image: GoblinIcon },
    { name: '버섯 엔트', baseHp: 35, baseGold: 6, baseXp: 12, color: 'text-orange-400', minLevel: 6, special: 'HEAL', image: MushroomEntIcon },
    { name: '그림자 임프', baseHp: 15, baseGold: 15, baseXp: 8, color: 'text-purple-500', minLevel: 8, image: ShadowImpIcon },
    { name: '스켈레톤 전사', baseHp: 50, baseGold: 10, baseXp: 20, color: 'text-gray-300', minLevel: 10, image: SkeletonWarriorIcon },
    { name: '돌 골렘', baseHp: 80, baseGold: 15, baseXp: 30, color: 'text-slate-500', minLevel: 12, image: StoneGolemIcon },
];

const BOSS_TEMPLATE: MonsterTemplate = { name: '거대 슬라임 왕', baseHp: 100, baseGold: 50, baseXp: 100, color: 'text-yellow-400', minLevel: 5, image: GiantSlimeKingIcon };

const UPGRADES_CONFIG: Omit<Upgrade, 'level'>[] = [
    { id: 'CLICK_UPGRADE', name: '검 강화', description: (l, c, b) => `클릭 공격력을 +${b} 만큼 영구적으로 증가시킵니다.`, cost: (l) => Math.floor(10 * Math.pow(1.2, l - 1)), benefit: (l) => Math.floor(1 * Math.pow(1.1, l - 1)) },
    { id: 'DPS_UPGRADE', name: '자동 공격 용병 고용', description: (l, c, b) => `초당 ${b}의 자동 공격을 추가합니다.`, cost: (l) => Math.floor(25 * Math.pow(1.5, l)), benefit: (l) => Math.floor(1 * Math.pow(1.3, l)) },
    { id: 'POWER_SHOT_UPGRADE', name: '파워 샷 쿨타임 감소', description: (l) => `파워 샷의 재사용 대기시간을 5% 감소시킵니다. (현재: -${Math.min(90, l * 5)}%)`, cost: (l) => Math.floor(150 * Math.pow(1.8, l)), benefit: () => 0.05 },
    { id: 'POWER_SHOT_DAMAGE_UPGRADE', name: '파워 샷 데미지 강화', description: (l, c, b) => `파워 샷의 데미지를 ${b * 100}% 만큼 영구적으로 증가시킵니다. (현재: +${(l * b * 100).toFixed(0)}%)`, cost: (l) => Math.floor(180 * Math.pow(1.8, l)), benefit: () => 0.1 },
    { id: 'GOLD_BONUS_UPGRADE', name: '황금 탐지기', description: (l, c, b) => `레벨당 골드 획득량이 ${b * 100}% 만큼 영구적으로 증가합니다. (현재: +${(l * b * 100).toFixed(1)}%)`, cost: (l) => Math.floor(100 * Math.pow(1.6, l)), benefit: () => 0.02 },
    { id: 'XP_BONUS_UPGRADE', name: '성장의 부적', description: (l, c, b) => `레벨당 경험치 획득량이 ${b * 100}% 만큼 영구적으로 증가합니다. (현재: +${(l * b * 100).toFixed(1)}%)`, cost: (l) => Math.floor(120 * Math.pow(1.7, l)), benefit: () => 0.015 },
    { id: 'BLESSING_UPGRADE', name: '여신의 축복', description: (l, c, b) => `모든 능력치(공격력, DPS, 보너스)를 ${b}배 증가시킵니다. (현재: x${Math.pow(b, l)})`, cost: (l) => 10000 * Math.pow(10, l), benefit: () => 2 },
];
const RARITY_CONFIG: { [key in Rarity]: { chance: number; multiplier: number; color: string } } = {
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
const JEWEL_CONFIG: { [key in JewelType]: { name: string; stats: Jewel['stats'] } } = {
    RUBY: { name: '루비', stats: { attack: 1 } },
    SAPPHIRE: { name: '사파이어', stats: { dps: 1 } },
    EMERALD: { name: '에메랄드', stats: { xpBonus: 0.01 } },
    TOPAZ: { name: '토파즈', stats: { goldBonus: 0.01 } },
    AMETHYST: { name: '자수정', stats: { powerShotDamageBonus: 0.02 } },
};
const JEWEL_SHAPES: JewelShape[] = ['CIRCLE', 'SQUARE', 'TRIANGLE'];

// --- GAME LOGIC HELPERS ---
const MONSTER_GENERATOR = (level: number): Monster => {
    // Boss generation
    if (level >= BOSS_TEMPLATE.minLevel && Math.random() < 0.05) {
        const template = BOSS_TEMPLATE;
        const hp = Math.floor(template.baseHp * Math.pow(1.3, level - template.minLevel));
        const goldReward = Math.floor(template.baseGold * Math.pow(1.2, level - template.minLevel));
        const xpReward = Math.floor(template.baseXp * Math.pow(1.2, level - template.minLevel));
        return { id: Date.now() + Math.random(), name: `${template.name} (Lv.${level})`, hp, maxHp: hp, goldReward, xpReward, level, color: template.color, special: template.special, image: template.image };
    }
    // Normal monster generation
    const availableMonsters = MONSTER_TEMPLATES.filter(m => level >= m.minLevel);
    const template = availableMonsters[Math.floor(Math.random() * availableMonsters.length)] || MONSTER_TEMPLATES[0];
    const hp = Math.floor(template.baseHp * Math.pow(1.25, level - 1));
    const goldReward = Math.floor(template.baseGold * Math.pow(1.15, level - 1));
    const xpReward = Math.floor(template.baseXp * Math.pow(1.12, level - 1));
    return { id: Date.now() + Math.random(), name: `${template.name} (Lv.${level})`, hp, maxHp: hp, goldReward, xpReward, level, color: template.color, special: template.special, image: template.image };
};

const generateEquipment = (playerLevel: number, isShopItem: boolean = false): Equipment => {
    const roll = Math.random();
    let rarity: Rarity = 'COMMON';
    if (roll < RARITY_CONFIG.LEGENDARY.chance) rarity = 'LEGENDARY';
    else if (roll < RARITY_CONFIG.EPIC.chance) rarity = 'EPIC';
    else if (roll < RARITY_CONFIG.RARE.chance) rarity = 'RARE';
    else if (roll < RARITY_CONFIG.UNCOMMON.chance) rarity = 'UNCOMMON';

    const type: EquipmentType = Object.keys(EQUIPMENT_BASES)[Math.floor(Math.random() * 3)] as EquipmentType;
    const baseName = EQUIPMENT_BASES[type][Math.floor(Math.random() * EQUIPMENT_BASES[type].length)];
    
    const stats: Equipment['stats'] = {};
    const multiplier = RARITY_CONFIG[rarity].multiplier;
    const statPower = Math.max(1, Math.floor(playerLevel * multiplier * (1 + Math.random() * 0.2)));

    switch (type) {
        case 'WEAPON': stats.attack = statPower; if (rarity !== 'COMMON') stats.dps = Math.floor(statPower / 2); break;
        case 'ARMOR': stats.goldBonus = Math.round(statPower * 1.5) / 100; break;
        case 'RING': stats.xpBonus = Math.round(statPower * 1.5) / 100; break;
    }

    const sockets: Socket[] = [];
    let socketCount = 0;
    if (rarity === 'UNCOMMON') socketCount = Math.random() < 0.5 ? 1 : 2;
    else if (rarity === 'RARE') socketCount = 2 + (Math.random() < 0.5 ? 1 : 0);
    else if (rarity === 'EPIC') socketCount = 3 + (Math.random() < 0.5 ? 1 : 0);
    else if (rarity === 'LEGENDARY') socketCount = 4;
    else socketCount = Math.random() < 0.3 ? 1 : 0;
    for (let i = 0; i < socketCount; i++) {
        sockets.push({ shape: JEWEL_SHAPES[Math.floor(Math.random() * JEWEL_SHAPES.length)], jewelId: null });
    }
    const name = `${baseName} (+${socketCount})`;
    const cost = isShopItem ? Math.floor((statPower * 15) * (1 + socketCount * 0.2) * multiplier) : undefined;

    return { id: `eq-${Date.now()}`, name, type, rarity, stats, sockets, cost };
};

const generateJewel = (playerLevel: number): Jewel => {
    const roll = Math.random();
    let rarity: Rarity = 'COMMON';
    if (roll < RARITY_CONFIG.LEGENDARY.chance / 2) rarity = 'LEGENDARY';
    else if (roll < RARITY_CONFIG.EPIC.chance / 2) rarity = 'EPIC';
    else if (roll < RARITY_CONFIG.RARE.chance / 2) rarity = 'RARE';
    else if (roll < RARITY_CONFIG.UNCOMMON.chance / 2) rarity = 'UNCOMMON';

    const type = Object.keys(JEWEL_CONFIG)[Math.floor(Math.random() * Object.keys(JEWEL_CONFIG).length)] as JewelType;
    const shape = JEWEL_SHAPES[Math.floor(Math.random() * JEWEL_SHAPES.length)];
    const config = JEWEL_CONFIG[type];
    const multiplier = RARITY_CONFIG[rarity].multiplier;

    const baseStatKey = Object.keys(config.stats)[0] as keyof Jewel['stats'];
    const baseStatValue = config.stats[baseStatKey]!;
    
    const finalStatValue = baseStatValue < 1
        ? Math.round(baseStatValue * multiplier * 100) / 100
        : Math.floor(baseStatValue * multiplier * (playerLevel / 5 + 1));

    const stats = { [baseStatKey]: finalStatValue };
    const name = `${config.name}`;
    
    return { id: `jw-${Date.now()}`, name, type, shape, rarity, stats };
};

// --- COMPONENTS ---
const StatBar = ({ value, maxValue, color, icon, label }: { value: number, maxValue: number, color: string, icon: React.ReactNode, label: string }) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    return (
        <div>
            <div className="flex justify-between items-center text-sm mb-1 text-gray-300">
                <div className="flex items-center gap-2">{icon}<span>{label}</span></div>
                <span>{Math.floor(value)} / {maxValue}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%`, transition: 'width 0.3s ease-in-out' }}></div>
            </div>
        </div>
    );
};

const PlayerStats = ({ player, onNicknameChange, totalAttack, totalDps, goldBonus, xpBonus, powerShotDamageBonus }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState(player.nickname);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        if (nickname.trim()) {
            onNicknameChange(nickname.trim());
        } else {
            setNickname(player.nickname); // Revert if empty
        }
        setIsEditing(false);
    };

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    return (
        <div className="flex flex-col gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            {isEditing ? (
                 <input
                    ref={inputRef}
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    className="text-xl font-bold text-center bg-gray-800 text-yellow-300 rounded-md border border-yellow-500"
                />
            ) : (
                <h2 
                    className="text-xl font-bold text-center text-yellow-300 cursor-pointer hover:bg-gray-800/50 rounded-md p-1"
                    onClick={() => setIsEditing(true)}
                    title="닉네임 변경"
                >
                    {player.nickname} 정보
                </h2>
            )}
            <div className="flex justify-around text-center">
                <div className="flex flex-col items-center"><LevelIcon className="w-8 h-8 text-green-400 mb-1" /><span className="text-sm text-gray-400">레벨</span><span className="text-lg font-bold">{player.level}</span></div>
                <div className="flex flex-col items-center"><CoinIcon className="w-8 h-8 text-yellow-400 mb-1" /><span className="text-sm text-gray-400">골드</span><span className="text-lg font-bold">{player.gold}</span></div>
            </div>
            <StatBar value={player.xp} maxValue={player.xpToNextLevel} color="bg-blue-500" icon={<XPIcon className="w-4 h-4" />} label="경험치" />
            <div className="grid grid-cols-2 gap-2 text-center mt-2 border-t border-gray-700 pt-4 text-sm">
                <div className="flex flex-col items-center"><span className="text-gray-400">클릭 공격력</span><span className="text-lg font-bold text-red-400">{totalAttack}</span></div>
                <div className="flex flex-col items-center"><span className="text-gray-400">초당 공격력</span><span className="text-lg font-bold text-purple-400">{totalDps}</span></div>
                <div className="flex flex-col items-center"><span className="text-gray-400">골드 보너스</span><span className="text-lg font-bold text-yellow-400">+{Math.round(goldBonus * 100)}%</span></div>
                <div className="flex flex-col items-center"><span className="text-gray-400">경험치 보너스</span><span className="text-lg font-bold text-blue-400">+{Math.round(xpBonus * 100)}%</span></div>
                {powerShotDamageBonus > 0 && (
                    <div className="col-span-2 flex flex-col items-center mt-2"><span className="text-gray-400">파워 샷 보너스</span><span className="text-lg font-bold text-fuchsia-400">+{Math.round(powerShotDamageBonus * 100)}%</span></div>
                )}
            </div>
        </div>
    );
};

const MonsterDisplay = ({ monster, onAttack, damageNumbers }) => {
    const [isHit, setIsHit] = useState(false);
    const hpPercentage = (monster.hp / monster.maxHp) * 100;

    useEffect(() => {
        if (damageNumbers.length > 0) {
            setIsHit(true);
            const timer = setTimeout(() => setIsHit(false), 100);
            return () => clearTimeout(timer);
        }
    }, [damageNumbers]);
    
    const MonsterImage = monster.image;

    return (
        <div className="relative w-80 h-80 flex flex-col items-center justify-center cursor-pointer group" onClick={onAttack}>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="mb-2 text-center"><h3 className="text-lg font-bold text-gray-200">{monster.name}</h3><p className="text-sm text-red-400 font-semibold">{monster.hp} / {monster.maxHp}</p></div>
                <div className={`relative w-56 h-56 transition-transform duration-100 ${isHit ? 'transform scale-95' : 'group-hover:scale-110'}`}>
                    <MonsterImage className={`w-full h-full ${monster.color} ${isHit ? 'animate-pulse' : ''}`} />
                </div>
                <div className="w-64 bg-gray-700 rounded-full h-4 mt-4 border-2 border-gray-600"><div className="bg-red-500 h-full rounded-full transition-all duration-200 ease-linear" style={{ width: `${hpPercentage}%` }}></div></div>
            </div>
            {damageNumbers.map(dn => {
                let colorClass = '', animationClass = 'animate-damage-popup', style = {};
                switch (dn.type) {
                    case 'click': colorClass = 'text-yellow-300 text-2xl'; break;
                    case 'dps': colorClass = 'text-purple-400 text-xl'; break;
                    case 'heal': colorClass = 'text-green-400 text-xl'; break;
                    case 'skill': colorClass = 'text-cyan-400 text-4xl'; animationClass = 'animate-damage-popup'; style = { textShadow: '0 0 8px rgba(0, 255, 255, 0.9)' }; break;
                }
                return <div key={dn.id} className={`absolute font-bold pointer-events-none ${animationClass} ${colorClass}`} style={{ left: `${dn.x}%`, top: `${dn.y}%`, textShadow: '0px 0px 5px rgba(0,0,0,0.8)', ...style }}>{dn.amount}</div>;
            })}
        </div>
    );
};

const UpgradePanel = ({ upgrades, onUpgrade, playerGold }) => (
    <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2">
        {upgrades.map(upgrade => {
            const cost = upgrade.cost(upgrade.level);
            const benefit = upgrade.benefit(upgrade.level);
            const canAfford = playerGold >= cost;
            return (
                <div key={upgrade.id} className={`bg-gray-800 p-4 rounded-lg border ${upgrade.id === 'BLESSING_UPGRADE' ? 'border-yellow-400' : 'border-gray-600'}`}>
                    <div className="flex justify-between items-center"><h3 className={`text-lg font-semibold ${upgrade.id === 'BLESSING_UPGRADE' ? 'text-yellow-300' : 'text-green-400'}`}>{upgrade.name}</h3><span className="text-sm text-gray-400">레벨 {upgrade.level > 0 ? upgrade.level : '-'}</span></div>
                    <p className="text-sm text-gray-300 my-2">{upgrade.description(upgrade.level, cost, benefit)}</p>
                    <button onClick={() => onUpgrade(upgrade.id)} disabled={!canAfford} className={`w-full font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${canAfford ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}><CoinIcon className="w-5 h-5" /><span>{cost}</span></button>
                </div>
            );
        })}
    </div>
);

const GameLog = ({ log }) => (
    <div className="flex-grow flex flex-col p-4 bg-gray-900/50 rounded-lg border border-gray-700 min-h-[150px]">
        <h2 className="text-xl font-bold text-center text-yellow-300 mb-2">게임 로그</h2>
        <div className="flex-grow bg-gray-900 p-2 rounded-md overflow-y-auto h-32">
            {log.map((message, index) => <p key={index} dangerouslySetInnerHTML={{ __html: `> ${message}` }} className={`text-sm ${index === 0 ? 'text-yellow-200' : 'text-gray-400'}`} />)}
        </div>
    </div>
);

const SkillsPanel = ({ onPowerShot, cooldown, powerShotBaseCooldown }) => {
    const isDisabled = cooldown > 0;
    return (
        <div className="w-full max-w-xs mt-4">
            <button onClick={onPowerShot} disabled={isDisabled} className={`w-full font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 relative overflow-hidden shadow-lg border border-gray-600 ${isDisabled ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-600 text-white'}`}>
                {cooldown > 0 && <div className="absolute top-0 left-0 h-full bg-black/50" style={{ width: `${(cooldown / powerShotBaseCooldown) * 100}%` }}></div>}
                <PowerShotIcon className="w-6 h-6 z-10" />
                <div className="flex flex-col items-center z-10">
                    <span className="text-md leading-tight">{cooldown > 0 ? `재사용 대기중 (${cooldown}s)` : '파워 샷'}</span>
                </div>
            </button>
        </div>
    );
};

const SocketShape: React.FC<{ shape: JewelShape, className?: string }> = ({ shape, className }) => {
    const baseStyle = "w-3 h-3 border border-gray-500";
    if (shape === 'CIRCLE') return <div className={`${baseStyle} rounded-full ${className}`}></div>
    if (shape === 'SQUARE') return <div className={`${baseStyle} ${className}`}></div>
    if (shape === 'TRIANGLE') return <div className={`w-0 h-0 border-x-[6px] border-x-transparent border-b-[10px] border-b-gray-500 ${className}`}></div>
    return null;
}

const SocketsDisplay = ({ sockets, allJewels, itemType, onSocketClick }: { sockets: Socket[], allJewels: Jewel[], itemType: EquipmentType, onSocketClick?: (itemType: EquipmentType, socketIndex: number) => void }) => (
    <div className="flex gap-1 mt-1">
        {sockets.map((socket, index) => {
            const jewel = socket.jewelId ? allJewels.find(j => j.id === socket.jewelId) : null;
            return (
                <button key={index} onClick={() => onSocketClick && onSocketClick(itemType, index)} className="relative w-4 h-4 flex items-center justify-center border border-gray-600 rounded-sm bg-gray-900">
                    {jewel ? (
                        <div className={`w-3 h-3 rounded-sm socket-jewel-${jewel.type}`}></div>
                    ) : (
                        <SocketShape shape={socket.shape} />
                    )}
                </button>
            )
        })}
    </div>
);

const EquipmentPanel = ({ equippedItems, allJewels }: { equippedItems: Record<EquipmentType, Equipment | null>, allJewels: Jewel[] }) => (
    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <h2 className="text-xl font-bold text-center text-yellow-300 mb-2">장비</h2>
        <div className="space-y-2">
            {(Object.keys(equippedItems) as EquipmentType[]).map((type) => {
                const item = equippedItems[type];
                return (
                    <div key={type} className="bg-gray-800 p-2 rounded-md">
                        <h3 className="font-bold text-sm text-gray-400">{type}</h3>
                        {item ? (
                            <div>
                                <p className={`font-semibold text-sm ${RARITY_CONFIG[item.rarity].color}`}>{item.name}</p>
                                <div className="text-xs text-cyan-300">
                                    {Object.entries(item.stats).map(([stat, value]) => (
                                        <span key={stat}>{`${stat}: +${stat.includes('Bonus') ? `${((value as number) * 100).toFixed(0)}%` : value} `}</span>
                                    ))}
                                </div>
                                {item.sockets && <SocketsDisplay sockets={item.sockets} allJewels={allJewels} itemType={type} />}
                            </div>
                        ) : <p className="text-sm text-gray-500">없음</p>}
                    </div>
                )
            })}
        </div>
    </div>
);

const EquipmentInventoryPanel = ({ inventory, onEquip }) => (
    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
        {inventory.length === 0 && <p className="text-center text-gray-500">장비가 없습니다.</p>}
        {inventory.map(item => (
            <button key={item.id} onClick={() => onEquip(item)} className="w-full text-left bg-gray-800 p-3 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors">
                <p className={`font-bold ${RARITY_CONFIG[item.rarity].color}`}>{item.name}</p>
                <div className="text-sm text-cyan-300">
                    {Object.entries(item.stats).map(([stat, value]) => (
                        <span key={stat}>{`${stat}: +${stat.includes('Bonus') ? `${((value as number) * 100).toFixed(0)}%` : value} `}</span>
                    ))}
                </div>
                <div className="flex gap-1 mt-1">
                    {item.sockets.map((socket, i) => <SocketShape key={i} shape={socket.shape} />)}
                </div>
            </button>
        ))}
    </div>
);

const SocketingPanel = ({ equippedItems, allJewels, onSocket, onUnsocket }: {
    equippedItems: Record<EquipmentType, Equipment | null>,
    allJewels: Jewel[],
    onSocket: (itemType: EquipmentType, socketIndex: number, jewel: Jewel) => void,
    onUnsocket: (itemType: EquipmentType, socketIndex: number) => void
}) => {
    const [selectedJewelId, setSelectedJewelId] = useState<string | null>(null);
    const socketedJewelIds = useMemo(() => {
        const ids = new Set<string>();
        Object.values(equippedItems).forEach((item: Equipment | null) => {
            if (item?.sockets) {
                item.sockets.forEach(socket => {
                    if (socket.jewelId) ids.add(socket.jewelId);
                });
            }
        });
        return ids;
    }, [equippedItems]);
    const availableJewels = allJewels.filter(j => !socketedJewelIds.has(j.id));
    const selectedJewel = allJewels.find(j => j.id === selectedJewelId);

    const handleSocketClick = (itemType: EquipmentType, socketIndex: number) => {
        const item = equippedItems[itemType];
        if (!item) return;
        const socket = item.sockets[socketIndex];
        if (socket.jewelId) { // Unsocket
            onUnsocket(itemType, socketIndex);
        } else if (selectedJewel) { // Socket
            if (selectedJewel.shape === socket.shape) {
                onSocket(itemType, socketIndex, selectedJewel);
                setSelectedJewelId(null);
            } else {
                alert('모양이 다른 소켓에는 장착할 수 없습니다.');
            }
        }
    };
    
    return (
        <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2">
            <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">장착된 장비</h3>
                <div className="space-y-2">
                    {(Object.keys(equippedItems) as EquipmentType[]).map(type => {
                        const item = equippedItems[type];
                        if (!item) return null;
                        return (
                             <div key={type} className="bg-gray-800 p-2 rounded-md">
                                <p className={`font-semibold text-sm ${RARITY_CONFIG[item.rarity].color}`}>{item.name}</p>
                                <SocketsDisplay sockets={item.sockets} allJewels={allJewels} itemType={type} onSocketClick={handleSocketClick} />
                            </div>
                        )
                    })}
                </div>
            </div>
             <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">보유 보석 ({availableJewels.length})</h3>
                <div className="space-y-2">
                    {availableJewels.length === 0 && <p className="text-center text-gray-500">보유한 보석이 없습니다.</p>}
                    {availableJewels.map(jewel => (
                        <button key={jewel.id} onClick={() => setSelectedJewelId(j => j === jewel.id ? null : jewel.id)} className={`w-full text-left bg-gray-800 p-2 rounded-lg border hover:bg-gray-700 transition-colors ${selectedJewelId === jewel.id ? 'border-yellow-400' : 'border-gray-600'}`}>
                            <div className="flex items-center gap-2">
                                <SocketShape shape={jewel.shape} className={`border-${RARITY_CONFIG[jewel.rarity].color.replace('text-', '')}`} />
                                <p className={`font-bold ${RARITY_CONFIG[jewel.rarity].color} jewel-name-${jewel.type}`}>{jewel.name}</p>
                            </div>
                            <div className="text-sm text-cyan-300 ml-5">
                                {Object.entries(jewel.stats).map(([stat, value]) => (
                                    <span key={stat}>{`${stat}: +${stat.includes('Bonus') ? `${((value as number) * 100).toFixed(1)}%` : value} `}</span>
                                ))}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
};

const ShopPanel = ({ items, playerGold, onBuy, onRefresh, refreshCost, onGacha, gachaCost }) => {
    const canAffordRefresh = playerGold >= refreshCost;
    const canAffordGacha = playerGold >= gachaCost;
    return (
        <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2">
            <div className="sticky top-0 bg-gray-800/80 backdrop-blur-sm pb-2 z-10 space-y-2">
                 <div className="bg-gray-800 p-3 rounded-lg border border-purple-500 text-center">
                    <h3 className="text-lg font-semibold text-purple-400">랜덤 장비 뽑기</h3>
                    <p className="text-sm text-gray-300 my-2">골드를 소모하여 무작위 등급의 장비를 획득합니다.</p>
                    <button 
                        onClick={onGacha} 
                        disabled={!canAffordGacha}
                        className={`w-full font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${canAffordGacha ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
                    >
                        <CoinIcon className="w-5 h-5" />
                        <span>{gachaCost}</span>
                    </button>
                </div>
                <button 
                    onClick={onRefresh} 
                    disabled={!canAffordRefresh}
                    className={`w-full font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${canAffordRefresh ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V4a1 1 0 011-1zm10 8a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 111.885-.666A5.002 5.002 0 0014.001 13H11a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                    상품 목록 갱신
                    <div className="flex items-center gap-1 text-xs text-yellow-200"><CoinIconForSkill /><span>{refreshCost}</span></div>
                </button>
            </div>
            {items.length === 0 && <p className="text-center text-gray-500 mt-4">모든 상품이 판매되었습니다. 목록을 갱신하세요.</p>}
            {items.map(item => {
                const canAfford = playerGold >= (item.cost || 0);
                return (
                    <div key={item.id} className="bg-gray-800 p-3 rounded-lg border border-gray-600">
                         <p className={`font-bold ${RARITY_CONFIG[item.rarity].color}`}>{item.name}</p>
                        <div className="text-sm text-cyan-300">
                            {Object.entries(item.stats).map(([stat, value]) => (
                                <span key={stat}>{`${stat}: +${stat.includes('Bonus') ? `${((value as number) * 100).toFixed(0)}%` : value} `}</span>
                            ))}
                        </div>
                        <div className="flex gap-1 mt-1">
                            {item.sockets.map((socket, i) => <SocketShape key={i} shape={socket.shape} />)}
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-700 flex justify-end">
                            <button 
                                onClick={() => onBuy(item.id)} 
                                disabled={!canAfford}
                                className={`font-bold py-1 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm ${canAfford ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
                            >
                                <CoinIcon className="w-4 h-4" />
                                <span>{item.cost}</span>
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const App = () => {
    const [tab, setTab] = useState('upgrades');

    const loadGame = () => {
        try {
            const savedData = localStorage.getItem(SAVED_GAME_KEY);
            if (!savedData) return null;
            const data = JSON.parse(savedData);
            const loadedUpgrades = UPGRADES_CONFIG.map(config => {
                const savedUpgrade = data.upgrades.find(u => u.id === config.id);
                const level = savedUpgrade ? savedUpgrade.level : (config.id === 'CLICK_UPGRADE' ? 1 : 0);
                return { ...config, level };
            });
            
             const rehydratedPlayer = { ...INITIAL_PLAYER, ...data.player };
            if (data.player && !data.monster) {
                data.monster = MONSTER_GENERATOR(rehydratedPlayer.level);
            } else if (data.monster) {
                const template = [...MONSTER_TEMPLATES, BOSS_TEMPLATE].find(t => data.monster.name.includes(t.name));
                if(template) data.monster.image = template.image;
            }

            return { ...data, upgrades: loadedUpgrades, player: rehydratedPlayer };
        } catch (error) {
            console.error("Failed to load game data:", error);
            localStorage.removeItem(SAVED_GAME_KEY);
            return null;
        }
    };
    
    const initialUpgrades = useMemo(() => UPGRADES_CONFIG.map(u => ({ ...u, level: u.id === 'CLICK_UPGRADE' ? 1 : 0 })), []);
    
    const generateShopStock = useCallback((playerLevel: number): Equipment[] => {
        return Array.from({ length: 4 }, () => generateEquipment(playerLevel, true));
    }, []);

    const loadedState = useMemo(loadGame, []);
    
    const [player, setPlayer] = useState(() => loadedState?.player || INITIAL_PLAYER);
    const [monster, setMonster] = useState<Monster | null>(() => loadedState?.monster || MONSTER_GENERATOR(player.level));
    const [upgrades, setUpgrades] = useState(() => loadedState?.upgrades || initialUpgrades);
    const [gameLog, setGameLog] = useState(['게임 시작! 첫 슬라임을 공격하세요.']);
    const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
    const [powerShotCooldown, setPowerShotCooldown] = useState(0);
    const [equippedItems, setEquippedItems] = useState<Record<EquipmentType, Equipment | null>>(() => loadedState?.equippedItems || { WEAPON: null, ARMOR: null, RING: null });
    const [inventory, setInventory] = useState<Equipment[]>(() => loadedState?.inventory || []);
    const [jewels, setJewels] = useState<Jewel[]>(() => loadedState?.jewels || []);
    const [shopItems, setShopItems] = useState<Equipment[]>(() => loadedState?.shopItems || generateShopStock(player.level));
    const [isScreenShaking, setIsScreenShaking] = useState(false);
    const prevLevelRef = useRef(player.level);
    const prevMonsterRef = useRef<Monster>();
    
    useEffect(() => {
        const gameState = {
            player,
            monster,
            upgrades: upgrades.map(u => ({ id: u.id, level: u.level })),
            equippedItems,
            inventory,
            jewels,
            shopItems,
        };
        localStorage.setItem(SAVED_GAME_KEY, JSON.stringify(gameState));
    }, [player, monster, upgrades, equippedItems, inventory, jewels, shopItems]);

    const socketedJewelIds = useMemo(() => {
        const ids = new Set<string>();
        Object.values(equippedItems).forEach((item: Equipment | null) => {
            if (item?.sockets) {
                item.sockets.forEach(socket => {
                    if (socket.jewelId) ids.add(socket.jewelId);
                });
            }
        });
        return ids;
    }, [equippedItems]);

    const equippedJewels = useMemo(() => {
        return jewels.filter(j => socketedJewelIds.has(j.id));
    }, [jewels, socketedJewelIds]);

    const { totalAttack, totalDps, goldBonus, xpBonus, powerShotDamageBonus } = useMemo(() => {
        let attack = player.baseAttack;
        let dps = player.dps;
        let gBonus = 0;
        let xBonus = 0;
        let psBonus = 0;

        const clickUpgrade = upgrades.find(u => u.id === 'CLICK_UPGRADE');
        if (clickUpgrade && clickUpgrade.level > 1) {
            for (let i = 1; i < clickUpgrade.level; i++) {
                attack += clickUpgrade.benefit(i);
            }
        }

        const dpsUpgrade = upgrades.find(u => u.id === 'DPS_UPGRADE');
        if (dpsUpgrade && dpsUpgrade.level > 0) {
            for (let i = 0; i < dpsUpgrade.level; i++) {
                dps += dpsUpgrade.benefit(i);
            }
        }
        
        const goldUpgrade = upgrades.find(u => u.id === 'GOLD_BONUS_UPGRADE');
        if (goldUpgrade) gBonus += goldUpgrade.level * goldUpgrade.benefit(goldUpgrade.level);

        const xpUpgrade = upgrades.find(u => u.id === 'XP_BONUS_UPGRADE');
        if (xpUpgrade) xBonus += xpUpgrade.level * xpUpgrade.benefit(xpUpgrade.level);

        const powerShotDamageUpgrade = upgrades.find(u => u.id === 'POWER_SHOT_DAMAGE_UPGRADE');
        if (powerShotDamageUpgrade) {
            psBonus += powerShotDamageUpgrade.level * powerShotDamageUpgrade.benefit(powerShotDamageUpgrade.level);
        }

        Object.values(equippedItems).forEach((item: Equipment | null) => {
            if (!item) return;
            attack += item.stats.attack || 0;
            dps += item.stats.dps || 0;
            gBonus += item.stats.goldBonus || 0;
            xBonus += item.stats.xpBonus || 0;
        });
        
        equippedJewels.forEach(jewel => {
            attack += jewel.stats.attack || 0;
            dps += jewel.stats.dps || 0;
            gBonus += jewel.stats.goldBonus || 0;
            xBonus += jewel.stats.xpBonus || 0;
            psBonus += jewel.stats.powerShotDamageBonus || 0;
        });

        const blessingUpgrade = upgrades.find(u => u.id === 'BLESSING_UPGRADE');
        const blessingMultiplier = blessingUpgrade ? Math.pow(blessingUpgrade.benefit(0), blessingUpgrade.level) : 1;
        
        attack *= blessingMultiplier;
        dps *= blessingMultiplier;
        gBonus *= blessingMultiplier;
        xBonus *= blessingMultiplier;
        psBonus *= blessingMultiplier;

        return { totalAttack: Math.floor(attack), totalDps: Math.floor(dps), goldBonus: gBonus, xpBonus: xBonus, powerShotDamageBonus: psBonus };
    }, [player, upgrades, equippedItems, equippedJewels]);
    
    const powerShotBaseCooldown = useMemo(() => {
        const powerShotUpgrade = upgrades.find(u => u.id === 'POWER_SHOT_UPGRADE');
        const reduction = powerShotUpgrade ? Math.min(0.9, powerShotUpgrade.level * powerShotUpgrade.benefit(powerShotUpgrade.level)) : 0;
        return Math.max(3, Math.floor(30 * (1 - reduction)));
    }, [upgrades]);
    
    const shopRefreshCost = useMemo(() => {
        return Math.floor(50 + player.level * 5);
    }, [player.level]);
    
    const gachaCost = useMemo(() => {
        return Math.floor(100 + player.level * 20);
    }, [player.level]);

    const addLog = useCallback((message: string) => {
        setGameLog(prevLog => [message, ...prevLog.slice(0, 14)]);
    }, []);

    useEffect(() => {
        if (player.level > prevLevelRef.current) {
            const previousLevel = prevLevelRef.current;
            const levelsGained = player.level - previousLevel;
            for (let i = 0; i < levelsGained; i++) {
                const newLevel = previousLevel + 1 + i;
                const goldReward = newLevel * 50;
                setPlayer(p => ({ ...p, gold: p.gold + goldReward }));
                addLog(`<span class="text-green-400 font-bold">레벨 업! ${newLevel}레벨 달성!</span> 보상으로 <span class="text-yellow-400">${goldReward} 골드</span>를 획득했습니다.`);

                if (Math.random() < 0.2) { // 20% chance
                    const newJewel = generateJewel(newLevel);
                    setJewels(j => [...j, newJewel]);
                    addLog(`레벨업 보너스! 보석 획득: <span class="${RARITY_CONFIG[newJewel.rarity].color} jewel-name-${newJewel.type}">${newJewel.name}</span>`);
                }
            }
        }
        prevLevelRef.current = player.level;
    }, [player.level, addLog]);

    const addDamageNumber = useCallback((amount: number | string, type: DamageNumber['type'], customX = 50, customY = 50) => {
        setDamageNumbers(prev => [...prev, {
            id: Date.now() + Math.random(),
            amount,
            x: customX - 10 + Math.random() * 20,
            y: customY - 10 + Math.random() * 20,
            type
        }]);
    }, []);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            if (damageNumbers.length > 20) {
                setDamageNumbers(d => d.slice(d.length - 20));
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [damageNumbers]);

    const gainXp = useCallback((xp: number) => {
        const finalXp = Math.floor(xp * (1 + xpBonus));
        setPlayer(p => {
            let newXp = p.xp + finalXp;
            let newLevel = p.level;
            let newXpToNext = p.xpToNextLevel;
            let newBaseAttack = p.baseAttack;

            while (newXp >= newXpToNext) {
                newXp -= newXpToNext;
                newLevel++;
                newXpToNext = Math.floor(10 * Math.pow(1.5, newLevel - 1));
                newBaseAttack = Math.floor(1 * Math.pow(1.2, newLevel - 1));
            }
            return { ...p, level: newLevel, xp: newXp, xpToNextLevel: newXpToNext, baseAttack: newBaseAttack };
        });
    }, [xpBonus]);

    const handleMonsterDefeat = useCallback((defeatedMonster: Monster) => {
        const goldWon = Math.floor(defeatedMonster.goldReward * (1 + goldBonus));
        addLog(`<span class="text-yellow-400">+${goldWon} 골드</span>와 <span class="text-blue-400">+${defeatedMonster.xpReward} 경험치</span>를 획득했습니다.`);
        setPlayer(p => ({ ...p, gold: p.gold + goldWon }));
        gainXp(defeatedMonster.xpReward);

        if (Math.random() < 0.1) {
            const newItem = generateEquipment(player.level);
            setInventory(inv => [...inv, newItem]);
            addLog(`아이템 획득: <span class="${RARITY_CONFIG[newItem.rarity].color}">${newItem.name}</span>`);
        }
        if (Math.random() < 0.05) {
            const newJewel = generateJewel(player.level);
            setJewels(j => [...j, newJewel]);
            addLog(`보석 획득: <span class="${RARITY_CONFIG[newJewel.rarity].color} jewel-name-${newJewel.type}">${newJewel.name}</span>`);
        }

        setMonster(MONSTER_GENERATOR(player.level));
    }, [player.level, goldBonus, gainXp, addLog]);

    const dealDamage = useCallback((damage: number) => {
        setMonster(m => {
            if (!m) return m;
            const newHp = Math.max(0, m.hp - damage);
            if (newHp === 0) {
                handleMonsterDefeat(m);
                return null;
            }
            if (m.special === 'HEAL' && m.hp / m.maxHp < 0.3 && Math.random() < 0.1) {
                const healAmount = Math.floor(m.maxHp * 0.15);
                addDamageNumber(`+${healAmount}`, 'heal', 50, 20);
                return { ...m, hp: Math.min(m.maxHp, m.hp + healAmount) };
            }
            return { ...m, hp: newHp };
        });
    }, [handleMonsterDefeat, addDamageNumber]);

    const handleAttack = useCallback((event: React.MouseEvent) => {
        if (!monster) return;
        
        setIsScreenShaking(true);
        setTimeout(() => setIsScreenShaking(false), 100);

        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        
        addDamageNumber(totalAttack, 'click', x, y);
        dealDamage(totalAttack);
    }, [monster, totalAttack, addDamageNumber, dealDamage]);

    const handleDpsAttack = useCallback(() => {
        if (!monster) return;
        addDamageNumber(totalDps, 'dps');
        dealDamage(totalDps);
    }, [monster, totalDps, addDamageNumber, dealDamage]);

    const handlePowerShot = useCallback(() => {
        if (!monster || powerShotCooldown > 0) return;

        setPowerShotCooldown(powerShotBaseCooldown);
        const damage = Math.floor(totalAttack * 5 * (1 + powerShotDamageBonus));
        addDamageNumber(damage, 'skill');
        dealDamage(damage);
        addLog(`<span class="text-cyan-400 font-bold">파워 샷!</span> ${damage}의 피해를 입혔습니다!`);
    }, [monster, powerShotCooldown, powerShotBaseCooldown, totalAttack, powerShotDamageBonus, addDamageNumber, dealDamage, addLog]);

    const handleUpgrade = useCallback((upgradeId: string) => {
        const upgrade = upgrades.find(u => u.id === upgradeId);
        if (!upgrade) return;
        const cost = upgrade.cost(upgrade.level);
        if (player.gold >= cost) {
            setPlayer(p => ({ ...p, gold: p.gold - cost }));
            setUpgrades(prev => prev.map(u => u.id === upgradeId ? { ...u, level: u.level + 1 } : u));
            if (upgrade.id === 'BLESSING_UPGRADE') {
                addLog(`<span class="text-yellow-300 font-bold">여신의 축복을 받아 모든 능력치가 2배가 되었습니다!</span>`);
            }
        }
    }, [player.gold, upgrades, addLog]);
    
    const handleEquip = useCallback((itemToEquip: Equipment) => {
        setEquippedItems(prev => {
            const currentItem = prev[itemToEquip.type];
            const newInventory = inventory.filter(i => i.id !== itemToEquip.id);
            if (currentItem) {
                newInventory.push(currentItem);
            }
            setInventory(newInventory);
            return { ...prev, [itemToEquip.type]: itemToEquip };
        });
        addLog(`[<span class="${RARITY_CONFIG[itemToEquip.rarity].color}">${itemToEquip.name}</span>] 을(를) 장착했습니다.`);
    }, [inventory, addLog]);
    
    const handleSocket = useCallback((itemType: EquipmentType, socketIndex: number, jewel: Jewel) => {
        setEquippedItems(prev => {
            const item = prev[itemType];
            if (!item || !item.sockets[socketIndex] || item.sockets[socketIndex].jewelId) return prev;
            const newSockets = [...item.sockets];
            newSockets[socketIndex] = { ...newSockets[socketIndex], jewelId: jewel.id };
            return { ...prev, [itemType]: { ...item, sockets: newSockets } };
        });
        addLog(`[<span class="jewel-name-${jewel.type} ${RARITY_CONFIG[jewel.rarity].color}">${jewel.name}</span>] 을(를) 소켓에 장착했습니다.`);
    }, [addLog]);

    const handleUnsocket = useCallback((itemType: EquipmentType, socketIndex: number) => {
        setEquippedItems(prev => {
            const item = prev[itemType];
            if (!item || !item.sockets[socketIndex] || !item.sockets[socketIndex].jewelId) return prev;
            const jewelId = item.sockets[socketIndex].jewelId;
            const jewel = jewels.find(j => j.id === jewelId);
            const newSockets = [...item.sockets];
            newSockets[socketIndex] = { ...newSockets[socketIndex], jewelId: null };
            if (jewel) {
                 addLog(`[<span class="jewel-name-${jewel.type} ${RARITY_CONFIG[jewel.rarity].color}">${jewel.name}</span>] 을(를) 소켓에서 제거했습니다.`);
            }
            return { ...prev, [itemType]: { ...item, sockets: newSockets } };
        });
    }, [addLog, jewels]);
    
    const handleBuyItem = useCallback((itemId: string) => {
        const item = shopItems.find(i => i.id === itemId);
        if (!item || !item.cost || player.gold < item.cost) return;
        
        setPlayer(p => ({ ...p, gold: p.gold - (item.cost || 0) }));
        setInventory(inv => [...inv, { ...item, cost: undefined }]);
        setShopItems(si => si.filter(i => i.id !== itemId));
        addLog(`상점에서 [<span class="${RARITY_CONFIG[item.rarity].color}">${item.name}</span>] 을(를) 구매했습니다.`);
    }, [player.gold, shopItems, addLog]);
    
    const handleRefreshShop = useCallback(() => {
        if (player.gold < shopRefreshCost) return;
        setPlayer(p => ({...p, gold: p.gold - shopRefreshCost }));
        setShopItems(generateShopStock(player.level));
        addLog('상점 목록을 갱신했습니다.');
    }, [player.gold, player.level, shopRefreshCost, generateShopStock, addLog]);

    const handleGacha = useCallback(() => {
        if (player.gold < gachaCost) return;
        setPlayer(p => ({ ...p, gold: p.gold - gachaCost }));
        const newItem = generateEquipment(player.level);
        setInventory(inv => [...inv, newItem]);
        addLog(`장비 뽑기 성공! [<span class="${RARITY_CONFIG[newItem.rarity].color}">${newItem.name}</span>] 획득!`);
    }, [player.gold, player.level, gachaCost, addLog]);
    
    const handleNicknameChange = useCallback((newName: string) => {
        setPlayer(p => ({ ...p, nickname: newName }));
        addLog(`닉네임이 [${newName}](으)로 변경되었습니다.`);
    }, [addLog]);

    useEffect(() => {
        if (totalDps > 0) {
            const interval = setInterval(() => {
                if (monster) {
                    handleDpsAttack();
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [totalDps, monster, handleDpsAttack]);

    useEffect(() => {
        if (powerShotCooldown > 0) {
            const timer = setTimeout(() => {
                setPowerShotCooldown(prev => Math.max(0, prev - 1));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [powerShotCooldown]);
    
    useEffect(() => {
        prevMonsterRef.current = monster;
    }, [monster]);

    return (
        <main className={`container mx-auto p-4 flex flex-col md:flex-row gap-4 items-start font-sans relative ${isScreenShaking ? 'animate-screen-shake' : ''}`}>
            <div className="absolute top-4 right-4 text-sm text-gray-500">제작자: 한국인이라면</div>
            <div className="w-full md:w-1/4 flex flex-col gap-4 order-2 md:order-1">
                <PlayerStats player={player} onNicknameChange={handleNicknameChange} totalAttack={totalAttack} totalDps={totalDps} goldBonus={goldBonus} xpBonus={xpBonus} powerShotDamageBonus={powerShotDamageBonus} />
                <EquipmentPanel equippedItems={equippedItems} allJewels={jewels} />
                <GameLog log={gameLog} />
            </div>

            <div className="w-full md:w-1/2 flex flex-col items-center gap-4 order-1 md:order-2">
                <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-4">
                    {monster ?
                        <MonsterDisplay monster={monster} onAttack={handleAttack} damageNumbers={damageNumbers} />
                        : <div className="w-80 h-80 flex items-center justify-center">Loading...</div>
                    }
                </div>
                <SkillsPanel onPowerShot={handlePowerShot} cooldown={powerShotCooldown} powerShotBaseCooldown={powerShotBaseCooldown} />
            </div>

            <div className="w-full md:w-1/4 flex flex-col gap-4 order-3 md:order-3 bg-gray-900/50 rounded-lg border border-gray-700 p-4">
                <div className="flex justify-around border-b border-gray-600 mb-2">
                    {['upgrades', 'inventory', 'socketing', 'shop'].map(t => (
                        <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-bold transition-colors ${tab === t ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'}`}>
                            {t === 'upgrades' && '강화'}
                            {t === 'inventory' && '가방'}
                            {t === 'socketing' && '보석'}
                            {t === 'shop' && '상점'}
                        </button>
                    ))}
                </div>
                {tab === 'upgrades' && <UpgradePanel upgrades={upgrades} onUpgrade={handleUpgrade} playerGold={player.gold} />}
                {tab === 'inventory' && <EquipmentInventoryPanel inventory={inventory} onEquip={handleEquip} />}
                {tab === 'socketing' && <SocketingPanel equippedItems={equippedItems} allJewels={jewels} onSocket={handleSocket} onUnsocket={handleUnsocket} />}
                {tab === 'shop' && <ShopPanel items={shopItems} playerGold={player.gold} onBuy={handleBuyItem} onRefresh={handleRefreshShop} refreshCost={shopRefreshCost} onGacha={handleGacha} gachaCost={gachaCost} />}
            </div>
        </main>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);