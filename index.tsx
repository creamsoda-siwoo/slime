// Fix: Import React to resolve 'React' is not defined errors and enable JSX syntax.
import * as React from 'react';
// Use global React and ReactDOM loaded from CDN, and destructure hooks for convenience.
const { useState, useEffect, useCallback, useRef, useMemo } = React;

// --- CONFIG ---
const LEVEL_EXPERIENCE_BASE = 20;
const LEVEL_EXPERIENCE_MULTIPLIER = 1.15;
const MONSTER_HP_BASE = 20;
const MONSTER_HP_MULTIPLIER = 1.16;
const MONSTER_REWARD_BASE = 5;
const MONSTER_REWARD_MULTIPLIER = 1.1;
const BOSS_LEVEL_INTERVAL = 10;
const BOSS_HP_MULTIPLIER = 4.0;
const BOSS_REWARD_MULTIPLIER = 3;
const BOSS_DROP_CHANCE_BOOST = 0.2;

const CLICK_UPGRADE_COST_BASE = 4;
const CLICK_UPGRADE_COST_MULTIPLIER = 1.12;
const AUTO_ATTACK_UPGRADE_COST_BASE = 10;
const AUTO_ATTACK_UPGRADE_COST_MULTIPLIER = 1.18;
const CRIT_CHANCE_UPGRADE_COST_BASE = 30;
const CRIT_CHANCE_UPGRADE_COST_MULTIPLIER = 1.32;
const CRIT_CHANCE_UPGRADE_INCREASE = 1;
const CRIT_DAMAGE_UPGRADE_COST_BASE = 50;
const CRIT_DAMAGE_UPGRADE_COST_MULTIPLIER = 1.30;
const CRIT_DAMAGE_UPGRADE_INCREASE = 5;

const GOLD_GAIN_UPGRADE_COST_BASE = 50;
const GOLD_GAIN_UPGRADE_COST_MULTIPLIER = 1.33;
const XP_GAIN_UPGRADE_COST_BASE = 75;
const XP_GAIN_UPGRADE_COST_MULTIPLIER = 1.42;

const ATTACK_SPEED_UPGRADE_COST_BASE = 100;
const ATTACK_SPEED_UPGRADE_COST_MULTIPLIER = 1.28;
const HASTE_UPGRADE_COST_BASE = 250;
const HASTE_UPGRADE_COST_MULTIPLIER = 1.48;
const LUCK_UPGRADE_COST_BASE = 200;
const LUCK_UPGRADE_COST_MULTIPLIER = 1.36;

const SKILL_DAMAGE_UPGRADE_COST_BASE = 150;
const SKILL_DAMAGE_UPGRADE_COST_MULTIPLIER = 1.45;

const BOSS_DAMAGE_UPGRADE_COST_BASE = 200;
const BOSS_DAMAGE_UPGRADE_COST_MULTIPLIER = 1.41;

const ARTIFACT_POWER_UPGRADE_COST_BASE = 5000;
const ARTIFACT_POWER_UPGRADE_COST_MULTIPLIER = 1.5;

const FINAL_DAMAGE_UPGRADE_COST_BASE = 1000;
const FINAL_DAMAGE_UPGRADE_COST_MULTIPLIER = 1.55;

const SKILL_DURATION_UPGRADE_COST_BASE = 800;
const SKILL_DURATION_UPGRADE_COST_MULTIPLIER = 1.5;

const ELEMENTAL_POWER_UPGRADE_COST_BASE = 1200;
const ELEMENTAL_POWER_UPGRADE_COST_MULTIPLIER = 1.52;
const OFFLINE_REWARDS_UPGRADE_COST_BASE = 1500;
const OFFLINE_REWARDS_UPGRADE_COST_MULTIPLIER = 1.6;
const TREASURE_GOLEM_CHANCE_UPGRADE_COST_BASE = 2500;
const TREASURE_GOLEM_CHANCE_UPGRADE_COST_MULTIPLIER = 1.7;


const LIBERATION_COST_BASE = 10000;
const LIBERATION_COST_MULTIPLIER = 100;

const BASE_SKILL_COOLDOWN = 30000; // 30 seconds

const EQUIPMENT_DROP_CHANCE_BASE = 0.15;
const EQUIPMENT_GACHA_COST_BASE = 100;
const EQUIPMENT_GACHA_COST_LEVEL_MULTIPLIER = 20;

const REBIRTH_LEVEL_REQUIREMENT = 30;
const REBIRTH_ALL_STAT_BONUS = 10; // All stats +10%

const TREASURE_GOLEM_SPAWN_CHANCE = 0.02; // 2% chance
const TREASURE_GOLEM_TIMER = 30; // 30 seconds

const SAVED_GAME_KEY = 'slimeHunterSaveData';

// --- ELEMENTAL DATA ---
const ELEMENT_TYPES = {
    FIRE: { name: '불', icon: (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-red-500" {...props}><path d="M12 2.25c.991 1.726 2.5 3.013 2.5 4.75 0 1.933-1.567 3.5-3.5 3.5-1.933 0-3.5-1.567-3.5-3.5 0-1.737 1.509-3.024 2.5-4.75z M12 21.75c-3.314 0-6-2.686-6-6 0-3.314 2.686-6 6-6s6 2.686 6 6c0 3.314-2.686 6-6 6z M12 11.25c-2.485 0-4.5 2.015-4.5 4.5s2.015 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.015-4.5-4.5-4.5z"/></svg> },
    WATER: { name: '물', icon: (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500" {...props}><path d="M12 2c-5.523 0-10 4.477-10 10 0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z M12 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z M12 6c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6z M12 16c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/></svg> },
    EARTH: { name: '땅', icon: (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-700" {...props}><path d="M12 2L2 12l10 10 10-10L12 2z m0 17.172L4.828 12 12 4.828 19.172 12 12 19.172z"/></svg> },
    WIND: { name: '바람', icon: (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400" {...props}><path d="M12 2c-5.523 0-10 4.477-10 10s4.477 10 10 10c2.761 0 5.261-1.121 7.071-2.929l-1.414-1.414c-1.569 1.569-3.71 2.343-5.657 2.343-4.411 0-8-3.589-8-8s3.589-8 8-8c1.947 0 3.788 0.774 5.146 2.059l-1.146 1.146h5v-5l-1.464 1.464c-1.85-1.85-4.408-2.669-6.936-2.669z"/></svg> },
};
const ELEMENTAL_RELATIONSHIPS = {
    FIRE: { weak: 'WIND', strong: 'WATER' },
    WATER: { weak: 'FIRE', strong: 'EARTH' },
    EARTH: { weak: 'WATER', strong: 'WIND' },
    WIND: { weak: 'EARTH', strong: 'FIRE' },
};
const ELEMENTAL_ADVANTAGE_MULTIPLIER = 1.25;
const ELEMENTAL_DISADVANTAGE_MULTIPLIER = 0.75;

// --- DIFFICULTY DATA ---
const DIFFICULTIES = {
    EASY: {
        name: '쉬움',
        description: '느긋하게 즐기는 모험. 몬스터가 약하고 성장이 빠릅니다.',
        multipliers: { monsterHp: 0.75, monsterReward: 1.25, upgradeCost: 0.8 }
    },
    NORMAL: {
        name: '보통',
        description: '균형 잡힌 도전. 표준적인 게임 플레이를 경험하세요.',
        multipliers: { monsterHp: 1.0, monsterReward: 1.0, upgradeCost: 1.0 }
    },
    HARD: {
        name: '어려움',
        description: '진정한 헌터를 위한 시련. 몬스터가 강력하지만, 보상이 더 큽니다.',
        multipliers: { monsterHp: 1.5, monsterReward: 1.2, upgradeCost: 1.2 }
    }
};

// --- JOB DATA ---
const JOBS = {
    WARRIOR: {
        name: '전사',
        description: '강력한 클릭 공격과 지속적인 전투에 특화되었습니다.',
        passive: '클릭 데미지 +25%, 자동 공격 데미지 +10%',
        skill: { name: '광란', description: '8초간 클릭 데미지 +100%, 자동 공격 데미지 +50% 증가' },
        skill2: { name: '방패 강타', description: '자동 공격력의 5배 피해를 주고 1.5초간 몬스터를 기절시킵니다.', cooldown: 25000 },
        bonuses: { clickDamage: 0.25, autoAttackDamage: 0.10, critChance: 0, critDamage: 0, skillEffect: 0 },
        icon: (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
    },
    ARCHER: {
        name: '궁수',
        description: '치명타를 활용하여 폭발적인 데미지를 입힙니다.',
        passive: '크리티컬 확률 +10%p, 크리티컬 데미지 +50%p',
        skill: { name: '화살비', description: '즉시 클릭 데미지의 3배 피해를 주고, 5초간 크리티컬 확률이 25%p 증가합니다.' },
        skill2: { name: '약점 조준', description: '10초간 모든 크리티컬 공격의 최종 데미지가 100%p 증가합니다.', cooldown: 45000 },
        bonuses: { clickDamage: 0, autoAttackDamage: 0, critChance: 10, critDamage: 50, skillEffect: 0 },
        icon: (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
    },
    MAGE: {
        name: '마법사',
        description: '강력한 스킬로 전장을 지배합니다.',
        passive: '스킬 데미지 +50%, 스킬 쿨타임 감소 효과 +25%',
        skill: { name: '신비한 폭발', description: '총 공격력의 15배 피해를 주고, 10초간 몬스터가 받는 모든 피해가 20% 증가합니다.' },
        skill2: { name: '마나 순환', description: "'신비한 폭발' 스킬의 쿨타임을 즉시 초기화하고, 가속 강화 비용의 10%만큼 골드를 즉시 획득합니다.", cooldown: 90000 },
        bonuses: { clickDamage: 0, autoAttackDamage: 0, critChance: 0, critDamage: 0, skillEffect: 0.5 },
        icon: (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-3.797z" /></svg>
    }
};

const MISSION_TYPES = {
    DEFEAT_MONSTERS: '몬스터 처치',
    DEFEAT_BOSSES: '보스 처치',
    UPGRADE_TIMES: '강화 시도',
    EARN_GOLD: '골드 획득',
};

// --- EQUIPMENT DATA ---
const EQUIPMENT_TYPES = {
    WEAPON: { name: '무기', icon: (props) => <SwordIcon {...props}/> },
    ARMOR: { name: '방어구', icon: (props) => <ArmorIcon {...props}/> },
    AMULET: { name: '장신구', icon: (props) => <AmuletIcon {...props}/> },
    HELMET: { name: '투구', icon: (props) => <HelmetIcon {...props}/> },
    GLOVES: { name: '장갑', icon: (props) => <GlovesIcon {...props}/> },
    BOOTS: { name: '신발', icon: (props) => <BootsIcon {...props}/> },
    RING: { name: '반지', icon: (props) => <RingIcon {...props}/> },
    CLOAK: { name: '망토', icon: (props) => <CloakIcon {...props}/> }
};

const RARITY_ORDER = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'];
const RARITIES = {
    COMMON: { name: '일반', textClass: 'text-rarity-COMMON', borderClass: 'border-rarity-COMMON', statMultiplier: 1 },
    UNCOMMON: { name: '고급', textClass: 'text-rarity-UNCOMMON', borderClass: 'border-rarity-UNCOMMON', statMultiplier: 1.6 },
    RARE: { name: '희귀', textClass: 'text-rarity-RARE', borderClass: 'border-rarity-RARE', statMultiplier: 2.8 },
    EPIC: { name: '영웅', textClass: 'text-rarity-EPIC', borderClass: 'border-rarity-EPIC', statMultiplier: 5 },
    LEGENDARY: { name: '전설', textClass: 'text-rarity-LEGENDARY', borderClass: 'border-rarity-LEGENDARY', statMultiplier: 8 },
    MYTHIC: { name: '신화', textClass: 'text-rarity-MYTHIC', borderClass: 'border-rarity-MYTHIC', statMultiplier: 15 }
};

// --- ICONS ---
const LevelIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /> </svg> );
const XPIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" /> </svg> );
const CoinIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 6v1m0-1c-1.11 0-2.08-.402-2.599-1M12 18c1.11 0 2.08-.402-2.599-1M8.999 12H8m8 0h-.001M12 21a9 9 0 110-18 9 9 0 010 18z" /> </svg> );
const SwordIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /> </svg> );
const DpsIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /> </svg> );
const CritIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block crit-icon" fill="currentColor" viewBox="0 0 24 24" {...props}> <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" /> </svg> );
const ArmorIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> </svg> );
const AmuletIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6.5-1.5l3.5 3.5M4 12H2m13.5 1.5L12 17l-3.5-3.5M12 8a4 4 0 100 8 4 4 0 000-8z" /> </svg> );
const GachaIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" /> </svg> );
const AttackSpeedIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );
const LuckIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );
const BossIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1.052A10.952 10.952 0 003.848 5.766L2 12l1.848 6.234A10.952 10.952 0 0012 22.948a10.952 10.952 0 008.152-4.714L22 12l-1.848-6.234A10.952 10.952 0 0012 1.052z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14s1.5-2 4-2 4 2 4 2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h.01M15 9h.01" /></svg> );
const HelmetIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> );
const GlovesIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.264-2.55-.724-3.682z" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /></svg> );
const BootsIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg> );
const RingIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 01-9-9 3 3 0 013-3h12a3 3 0 013 3 9 9 0 01-9 9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9a2 2 0 100-4 2 2 0 000 4z" /></svg> );
const CloakIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16V4H4zm8 4l-4 4h8l-4-4z" /></svg> );
const ArtifactIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H7.5A2.25 2.25 0 005.25 6.75v9.75a2.25 2.25 0 002.25 2.25z" /> </svg> );
const LockIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}> <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" /> </svg> );
const ElementIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-3.797z" /></svg> );
const OfflineIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );

// Monster Icons
// Fix: Add default value for className prop to make it optional.
const GreenSlimeIcon = ({className = '', ...props}) => ( <svg viewBox="0 0 100 80" className={`drop-shadow-lg ${className}`} {...props}> <path d="M 35 25 C 40 20, 50 20, 55 25" fill="rgba(255,255,255,0.5)" stroke="none"></path> <path d="M 50 80 C 10 80, 10 40, 10 40 C 10 10, 40 10, 50 10 C 60 10, 90 10, 90 40 C 90 40, 90 80, 50 80 Z" fill="#22c55e" stroke="#166534" strokeWidth="3"></path> <circle cx="28" cy="50" r="5" fill="#fecaca"></circle> <circle cx="72" cy="50" r="5" fill="#fecaca"></circle> <circle cx="38" cy="45" r="8" fill="white"></circle> <circle cx="62" cy="45" r="8" fill="white"></circle> <circle cx="40" cy="46" r="4" fill="black"></circle> <circle cx="64" cy="46" r="4" fill="black"></circle> <circle cx="37" cy="42" r="2" fill="white"></circle> <circle cx="61" cy="42" r="2" fill="white"></circle> <path d="M 45 60 Q 50 68, 55 60" stroke="black" fill="transparent" strokeWidth="2.5" strokeLinecap="round"></path> </svg> );
// Fix: Add default value for className prop to make it optional.
const RedSlimeIcon = ({className = '', ...props}) => ( <svg viewBox="0 0 100 80" className={`drop-shadow-lg ${className}`} {...props}> <path d="M 35 25 C 40 20, 50 20, 55 25" fill="rgba(255,255,255,0.5)" stroke="none"></path> <path d="M 50 80 C 10 80, 10 40, 10 40 C 10 10, 40 10, 50 10 C 60 10, 90 10, 90 40 C 90 40, 90 80, 50 80 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="3"></path> <circle cx="38" cy="45" r="7" fill="white"></circle> <circle cx="62" cy="45" r="7" fill="white"></circle> <circle cx="40" cy="47" r="3" fill="black"></circle> <circle cx="64" cy="47" r="3" fill="black"></circle> <path d="M 45 62 Q 50 55, 55 62" stroke="black" fill="transparent" strokeWidth="2.5" strokeLinecap="round"></path> </svg> );
// Fix: Add default value for className prop to make it optional.
const BlueSlimeIcon = ({className = '', ...props}) => ( <svg viewBox="0 0 100 80" className={`drop-shadow-lg ${className}`} {...props}> <path d="M 35 25 C 40 20, 50 20, 55 25" fill="rgba(255,255,255,0.5)" stroke="none"></path> <path d="M 50 80 C 10 80, 10 40, 10 40 C 10 10, 40 10, 50 10 C 60 10, 90 10, 90 40 C 90 40, 90 80, 50 80 Z" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="3"></path> <path d="M 32 40 C 35 45, 41 45, 44 40" stroke="white" fill="transparent" strokeWidth="3" strokeLinecap="round"></path> <path d="M 56 40 C 59 45, 65 45, 68 40" stroke="white" fill="transparent" strokeWidth="3" strokeLinecap="round"></path> <path d="M 45 60 Q 50 65, 55 60" stroke="black" fill="transparent" strokeWidth="2.5" strokeLinecap="round"></path> </svg> );
const GolemIcon = ({className = '', ...props}) => ( <svg viewBox="0 0 100 100" className={`drop-shadow-lg ${className}`} {...props}> <rect x="20" y="40" width="60" height="50" fill="#6b7280" stroke="#4b5563" strokeWidth="3" rx="5"></rect> <rect x="30" y="20" width="40" height="30" fill="#7f8c9b" stroke="#4b5563" strokeWidth="3" rx="5"></rect> <circle cx="45" cy="35" r="4" fill="#dc2626"></circle> <circle cx="55" cy="35" r="4" fill="#dc2626"></circle> <rect x="10" y="50" width="20" height="30" fill="#6b7280" stroke="#4b5563" strokeWidth="3" rx="5"></rect> <rect x="70" y="50" width="20" height="30" fill="#6b7280" stroke="#4b5563" strokeWidth="3" rx="5"></rect> </svg> );
const KingSlimeIcon = ({className = '', ...props}) => ( <svg viewBox="0 0 100 80" className={`drop-shadow-lg ${className}`} {...props}> <path d="M 25 20 L 30 5 L 50 15 L 70 5 L 75 20 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="2" strokeLinejoin="round"></path> <circle cx="30" cy="7" r="3" fill="#ef4444"></circle> <circle cx="50" cy="17" r="3" fill="#3b82f6"></circle> <circle cx="70" cy="7" r="3" fill="#22c55e"></circle> <path d="M 35 35 C 40 30, 50 30, 55 35" fill="rgba(255,255,255,0.5)" stroke="none"></path> <path d="M 50 80 C 10 80, 10 40, 10 40 C 10 20, 40 20, 50 20 C 60 20, 90 20, 90 40 C 90 40, 90 80, 50 80 Z" fill="#22c55e" stroke="#166534" strokeWidth="3"></path> <circle cx="28" cy="55" r="5" fill="#fecaca"></circle> <circle cx="72" cy="55" r="5" fill="#fecaca"></circle> <circle cx="38" cy="50" r="8" fill="white"></circle> <circle cx="62" cy="50" r="8" fill="white"></circle> <circle cx="40" cy="51" r="4" fill="black"></circle> <circle cx="64" cy="51" r="4" fill="black"></circle> <circle cx="37" cy="47" r="2" fill="white"></circle> <circle cx="61" cy="47" r="2" fill="white"></circle> <path d="M 45 65 Q 50 73, 55 65" stroke="black" fill="transparent" strokeWidth="2.5" strokeLinecap="round"></path> </svg> );
const DragonIcon = ({className = '', ...props}) => ( <svg viewBox="0 0 100 100" className={`drop-shadow-lg ${className}`} {...props}> <path d="M 50 10 C 20 40, 20 80, 50 90 C 80 80, 80 40, 50 10" fill="#b91c1c" stroke="#4a0404" strokeWidth="3"></path> <path d="M 40 20 C 30 30, 30 40, 40 50" fill="none" stroke="#fef2f2" strokeWidth="2"></path> <path d="M 60 20 C 70 30, 70 40, 60 50" fill="none" stroke="#fef2f2" strokeWidth="2"></path> <circle cx="45" cy="35" r="5" fill="#fef08a"></circle> <circle cx="55" cy="35" r="5" fill="#fef08a"></circle> <path d="M 45 70 Q 50 80, 55 70" stroke="white" strokeWidth="2" fill="none"></path> <path d="M 20 50 C 10 60, 10 70, 20 80" fill="#991b1b" stroke="#4a0404" strokeWidth="2"></path> <path d="M 80 50 C 90 60, 90 70, 80 80" fill="#991b1b" stroke="#4a0404" strokeWidth="2"></path> </svg> );
const TreasureGolemIcon = ({className = '', ...props}) => ( <svg viewBox="0 0 100 100" className={`drop-shadow-lg ${className}`} {...props}> <rect x="20" y="40" width="60" height="50" fill="#facc15" stroke="#ca8a04" strokeWidth="3" rx="5"></rect> <rect x="30" y="20" width="40" height="30" fill="#fde047" stroke="#ca8a04" strokeWidth="3" rx="5"></rect> <circle cx="45" cy="35" r="4" fill="#3b82f6"></circle> <circle cx="55" cy="35" r="4" fill="#3b82f6"></circle> <rect x="10" y="50" width="20" height="30" fill="#facc15" stroke="#ca8a04" strokeWidth="3" rx="5"></rect> <rect x="70" y="50" width="20" height="30" fill="#facc15" stroke="#ca8a04" strokeWidth="3" rx="5"></rect> <circle cx="50" cy="65" r="8" fill="#22c55e" stroke="#166534" strokeWidth="2"></circle> </svg> );

// --- MONSTER DATA ---
const MONSTER_TYPES = [
    { name: '초록 슬라임', Icon: GreenSlimeIcon, minLevel: 1 },
    { name: '빨간 슬라임', Icon: RedSlimeIcon, minLevel: 1 },
    { name: '파란 슬라임', Icon: BlueSlimeIcon, minLevel: 1 },
];
const BOSS_TYPES = [
    { name: '골렘', Icon: GolemIcon },
    { name: '킹 슬라임', Icon: KingSlimeIcon },
    { name: '드래곤', Icon: DragonIcon },
];
const SPECIAL_MONSTERS = {
    TREASURE_GOLEM: { name: '보물 골렘', Icon: TreasureGolemIcon, isSpecial: true }
};

// --- ARTIFACT DATA ---
const ARTIFACTS = [
    { id: 'berserkers_blood', name: '광전사의 피', description: '보스에게 주는 모든 피해 +25%', icon: BossIcon, effect: { type: 'BOSS_DAMAGE', value: 25 } },
    { id: 'swift_quiver', name: '신속의 화살통', description: '공격 속도 +10%', icon: AttackSpeedIcon, effect: { type: 'ATTACK_SPEED_MULT', value: 0.1 } },
    { id: 'mana_crystal', name: '마나 수정', description: '스킬 쿨타임 -15%', icon: DpsIcon, effect: { type: 'HASTE', value: 15 } },
    { id: 'lucky_clover', name: '행운의 클로버', description: '크리티컬 확률 +5%p', icon: LuckIcon, effect: { type: 'CRIT_CHANCE', value: 5 } },
    { id: 'executioners_edge', name: '처형인의 칼날', description: '크리티컬 데미지 +50%p', icon: CritIcon, effect: { type: 'CRIT_DAMAGE', value: 50 } },
    { id: 'golden_goblet', name: '황금 술잔', description: '골드 획득량 +20%', icon: CoinIcon, effect: { type: 'GOLD_GAIN', value: 20 } },
    { id: 'sages_stone', name: '현자의 돌', description: '경험치 획득량 +20%', icon: XPIcon, effect: { type: 'XP_GAIN', value: 20 } },
    { id: 'ancient_scope', name: '고대의 조준경', description: '클릭 데미지 +25%', icon: SwordIcon, effect: { type: 'CLICK_DAMAGE_MULT', value: 0.25 } },
];

// --- UTILS ---
const formatNumber = (num) => {
    const n = Math.floor(num);
    if (n < 1000) return n.toString();
    if (n < 1000000) return (n / 1000).toFixed(0) + 'K';
    if (n < 1000000000) return (n / 1000000).toFixed(0) + 'M';
    if (n < 1000000000000) return (n / 1000000000).toFixed(0) + 'B';
    return (n / 1000000000000).toFixed(0) + 'T';
};

const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [
        h > 0 ? `${h}시간` : '',
        m > 0 ? `${m}분` : '',
        s > 0 ? `${s}초` : ''
    ].filter(Boolean).join(' ');
};

const getEnhancedItemStats = (item) => {
    if (!item || !item.stats) return { clickDamage: 0, autoAttackDamage: 0, critChance: 0, critDamage: 0, attackSpeedBonus: 0, hasteBonus: 0, goldGainBonus: 0, xpGainBonus: 0, luckBonus: 0 };
    const itemLevel = item.level || 0;
    const multiplier = Math.pow(1.1, itemLevel);
    const bonusStatMultiplier = 1 + (itemLevel * 0.1);
    
    return {
        clickDamage: (item.stats.clickDamage || 0) * multiplier,
        autoAttackDamage: (item.stats.autoAttackDamage || 0) * multiplier,
        critChance: (item.stats.critChance || 0) + (itemLevel * 0.2),
        critDamage: (item.stats.critDamage || 0) + (itemLevel * 2),
        attackSpeedBonus: (item.stats.attackSpeedBonus || 0) * bonusStatMultiplier,
        hasteBonus: (item.stats.hasteBonus || 0) * bonusStatMultiplier,
        goldGainBonus: (item.stats.goldGainBonus || 0) * bonusStatMultiplier,
        xpGainBonus: (item.stats.xpGainBonus || 0) * bonusStatMultiplier,
        luckBonus: (item.stats.luckBonus || 0) * bonusStatMultiplier,
    };
};

const calculateItemStats = (baseLevel, rarityKey, typeKey) => {
    const rarity = RARITIES[rarityKey];
    const stats = { clickDamage: 0, autoAttackDamage: 0, critChance: 0, critDamage: 0, attackSpeedBonus: 0, hasteBonus: 0, goldGainBonus: 0, xpGainBonus: 0, luckBonus: 0 };
    const statBudget = baseLevel * rarity.statMultiplier;
    switch (typeKey) {
        case 'WEAPON': stats.clickDamage = Math.ceil(statBudget * (1 + Math.random() * 0.2)); break;
        case 'ARMOR': stats.autoAttackDamage = Math.ceil(statBudget * 0.6 * (1 + Math.random() * 0.2)); break;
        case 'AMULET':
            stats.critChance = parseFloat((statBudget * 0.1 * (1 + Math.random() * 0.1)).toFixed(1));
            stats.critDamage = Math.ceil(statBudget * 2 * (1 + Math.random() * 0.1));
            break;
        case 'HELMET': stats.xpGainBonus = Math.ceil(statBudget * 0.5); break;
        case 'GLOVES': stats.attackSpeedBonus = Math.ceil(statBudget * 0.15); break;
        case 'BOOTS': stats.hasteBonus = Math.ceil(statBudget * 0.15); break;
        case 'RING': stats.goldGainBonus = Math.ceil(statBudget * 0.4); stats.luckBonus = Math.ceil(statBudget * 0.1); break;
        case 'CLOAK': stats.hasteBonus += Math.ceil(statBudget * 0.1); stats.xpGainBonus += Math.ceil(statBudget * 0.4); break;
    }
    return stats;
}


// --- COMPONENTS ---
const PlayerStats = ({ stats, playerClass, onNameChange, abilityStats, liberationCount, rebirthCount, onJobChangeClick, difficulty, onDifficultyChangeClick, isAutoDropEnabled, onToggleAutoDrop, onReset }) => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-green-400">플레이어 정보</h2>
        <div className="flex justify-around mb-3 text-center">
             {liberationCount > 0 && ( <div className="font-bold text-yellow-300 text-lg border-2 border-yellow-400 bg-gray-700 p-2 rounded w-1/2 mr-1">해방 {liberationCount}</div> )}
             {rebirthCount > 0 && ( <div className="font-bold text-purple-400 text-lg border-2 border-purple-500 bg-gray-700 p-2 rounded w-1/2 ml-1">환생 {rebirthCount}</div> )}
        </div>
        <div className="space-y-2">
             <div className="flex justify-between items-center bg-gray-700 p-2 rounded">
                <span className="font-semibold">이름:</span>
                <input type="text" value={stats.playerName} onChange={(e) => onNameChange(e.target.value)} className="bg-gray-600 text-right font-bold text-lg rounded px-2 w-32" />
            </div>
            {playerClass && (
                <div className="flex justify-between items-center bg-gray-700 p-2 rounded">
                    <span className="font-semibold">직업:</span>
                    <button onClick={onJobChangeClick} className="font-bold text-lg text-amber-400 hover:text-amber-300 transition-colors" title="직업 변경">
                        {JOBS[playerClass].name} <span className="text-sm">🔄</span>
                    </button>
                </div>
            )}
            <div className="flex justify-between items-center bg-gray-700 p-2 rounded">
                <span className="font-semibold">난이도:</span>
                <button onClick={onDifficultyChangeClick} className="font-bold text-lg text-cyan-400 hover:text-cyan-300 transition-colors" title="난이도 변경">
                    {DIFFICULTIES[difficulty].name} <span className="text-sm">⚙️</span>
                </button>
            </div>
            <div className="flex justify-between items-center bg-gray-700 p-2 rounded">
                <span className="font-semibold">장비 자동 판매:</span>
                <button onClick={onToggleAutoDrop} className={`font-bold text-sm px-3 py-1 rounded-md transition-colors ${isAutoDropEnabled ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}>
                    {isAutoDropEnabled ? 'ON' : 'OFF'}
                </button>
            </div>
            <div className="flex justify-between items-center bg-gray-700 p-2 rounded text-sm"> <span className="font-semibold"><LevelIcon />레벨:</span> <span className="font-bold text-lg">{stats.level}</span> </div>
            <div className="bg-gray-700 p-2 rounded text-sm">
                <div className="flex justify-between items-center mb-1"> <span className="font-semibold"><XPIcon />경험치:</span> <span>{formatNumber(stats.xp)} / {formatNumber(stats.maxXp)}</span> </div>
                <div className="w-full bg-gray-600 rounded-full h-3"> <div className="bg-purple-500 h-3 rounded-full" style={{ width: `${(stats.xp / stats.maxXp) * 100}%` }}></div> </div>
            </div>
            <div className="flex justify-between items-center bg-gray-700 p-2 rounded text-sm"> <span className="font-semibold"><CoinIcon />골드:</span> <span className="font-bold text-lg text-yellow-400">{formatNumber(stats.coins)}</span> </div>
            <div className="flex justify-between items-center bg-gray-700 p-2 rounded text-sm"> <span className="font-semibold"><SwordIcon />클릭 데미지:</span> <span>{formatNumber(stats.clickDamage)}</span> </div>
            <div className="flex justify-between items-center bg-gray-700 p-2 rounded text-sm"> <span className="font-semibold"><DpsIcon />자동 공격 데미지:</span> <span>{formatNumber(stats.autoAttackDamage)}</span> </div>
            <div className="flex justify-between items-center bg-gray-700 p-2 rounded text-sm"> <span className="font-semibold"><AttackSpeedIcon />공격 속도:</span> <span>{stats.attackSpeed.toFixed(1)} / s</span> </div>
            <div className="flex justify-between items-center bg-gray-700 p-2 rounded text-sm"> <span className="font-semibold"><CritIcon />크리 확률:</span> <span>{Math.round(stats.critChance)}%</span> </div>
            <div className="flex justify-between items-center bg-gray-700 p-2 rounded text-sm"> <span className="font-semibold"><CritIcon />크리 데미지:</span> <span>{Math.round(stats.critDamage)}%</span> </div>
            <div className="flex justify-between items-center bg-gray-700 p-2 rounded text-sm"> <span className="font-semibold"><LuckIcon />행운:</span> <span>{stats.luck}</span> </div>
            <div className="flex justify-between items-center bg-gray-700 p-2 rounded text-xs"> <span className="font-semibold text-cyan-400"><CoinIcon />골드 보너스:</span> <span className="text-cyan-400">+{Math.round(abilityStats.goldGainBonus)}%</span> </div>
            <div className="flex justify-between items-center bg-gray-700 p-2 rounded text-xs"> <span className="font-semibold text-purple-400"><XPIcon />경험치 보너스:</span> <span className="text-purple-400">+{Math.round(abilityStats.xpGainBonus)}%</span> </div>
            <div className="flex justify-between items-center bg-gray-700 p-2 rounded text-xs"> <span className="font-semibold text-red-400"><BossIcon />보스 데미지:</span> <span className="text-red-400">+{Math.round(abilityStats.bossDamageBonus)}%</span> </div>
        </div>
        <button onClick={onReset} className="mt-4 w-full bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm shadow-lg">
            게임 초기화
        </button>
    </div>
);


const EquipmentTooltip = ({ item }) => {
    if (!item) return null;
    const rarityInfo = RARITIES[item.rarity];
    const typeInfo = EQUIPMENT_TYPES[item.type];
    const enhancedStats = getEnhancedItemStats(item);

    return (
        <div className="tooltiptext">
            <p className={`font-bold text-lg ${rarityInfo.textClass}`}>{item.name} {item.level > 0 ? `+${item.level}`: ''}</p>
            <p className="text-sm text-gray-400 mb-2"> <span className={rarityInfo.textClass}>[{rarityInfo.name}]</span> <span> {typeInfo.name}</span> </p>
            <hr className="border-gray-600 my-2" />
            <div className="space-y-1 text-sm">
                {enhancedStats.clickDamage > 0 && <p className="flex items-center"><SwordIcon className="h-4 w-4 mr-1.5" /> <span>클릭 데미지 +{formatNumber(enhancedStats.clickDamage)}</span></p>}
                {enhancedStats.autoAttackDamage > 0 && <p className="flex items-center"><DpsIcon className="h-4 w-4 mr-1.5" /> <span>자동 공격 +{formatNumber(enhancedStats.autoAttackDamage)}</span></p>}
                {enhancedStats.critChance > 0 && <p className="flex items-center"><CritIcon className="h-4 w-4 mr-1.5" /> <span>크리 확률 +{Math.round(enhancedStats.critChance)}%</span></p>}
                {enhancedStats.critDamage > 0 && <p className="flex items-center"><CritIcon className="h-4 w-4 mr-1.5" /> <span>크리 데미지 +{formatNumber(enhancedStats.critDamage)}%</span></p>}
                {enhancedStats.attackSpeedBonus > 0 && <p className="flex items-center"><AttackSpeedIcon className="h-4 w-4 mr-1.5" /> <span>공격 속도 +{Math.round(enhancedStats.attackSpeedBonus)}%</span></p>}
                {enhancedStats.hasteBonus > 0 && <p className="flex items-center"><DpsIcon className="h-4 w-4 mr-1.5" /> <span>가속 +{Math.round(enhancedStats.hasteBonus)}%</span></p>}
                {enhancedStats.goldGainBonus > 0 && <p className="flex items-center"><CoinIcon className="h-4 w-4 mr-1.5" /> <span>골드 획득 +{Math.round(enhancedStats.goldGainBonus)}%</span></p>}
                {enhancedStats.xpGainBonus > 0 && <p className="flex items-center"><XPIcon className="h-4 w-4 mr-1.5" /> <span>경험치 획득 +{Math.round(enhancedStats.xpGainBonus)}%</span></p>}
                {enhancedStats.luckBonus > 0 && <p className="flex items-center"><LuckIcon className="h-4 w-4 mr-1.5" /> <span>행운 +{Math.round(enhancedStats.luckBonus)}</span></p>}
            </div>
            {item.locked && <p className="mt-2 text-yellow-400 font-bold flex items-center"><LockIcon className="w-4 h-4 mr-1"/> 잠금 상태</p>}
        </div>
    );
};

const EquipmentSlot = ({ item, type, onClick }) => {
    const IconComponent = EQUIPMENT_TYPES[type].icon;
    const rarityInfo = item ? RARITIES[item.rarity] : null;

    return (
        <div className="tooltip" onClick={onClick}>
             <div className={`bg-gray-700 p-2 rounded h-16 flex items-center border-2 ${item ? `${rarityInfo.borderClass} cursor-pointer hover:bg-gray-600` : 'border-gray-600'}`}>
                <IconComponent className="h-8 w-8 text-gray-400 mr-2" />
                {item ? ( <div> <p className={`font-semibold text-sm ${rarityInfo.textClass}`}>{item.name} {item.level > 0 ? `+${item.level}` : ''}</p> <p className="text-xs text-gray-400">{rarityInfo.name}</p> </div> ) : ( <p className="text-gray-500">비어있음</p> )}
            </div>
            <EquipmentTooltip item={item} />
        </div>
    );
};


const EquipmentPanel = ({ equipment, onSelectItem }) => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-green-400">장비</h2>
        <div className="grid grid-cols-2 gap-2">
            <EquipmentSlot item={equipment.weapon} type="WEAPON" onClick={() => onSelectItem(equipment.weapon)} />
            <EquipmentSlot item={equipment.helmet} type="HELMET" onClick={() => onSelectItem(equipment.helmet)} />
            <EquipmentSlot item={equipment.armor} type="ARMOR" onClick={() => onSelectItem(equipment.armor)} />
            <EquipmentSlot item={equipment.gloves} type="GLOVES" onClick={() => onSelectItem(equipment.gloves)} />
            <EquipmentSlot item={equipment.amulet} type="AMULET" onClick={() => onSelectItem(equipment.amulet)} />
            <EquipmentSlot item={equipment.boots} type="BOOTS" onClick={() => onSelectItem(equipment.boots)} />
            <EquipmentSlot item={equipment.ring} type="RING" onClick={() => onSelectItem(equipment.ring)} />
            <EquipmentSlot item={equipment.cloak} type="CLOAK" onClick={() => onSelectItem(equipment.cloak)} />
        </div>
    </div>
);

const ElementPanel = ({ playerElement, onOpenModal }) => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-green-400 flex items-center"><ElementIcon className="w-6 h-6 mr-2" /> 원소</h2>
        <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
            {playerElement ? (
                <div className="flex items-center gap-3">
                    {React.createElement(ELEMENT_TYPES[playerElement].icon, { className: 'h-10 w-10' })}
                    <span className="text-xl font-bold">{ELEMENT_TYPES[playerElement].name}</span>
                </div>
            ) : (
                <span className="text-gray-400">원소를 선택하세요</span>
            )}
            <button onClick={onOpenModal} className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-md transition-colors">변경</button>
        </div>
    </div>
);

const EquippedArtifactsPanel = ({ equipped, onSlotClick }) => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-green-400 flex items-center"><ArtifactIcon className="w-6 h-6 mr-2" /> 유물</h2>
        <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map(index => {
                const artifactId = equipped[index];
                const artifact = artifactId ? ARTIFACTS.find(a => a.id === artifactId) : null;
                const tooltipText = artifact ? `${artifact.name}: ${artifact.description}` : "비어있는 유물 슬롯입니다. 오른쪽 '유물' 탭에서 장착할 수 있습니다.";
                
                return (
                    <div key={index} onClick={onSlotClick} className="tooltip">
                        <div className={`aspect-square flex items-center justify-center p-1 border-2 rounded-md cursor-pointer hover:bg-gray-700 transition-colors ${artifact ? 'border-yellow-400 bg-gray-800' : 'border-gray-600 bg-gray-700'}`}>
                            {artifact ? <artifact.icon className="h-8 w-8 text-yellow-400" /> : <span className="text-gray-500 text-3xl font-bold">?</span>}
                        </div>
                        <span className="tooltiptext">{tooltipText}</span>
                    </div>
                );
            })}
        </div>
    </div>
);

const MonsterDisplay = ({ monster, onClick, damagePopups, treasureGolem, children }) => {
    const MonsterIcon = monster.Icon;
    const isTreasureGolem = treasureGolem.isActive;
    const ElementInfo = monster.element ? ELEMENT_TYPES[monster.element] : null;

    return (
        <div className="transition-transform duration-100 flex flex-col items-center">
             <h2 className={`text-3xl font-bold text-center mb-2 flex items-center justify-center gap-2 ${monster.isBoss ? 'text-red-400' : ''} ${isTreasureGolem ? 'text-yellow-400' : ''}`}>
                {ElementInfo && React.createElement(ElementInfo.icon, { className: 'h-8 w-8' })}
                <span>{monster.isBoss ? `[BOSS] ${monster.name}` : monster.name} (Lv.{monster.level})</span>
            </h2>
            {isTreasureGolem && <p className="text-center text-2xl font-bold text-yellow-300 mb-2">남은 시간: {treasureGolem.timer}초</p>}
            <div className={`w-full max-w-md bg-gray-700 rounded-full h-6 mb-2 border-2 ${monster.isBoss ? 'border-red-400' : 'border-gray-600'}`}>
                <div className="bg-red-500 h-full rounded-full transition-width duration-300" style={{ width: `${(monster.hp / monster.maxHp) * 100}%` }}> </div>
            </div>
            <p className="text-center font-bold text-lg mb-4"> {formatNumber(monster.hp)} / {formatNumber(monster.maxHp)} </p>
            <div className="relative cursor-pointer" onClick={onClick} style={{ userSelect: 'none' }}>
                <MonsterIcon className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 mx-auto" />
                {damagePopups.map(popup => (
                    <div key={popup.id}
                         className={`absolute font-bold text-2xl pointer-events-none 
                            ${popup.type === 'skill' ? 'text-orange-400 animate-damage-popup-skill' : ''}
                            ${popup.type === 'normal' ? 'text-yellow-300 animate-damage-popup' : ''}
                            ${popup.type === 'crit' ? 'text-yellow-200 animate-damage-popup-crit' : ''}
                            ${popup.type === 'elemental' ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 animate-damage-popup-elemental' : ''}
                            ${popup.type === 'resist' ? 'text-gray-400 animate-damage-popup-resist' : ''}
                         `}
                         style={{ left: `${popup.x}%`, top: `${popup.y}%` }}>
                        {popup.prefix}{formatNumber(popup.damage)}
                    </div>
                ))}
            </div>
            {children}
        </div>
    );
};

const UpgradePanel = ({ upgrades, playerCoins, handlers, abilityStats, equipmentGachaCost }) => (
    <div>
        <h3 className="text-lg font-semibold mb-2 text-green-300">전투 능력</h3>
        <div className="space-y-2">
            <div className="tooltip w-full">
                <button onClick={handlers.onUpgradeClick} disabled={playerCoins < upgrades.clickUpgradeCost} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg shadow-md text-sm transition-all duration-200">
                    검 강화 (+{upgrades.clickUpgradeLevel}) | <CoinIcon className="inline-block h-4 w-4 -mt-1" /> {formatNumber(upgrades.clickUpgradeCost)}
                </button>
                 <span className="tooltiptext"> <p className="font-bold">클릭 데미지 증가</p> <p className="text-sm text-gray-300">클릭당 공격력을 높여 몬스터를 더 빠르게 처치합니다.</p> </span>
            </div>
             <div className="tooltip w-full">
                <button onClick={handlers.onUpgradeAutoAttack} disabled={playerCoins < upgrades.autoAttackUpgradeCost} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg shadow-md text-sm transition-all duration-200">
                    자동 공격 강화 (+{upgrades.autoAttackUpgradeLevel}) | <CoinIcon className="inline-block h-4 w-4 -mt-1" /> {formatNumber(upgrades.autoAttackUpgradeCost)}
                </button>
                <span className="tooltiptext"> <p className="font-bold">자동 공격 데미지 증가</p> <p className="text-sm text-gray-300