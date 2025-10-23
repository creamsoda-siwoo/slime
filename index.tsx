

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

// --- TYPES ---
interface Player {
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

type JewelType = 'RUBY' | 'SAPPHIRE' | 'EMERALD' | 'TOPAZ';
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
const SlimeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <radialGradient id="slimeGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.5)' }} />
                <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0)' }} />
            </radialGradient>
        </defs>
        <path d="M 10,60 C 10,30 30,10 50,10 C 70,10 90,30 90,60 C 90,80 80,90 50,90 C 20,90 10,80 10,60 Z" fill="currentColor" />
        <circle cx="50" cy="50" r="40" fill="url(#slimeGradient)" />
        <circle cx="35" cy="45" r="5" fill="white" />
        <circle cx="65" cy="45" r="5" fill="white" />
        <circle cx="36" cy="46" r="2" fill="black" />
        <circle cx="66" cy="46" r="2" fill="black" />
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

// Fix: Added MonsterTemplate interface to correctly type monster data
interface MonsterTemplate {
    name: string;
    baseHp: number;
    baseGold: number;
    baseXp: number;
    color: string;
    minLevel: number;
    special?: 'HEAL';
}

// --- CONSTANTS & GAME DATA ---
const SAVED_GAME_KEY = 'slimeHunterSaveData_v2';
const INITIAL_PLAYER: Player = { level: 1, xp: 0, xpToNextLevel: 10, gold: 0, baseAttack: 1, dps: 0 };
// Fix: Applied MonsterTemplate type to ensure type safety for monster properties like 'special'
const MONSTER_TEMPLATES: MonsterTemplate[] = [
    { name: '초록 슬라임', baseHp: 8, baseGold: 2, baseXp: 5, color: 'text-green-400', minLevel: 1 },
    { name: '파랑 슬라임', baseHp: 12, baseGold: 3, baseXp: 7, color: 'text-blue-400', minLevel: 2 },
    { name: '고블린', baseHp: 20, baseGold: 5, baseXp: 10, color: 'text-emerald-500', minLevel: 4 },
    { name: '버섯 엔트', baseHp: 35, baseGold: 6, baseXp: 12, color: 'text-orange-400', minLevel: 6, special: 'HEAL' },
    { name: '그림자 임프', baseHp: 15, baseGold: 15, baseXp: 8, color: 'text-purple-500', minLevel: 8 },
    { name: '스켈레톤 전사', baseHp: 50, baseGold: 10, baseXp: 20, color: 'text-gray-300', minLevel: 10 },
    { name: '돌 골렘', baseHp: 80, baseGold: 15, baseXp: 30, color: 'text-slate-500', minLevel: 12 },
];
// Fix: Applied MonsterTemplate type to ensure type safety for boss properties
const BOSS_TEMPLATE: MonsterTemplate = { name: '거대 슬라임 왕', baseHp: 100, baseGold: 50, baseXp: 100, color: 'text-yellow-400', minLevel: 5 };
const UPGRADES_CONFIG: Omit<Upgrade, 'level'>[] = [
    { id: 'CLICK_UPGRADE', name: '검 강화', description: (l, c, b) => `클릭 공격력을 +${b} 만큼 영구적으로 증가시킵니다.`, cost: (l) => Math.floor(10 * Math.pow(1.2, l - 1)), benefit: (l) => Math.floor(1 * Math.pow(1.1, l - 1)) },
    { id: 'DPS_UPGRADE', name: '자동 공격 용병 고용', description: (l, c, b) => `초당 ${b}의 자동 공격을 추가합니다.`, cost: (l) => Math.floor(25 * Math.pow(1.5, l)), benefit: (l) => Math.floor(1 * Math.pow(1.3, l)) },
    { id: 'POWER_SHOT_UPGRADE', name: '파워 샷 강화', description: (l) => `파워 샷의 골드 소모량을 5% 감소시킵니다. (현재: -${Math.min(95, l * 5)}%)`, cost: (l) => Math.floor(150 * Math.pow(1.8, l)), benefit: () => 0.05 },
];
const RARITY_CONFIG: { [key in Rarity]: { chance: number; multiplier: number; color: string } } = {
    COMMON: { chance: 0, multiplier: 1, color: 'text-white' },
    UNCOMMON: { chance: 0.25, multiplier: 1.5, color: 'text-green-400' },
    RARE: { chance: 0.10, multiplier: 2.5, color: 'text-blue-400' },
    EPIC: { chance: 0.04, multiplier: 4, color: 'text-purple-500' },
    LEGENDARY: { chance: 0.01, multiplier: 7, color: 'text-yellow-400' },
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
        return { id: Date.now() + Math.random(), name: `${template.name} (Lv.${level})`, hp, maxHp: hp, goldReward, xpReward, level, color: template.color, special: template.special };
    }
    // Normal monster generation
    const availableMonsters = MONSTER_TEMPLATES.filter(m => level >= m.minLevel);
    const template = availableMonsters[Math.floor(Math.random() * availableMonsters.length)] || MONSTER_TEMPLATES[0];
    const hp = Math.floor(template.baseHp * Math.pow(1.25, level - 1));
    const goldReward = Math.floor(template.baseGold * Math.pow(1.15, level - 1));
    const xpReward = Math.floor(template.baseXp * Math.pow(1.12, level - 1));
    return { id: Date.now() + Math.random(), name: `${template.name} (Lv.${level})`, hp, maxHp: hp, goldReward, xpReward, level, color: template.color, special: template.special };
};

const generateEquipment = (playerLevel: number): Equipment => {
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

    return { id: `eq-${Date.now()}`, name, type, rarity, stats, sockets };
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

const PlayerStats = ({ player, totalAttack, totalDps, goldBonus, xpBonus }) => (
    <div className="flex flex-col gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <h2 className="text-xl font-bold text-center text-yellow-300">플레이어 정보</h2>
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
        </div>
    </div>
);

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

    return (
        <div className="relative w-64 h-64 flex flex-col items-center justify-center cursor-pointer group" onClick={onAttack}>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="mb-2 text-center"><h3 className="text-lg font-bold text-gray-200">{monster.name}</h3><p className="text-sm text-red-400 font-semibold">{monster.hp} / {monster.maxHp}</p></div>
                <div className={`relative w-40 h-40 transition-transform duration-100 ${isHit ? 'transform scale-95' : 'group-hover:scale-110'}`}><SlimeIcon className={`w-full h-full ${monster.color} ${isHit ? 'animate-pulse' : ''}`} /></div>
                <div className="w-48 bg-gray-700 rounded-full h-4 mt-4 border-2 border-gray-600"><div className="bg-red-500 h-full rounded-full transition-all duration-200 ease-linear" style={{ width: `${hpPercentage}%` }}></div></div>
            </div>
            {damageNumbers.map(dn => {
                let colorClass = '', animationClass = 'animate-damage-popup', style = {};
                switch (dn.type) {
                    case 'click': colorClass = 'text-yellow-300 text-2xl'; break;
                    case 'dps': colorClass = 'text-purple-400 text-xl'; break;
                    case 'heal': colorClass = 'text-green-400 text-xl'; break;
                    case 'skill': colorClass = 'text-cyan-400 text-4xl'; animationClass = 'animate-damage-popup-skill'; style = { textShadow: '0 0 8px rgba(0, 255, 255, 0.9)' }; break;
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
                <div key={upgrade.id} className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                    <div className="flex justify-between items-center"><h3 className="text-lg font-semibold text-green-400">{upgrade.name}</h3><span className="text-sm text-gray-400">레벨 {upgrade.level > 0 ? upgrade.level : '-'}</span></div>
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

const SkillsPanel = ({ player, onPowerShot, cooldown, powerShotCost }) => {
    const canAfford = player.gold >= powerShotCost;
    const isDisabled = cooldown > 0 || !canAfford;
    return (
        <div className="w-full max-w-xs mt-4">
            <button onClick={onPowerShot} disabled={isDisabled} className={`w-full font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 relative overflow-hidden shadow-lg border border-gray-600 ${isDisabled ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-600 text-white'}`}>
                {cooldown > 0 && <div className="absolute top-0 left-0 h-full bg-black/50" style={{ width: `${(cooldown / 15) * 100}%` }}></div>}
                <PowerShotIcon className="w-6 h-6 z-10" />
                <div className="flex flex-col items-center z-10"><span className="text-md leading-tight">{cooldown > 0 ? `재사용 대기중 (${cooldown}s)` : '파워 샷'}</span><div className="flex items-center gap-1 text-xs text-yellow-200"><CoinIconForSkill /><span>{powerShotCost}</span></div></div>
            </button>
        </div>
    );
};

// Fix: Changed to React.FC to correctly handle the 'key' prop provided in loops.
const SocketShape: React.FC<{ shape: JewelShape, className?: string }> = ({ shape, className }) => {
    const baseStyle = "w-3 h-3 border border-gray-500";
    if (shape === 'CIRCLE') return <div className={`${baseStyle} rounded-full ${className}`}></div>
    if (shape === 'SQUARE') return <div className={`${baseStyle} ${className}`}></div>
    if (shape === 'TRIANGLE') return <div className={`w-0 h-0 border-x-[6px] border-x-transparent border-b-[10px] border-b-gray-500 ${className}`}></div>
    return null;
}

// Fix: Added explicit prop types and made onSocketClick optional to support usage in different contexts.
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
                                        // Fix: Cast 'value' to number to prevent arithmetic operation error on mixed types.
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
                        // Fix: Cast 'value' to number to prevent arithmetic operation error on mixed types.
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

// Fix: Added explicit prop types to ensure type safety for equipped items and jewels.
const SocketingPanel = ({ equippedItems, allJewels, onSocket, onUnsocket }: {
    equippedItems: Record<EquipmentType, Equipment | null>,
    allJewels: Jewel[],
    onSocket: (itemType: EquipmentType, socketIndex: number, jewel: Jewel) => void,
    onUnsocket: (itemType: EquipmentType, socketIndex: number) => void
}) => {
    const [selectedJewelId, setSelectedJewelId] = useState<string | null>(null);
    const socketedJewelIds = useMemo(() => {
        const ids = new Set<string>();
        Object.values(equippedItems).forEach(item => {
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
                                    // Fix: Cast 'value' to number to prevent arithmetic operation error on mixed types.
                                    <span key={stat}>{`${stat}: +${stat.includes('Bonus') ? `${((value as number) * 100).toFixed(1)}%` : value} `}</span>
                                ))}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

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
            return { ...data, upgrades: loadedUpgrades };
        } catch (error) {
            console.error("Failed to load game data:", error);
            localStorage.removeItem(SAVED_GAME_KEY);
            return null;
        }
    };
    
    const initialUpgrades = useMemo(() => UPGRADES_CONFIG.map(u => ({ ...u, level: u.id === 'CLICK_UPGRADE' ? 1 : 0 })), []);

    const [player, setPlayer] = useState(() => loadGame()?.player || INITIAL_PLAYER);
    const [monster, setMonster] = useState(() => MONSTER_GENERATOR(player.level));
    const [upgrades, setUpgrades] = useState(() => loadGame()?.upgrades || initialUpgrades);
    const [gameLog, setGameLog] = useState(['게임 시작! 첫 슬라임을 공격하세요.']);
    const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
    const [powerShotCooldown, setPowerShotCooldown] = useState(0);
    // Fix: Explicitly typed state to prevent 'unknown' type errors on properties.
    const [equippedItems, setEquippedItems] = useState<Record<EquipmentType, Equipment | null>>(() => loadGame()?.equippedItems || { WEAPON: null, ARMOR: null, RING: null });
    const [inventory, setInventory] = useState<Equipment[]>(() => loadGame()?.inventory || []);
    const [jewels, setJewels] = useState<Jewel[]>(() => loadGame()?.jewels || []);
    const prevMonsterRef = useRef<Monster>();
    
    useEffect(() => {
        const gameState = { player, upgrades: upgrades.map(u => ({id: u.id, level: u.level})), equippedItems, inventory, jewels };
        localStorage.setItem(SAVED_GAME_KEY, JSON.stringify(gameState));
    }, [player, upgrades, equippedItems, inventory, jewels]);

    const addLog = (message: string) => setGameLog(prev => [message, ...prev.slice(0, 9)]);

    const spawnFloatingNumber = (amount: number | string, type: DamageNumber['type']) => {
        const newNumber: DamageNumber = { id: Date.now() + Math.random(), amount, x: 50 + Math.random() * 20 - 10, y: 50 + Math.random() * 20 - 10, type };
        setDamageNumbers(prev => [...prev, newNumber]);
        setTimeout(() => setDamageNumbers(prev => prev.filter(dn => dn.id !== newNumber.id)), 1000);
    };

    const playerStats = useMemo(() => {
        let totalAttack = player.baseAttack;
        let totalDps = player.dps;
        let goldBonus = 0;
        let xpBonus = 0;

        const allItems = Object.values(equippedItems).filter(item => item !== null) as Equipment[];
        allItems.forEach(item => {
            totalAttack += item.stats.attack || 0;
            totalDps += item.stats.dps || 0;
            goldBonus += item.stats.goldBonus || 0;
            xpBonus += item.stats.xpBonus || 0;

            item.sockets.forEach(socket => {
                if(socket.jewelId) {
                    const jewel = jewels.find(j => j.id === socket.jewelId);
                    if (jewel) {
                        totalAttack += jewel.stats.attack || 0;
                        totalDps += jewel.stats.dps || 0;
                        goldBonus += jewel.stats.goldBonus || 0;
                        xpBonus += jewel.stats.xpBonus || 0;
                    }
                }
            })
        });
        
        return { totalAttack, totalDps, goldBonus, xpBonus };
    }, [player, equippedItems, jewels]);

    const dealDamage = useCallback((damage: number, type: DamageNumber['type']) => {
        if (monster.hp <= 0) return;
        let newHp = Math.max(0, monster.hp - damage);
        if (newHp > 0 && monster.special === 'HEAL' && Math.random() < 0.15) {
            const healAmount = Math.max(1, Math.floor(monster.maxHp * 0.05));
            newHp = Math.min(monster.maxHp, newHp + healAmount);
            addLog(`${monster.name}이(가) 스스로를 치유했습니다! (+${healAmount} HP)`);
            spawnFloatingNumber(`+${healAmount}`, 'heal');
        }
        setMonster(prev => ({ ...prev, hp: newHp }));
        spawnFloatingNumber(damage, type);
    }, [monster]);

    useEffect(() => {
        if (prevMonsterRef.current && prevMonsterRef.current.hp > 0 && monster.hp === 0) {
            const goldReward = Math.floor(monster.goldReward * (1 + playerStats.goldBonus));
            const xpReward = Math.floor(monster.xpReward * (1 + playerStats.xpBonus));

            addLog(`${monster.name}을(를) 물리쳤습니다!`);
            addLog(`+${goldReward} 골드, +${xpReward} 경험치`);

            let newXp = player.xp + xpReward;
            let newLevel = player.level;
            let newXpToNextLevel = player.xpToNextLevel;
            let newBaseAttack = player.baseAttack;

            while (newXp >= newXpToNextLevel) {
                newXp -= newXpToNextLevel;
                newLevel++;
                newXpToNextLevel = Math.floor(newXpToNextLevel * 1.5);
                newBaseAttack = Math.floor(newBaseAttack * 1.2);
                addLog(`레벨 업! ${newLevel}레벨이 되었습니다!`);
            }

            if (Math.random() < 0.15) {
                const newItem = generateEquipment(newLevel);
                addLog(`<span class="${RARITY_CONFIG[newItem.rarity].color}">[${newItem.name}]</span> 장비를 획득했습니다!`);
                setInventory(prev => [newItem, ...prev].slice(0, 20));
            }
            if (Math.random() < 0.05) {
                const newJewel = generateJewel(newLevel);
                addLog(`<span class="jewel-name-${newJewel.type} ${RARITY_CONFIG[newJewel.rarity].color}">[${newJewel.name}]</span> 보석을 획득했습니다!`);
                setJewels(prev => [newJewel, ...prev].slice(0, 50));
            }

            const nextPlayerState = { ...player, level: newLevel, xp: newXp, xpToNextLevel: newXpToNextLevel, gold: player.gold + goldReward, baseAttack: newBaseAttack };
            setPlayer(nextPlayerState);
            setMonster(MONSTER_GENERATOR(nextPlayerState.level));
        }
        prevMonsterRef.current = monster;
    }, [monster, player, playerStats]);
    
    const handleAttack = () => dealDamage(playerStats.totalAttack, 'click');
    
    const powerShotUpgrade = upgrades.find(u => u.id === 'POWER_SHOT_UPGRADE')!;
    const powerShotCostReduction = Math.min(0.95, powerShotUpgrade.level * 0.05);
    const powerShotCost = Math.floor((50 + player.level * 10) * (1 - powerShotCostReduction));
    const powerShotDamage = Math.floor(playerStats.totalAttack * 5 + playerStats.totalDps * 2 + player.level * 3);
    
    const handlePowerShot = () => {
        if (powerShotCooldown > 0 || player.gold < powerShotCost) return;
        setPlayer(prev => ({...prev, gold: prev.gold - powerShotCost}));
        dealDamage(powerShotDamage, 'skill');
        setPowerShotCooldown(15);
        addLog(`파워 샷! ${powerShotDamage}의 피해를 입혔습니다! (-${powerShotCost} 골드)`);
    };

    const handleUpgrade = (id: string) => {
        const upgrade = upgrades.find(u => u.id === id);
        if (!upgrade) return;
        const cost = upgrade.cost(upgrade.level);
        if (player.gold < cost) return;

        setPlayer(p => ({
            ...p,
            gold: p.gold - cost,
            baseAttack: id === 'CLICK_UPGRADE' ? p.baseAttack + upgrade.benefit(upgrade.level) : p.baseAttack,
            dps: id === 'DPS_UPGRADE' ? p.dps + upgrade.benefit(upgrade.level) : p.dps,
        }));
        setUpgrades(upgrades.map(u => u.id === id ? { ...u, level: u.level + 1 } : u));
        addLog(`${upgrade.name} 강화! (레벨 ${upgrade.level + 1})`);
    };

    const handleEquipItem = (itemToEquip: Equipment) => {
        const oldItem = equippedItems[itemToEquip.type];
        setEquippedItems(prev => ({ ...prev, [itemToEquip.type]: itemToEquip }));
        setInventory(prev => prev.filter(i => i.id !== itemToEquip.id));
        if (oldItem) {
            setInventory(prev => [oldItem, ...prev].slice(0,20));
            addLog(`[${itemToEquip.name}] 장착, [${oldItem.name}] 해제.`);
        } else {
            addLog(`[${itemToEquip.name}] 장착.`);
        }
    };

    const handleSocketJewel = (itemType: EquipmentType, socketIndex: number, jewel: Jewel) => {
        setEquippedItems(prev => {
            const newEquipped = {...prev};
            const item = newEquipped[itemType];
            if (item) {
                const newSockets = [...item.sockets];
                newSockets[socketIndex] = {...newSockets[socketIndex], jewelId: jewel.id};
                newEquipped[itemType] = {...item, sockets: newSockets};
                addLog(`[${item.name}]에 [${jewel.name}] 보석 장착!`);
                return newEquipped;
            }
            return prev;
        });
    }

    const handleUnsocketJewel = (itemType: EquipmentType, socketIndex: number) => {
        setEquippedItems(prev => {
            const newEquipped = {...prev};
            const item = newEquipped[itemType];
            if (item && item.sockets[socketIndex].jewelId) {
                const jewelId = item.sockets[socketIndex].jewelId;
                const jewel = jewels.find(j => j.id === jewelId);
                const newSockets = [...item.sockets];
                newSockets[socketIndex] = {...newSockets[socketIndex], jewelId: null};
                newEquipped[itemType] = {...item, sockets: newSockets};
                addLog(`[${item.name}]에서 [${jewel?.name}] 보석 제거.`);
                return newEquipped;
            }
            return prev;
        });
    }

    useEffect(() => {
        if (playerStats.totalDps > 0) {
            const interval = setInterval(() => dealDamage(playerStats.totalDps, 'dps'), 1000);
            return () => clearInterval(interval);
        }
    }, [playerStats.totalDps, dealDamage]);

    useEffect(() => {
        if (powerShotCooldown > 0) {
            const timer = setInterval(() => setPowerShotCooldown(p => Math.max(0, p - 1)), 1000);
            return () => clearInterval(timer);
        }
    }, [powerShotCooldown]);
    
    const socketedJewelIds = useMemo(() => {
        const ids = new Set<string>();
        Object.values(equippedItems).forEach(item => {
            if (item?.sockets) {
                item.sockets.forEach(socket => {
                    if (socket.jewelId) ids.add(socket.jewelId);
                });
            }
        });
        return ids;
    }, [equippedItems]);
    const availableJewels = jewels.filter(j => !socketedJewelIds.has(j.id));

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col items-center justify-center p-4 font-sans select-none">
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col gap-6 order-2 lg:order-1">
                    <PlayerStats player={player} {...playerStats} />
                    <EquipmentPanel equippedItems={equippedItems} allJewels={jewels} />
                    <GameLog log={gameLog} />
                </div>
                <div className="lg:col-span-1 flex flex-col items-center justify-center order-1 lg:order-2">
                    <h1 className="text-4xl font-bold text-yellow-400 mb-4 tracking-wider" style={{ textShadow: '0 0 10px rgba(250, 204, 21, 0.7)' }}>슬라임 헌터</h1>
                    <MonsterDisplay monster={monster} onAttack={handleAttack} damageNumbers={damageNumbers} />
                    <SkillsPanel player={player} onPowerShot={handlePowerShot} cooldown={powerShotCooldown} powerShotCost={powerShotCost} />
                </div>
                <div className="lg:col-span-1 bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 order-3 lg:order-3">
                    <div className="flex mb-4 border-b border-gray-600">
                        <button onClick={() => setTab('upgrades')} className={`flex-1 py-2 font-bold ${tab === 'upgrades' ? 'text-yellow-300 border-b-2 border-yellow-300' : 'text-gray-400'}`}>업그레이드</button>
                        <button onClick={() => setTab('inventory')} className={`flex-1 py-2 font-bold ${tab === 'inventory' ? 'text-yellow-300 border-b-2 border-yellow-300' : 'text-gray-400'}`}>장비 ({inventory.length})</button>
                        <button onClick={() => setTab('socketing')} className={`flex-1 py-2 font-bold ${tab === 'socketing' ? 'text-yellow-300 border-b-2 border-yellow-300' : 'text-gray-400'}`}>소켓 장착 ({availableJewels.length})</button>
                    </div>
                    {tab === 'upgrades' && <UpgradePanel upgrades={upgrades} onUpgrade={handleUpgrade} playerGold={player.gold} />}
                    {tab === 'inventory' && <EquipmentInventoryPanel inventory={inventory} onEquip={handleEquipItem} />}
                    {tab === 'socketing' && <SocketingPanel equippedItems={equippedItems} allJewels={jewels} onSocket={handleSocketJewel} onUnsocket={handleUnsocketJewel} />}
                </div>
            </div>
            <footer className="text-center text-gray-500 mt-8"><p>&copy; 2024 Slime Hunter. A simple RPG.</p></footer>
        </div>
    );
};

// --- RENDER APP ---
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");
const root = ReactDOM.createRoot(rootElement);
root.render(<React.StrictMode><App /></React.StrictMode>);