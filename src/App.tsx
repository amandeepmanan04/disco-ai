import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Icons (inline SVG helpers) ──────────────────────────────────────────────
type IconProps = {
  d: string | string[];
  size?: number;
  className?: string;
  strokeWidth?: number;
};
const Icon = ({ d, size = 16, className = "", strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const Icons = {
  BookOpen: () => <Icon d={["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z","M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]} />,
  Dashboard: () => <Icon d={["M3 3h7v7H3z","M14 3h7v7h-7z","M14 14h7v7h-7z","M3 14h7v7H3z"]} />,
  GraduationCap: () => <Icon d={["M22 10v6M2 10l10-5 10 5-10 5z","M6 12v5c3 3 9 3 12 0v-5"]} />,
  Clock: () => <><Icon d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /><Icon d="M12 6v6l4 2" /></>,
  CheckCircle: () => <Icon d={["M22 11.08V12a10 10 0 1 1-5.93-9.14","M22 4 12 14.01l-3-3"]} />,
  XCircle: () => <Icon d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M15 9l-6 6","M9 9l6 6"]} />,
  ArrowRight: () => <Icon d={["M5 12h14","M12 5l7 7-7 7"]} />,
  Star: () => <Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />,
  Flame: () => <Icon d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />,
  Trophy: () => <Icon d={["M6 9H4.5a2.5 2.5 0 0 1 0-5H6","M18 9h1.5a2.5 2.5 0 0 0 0-5H18","M4 22h16","M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22","M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22","M18 2H6v7a6 6 0 0 0 12 0V2z"]} />,
  Zap: () => <Icon d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  Palette: () => <Icon d="M12 2a10 10 0 0 1 10 10 3.33 3.33 0 0 1-3.33 3.33c-.92 0-1.76-.38-2.37-1A3.33 3.33 0 0 0 13 13.17a3.33 3.33 0 0 1-3.33 3.33A7.83 7.83 0 0 1 2 8.5 6.5 6.5 0 0 1 8.5 2h3.5z" />,
  Lock: () => <Icon d={["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z","M7 11V7a5 5 0 0 1 10 0v4"]} />,
  AlertTriangle: () => <Icon d={["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z","M12 9v4","M12 17h.01"]} />,
  Users: () => <Icon d={["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2","M23 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 0 1 0 7.75","M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"]} />,
  BarChart: () => <Icon d={["M12 20V10","M18 20V4","M6 20v-4"]} />,
  TrendingUp: () => <Icon d={["M23 6l-9.5 9.5-5-5L1 18","M17 6h6v6"]} />,
};

// ── Mock Data ────────────────────────────────────────────────────────────────
const modules = [
  { id: "m1", title: "Our Mission, Vision & Values", description: "Understand what we stand for and how it guides every customer interaction", domain: "Culture", duration: "10 min", completed: true, score: 85, totalQuestions: 4 },
  { id: "m2", title: "Store Policies & House Rules", description: "Key policies on returns, exchanges, dress code, and conduct standards", domain: "Policies", duration: "12 min", completed: true, score: 60, totalQuestions: 4 },
  { id: "m3", title: "Customer Service Essentials", description: "Building rapport, active listening, and creating memorable experiences", domain: "Service", duration: "10 min", completed: false, score: null, totalQuestions: 4 },
  { id: "m4", title: "Handling Difficult Customers", description: "De-escalation techniques and staying composed under pressure", domain: "Adaptability", duration: "12 min", completed: false, score: null, totalQuestions: 4 },
  { id: "m5", title: "Upselling & Cross-Selling with Care", description: "Recommending products authentically without being pushy", domain: "Sales", duration: "8 min", completed: false, score: null, totalQuestions: 4 },
];

const comprehensionQuestions = [
  { id: "q1", moduleId: "m1", scenario: "A customer asks why your prices are slightly higher than a competitor across the street.", question: "How should you respond in a way that reflects our company values?", options: ["Tell them they're free to shop elsewhere", "Explain the quality and service experience that sets us apart, aligned with our mission", "Offer to match the price immediately", "Ignore the comment and move on"], correctIndex: 1, timeLimit: 30 },
  { id: "q2", moduleId: "m1", scenario: "During a team meeting, a colleague suggests cutting corners on packaging to save time during a rush.", question: "What should you do based on our company vision?", options: ["Agree since speed matters most", "Stay quiet to avoid conflict", "Respectfully explain that our brand promise includes attention to detail and quality", "Report them to management immediately"], correctIndex: 2, timeLimit: 30 },
  { id: "q3", moduleId: "m1", scenario: "A new hire asks you what makes working here different from other retail jobs.", question: "Which response best reflects our mission and culture?", options: ["The pay is decent and the hours are flexible", "We focus on building genuine relationships with customers, not just transactions", "It's pretty much the same as everywhere else", "You'll figure it out after a few weeks"], correctIndex: 1, timeLimit: 30 },
  { id: "q4", moduleId: "m1", scenario: "You notice a display area is messy during a slow period and no manager is watching.", question: "What does living our values look like in this moment?", options: ["Wait for someone to ask you to clean it", "It's not your section, so leave it", "Take initiative and tidy it up because presentation reflects our brand", "Post about it in the group chat"], correctIndex: 2, timeLimit: 25 },
  { id: "q5", moduleId: "m2", scenario: "A customer wants to return a product they bought 45 days ago. Your policy allows returns within 30 days.", question: "What is the correct approach?", options: ["Accept the return anyway to keep them happy", "Politely explain the 30-day policy, empathize, and offer alternatives like store credit or exchange", "Tell them they're too late and there's nothing you can do", "Call your manager for every return request"], correctIndex: 1, timeLimit: 30 },
  { id: "q6", moduleId: "m2", scenario: "You see a coworker using their phone on the sales floor during business hours.", question: "What should you do?", options: ["Ignore it—it's not your business", "Take a photo as evidence", "Kindly remind them of the policy in private", "Report them to HR immediately"], correctIndex: 2, timeLimit: 25 },
  { id: "q7", moduleId: "m2", scenario: "A customer insists on getting a cash refund, but company policy only allows refunds to the original payment method.", question: "How should you handle this?", options: ["Give them cash to avoid a scene", "Explain the policy clearly, apologize for the inconvenience, and process the correct refund", "Tell them to call corporate", "Say you don't handle refunds"], correctIndex: 1, timeLimit: 30 },
  { id: "q8", moduleId: "m2", scenario: "It's 5 minutes before closing and a customer walks in wanting to browse.", question: "According to our house rules, what should you do?", options: ["Tell them you're closing and they need to leave", "Let them in but follow them around to hurry them up", "Welcome them warmly and let them know closing time, offering to help them find what they need quickly", "Lock the door so no one else enters"], correctIndex: 2, timeLimit: 25 },
  { id: "q9", moduleId: "m3", scenario: "A customer seems hesitant and keeps looking around the store without picking anything up.", question: "What is the best way to approach them?", options: ["Leave them alone—they'll ask if they need help", "Walk up with a warm greeting and ask if they're looking for something specific", "Watch them from a distance in case they shoplift", "Immediately start recommending your top sellers"], correctIndex: 1, timeLimit: 25 },
  { id: "q10", moduleId: "m3", scenario: "A customer is explaining a problem with a product but keeps going off on tangents about their day.", question: "What demonstrates active listening?", options: ["Interrupt them to get to the point", "Nod along but mentally check out", "Listen patiently, acknowledge what they're saying, then gently guide back to the issue", "Tell them you only have a few minutes"], correctIndex: 2, timeLimit: 30 },
  { id: "q11", moduleId: "m3", scenario: "A customer thanks you for great service and says they'll definitely come back.", question: "What's the best way to close the interaction?", options: ["Say 'no problem' and move to the next customer", "Thank them sincerely, use their name if you know it, and invite them back warmly", "Hand them a business card", "Ask them to leave a review online"], correctIndex: 1, timeLimit: 25 },
  { id: "q12", moduleId: "m3", scenario: "You don't know the answer to a customer's technical question about a product.", question: "What should you do?", options: ["Make up an answer so you seem knowledgeable", "Tell them to Google it", "Be honest, let them know you'll find out, and follow up with the correct info", "Redirect them to a competitor who might know"], correctIndex: 2, timeLimit: 25 },
  { id: "q13", moduleId: "m4", scenario: "A customer is yelling about a billing error and demands to speak to a supervisor immediately.", question: "What is the best first step?", options: ["Transfer them to a supervisor right away", "Acknowledge their frustration and calmly ask to understand the issue first", "Put them on hold to check the billing system", "Tell them yelling won't solve anything"], correctIndex: 1, timeLimit: 25 },
  { id: "q14", moduleId: "m4", scenario: "A customer threatens to post a negative review unless you give them a full refund outside of policy.", question: "How should you respond?", options: ["Give the refund to avoid bad publicity", "Empathize and explain what options are available within policy", "Tell them that's not your problem", "Ignore the threat and proceed normally"], correctIndex: 1, timeLimit: 25 },
  { id: "q15", moduleId: "m4", scenario: "A customer becomes increasingly aggressive and starts using profanity directed at you.", question: "What should you do?", options: ["Hang up or walk away immediately", "Calmly set a boundary: 'I want to help you, but I need us to keep this respectful'", "Match their tone to show you take it seriously", "Stay completely silent until they calm down"], correctIndex: 1, timeLimit: 25 },
  { id: "q16", moduleId: "m4", scenario: "A customer has been waiting 20 minutes due to a system outage and is visibly frustrated.", question: "What approach shows the best adaptability?", options: ["Tell them it's a system issue and there's nothing you can do", "Apologize sincerely, keep them updated on timing, and offer a small gesture of goodwill", "Avoid eye contact and hope they leave", "Blame the IT team and commiserate with them"], correctIndex: 1, timeLimit: 30 },
  { id: "q17", moduleId: "m5", scenario: "A customer is buying a phone case. You know there's a matching screen protector on sale.", question: "What's the best way to suggest it?", options: ["Say 'You need a screen protector too' and add it to their purchase", "Mention the screen protector, explain how it complements their case, and let them decide", "Don't mention it—they didn't ask", "Tell them they'd be foolish not to buy it at this price"], correctIndex: 1, timeLimit: 25 },
  { id: "q18", moduleId: "m5", scenario: "A customer says they're on a tight budget and just want the basics.", question: "How should you handle upselling in this situation?", options: ["Push the premium version anyway—they might change their mind", "Respect their budget, help them find the best value, and skip the upsell", "Tell them they get what they pay for", "Offer financing options they didn't ask about"], correctIndex: 1, timeLimit: 25 },
  { id: "q19", moduleId: "m5", scenario: "A customer is buying a gift and seems unsure about what else to add.", question: "What's an authentic way to cross-sell?", options: ["Load their cart with add-ons while they're indecisive", "Ask who the gift is for and suggest thoughtful pairings based on their answer", "Show them the most expensive options first", "Tell them most people buy these extras"], correctIndex: 1, timeLimit: 25 },
  { id: "q20", moduleId: "m5", scenario: "A customer declines your product recommendation and says they're not interested.", question: "What should you do?", options: ["Keep pushing—they might give in", "Accept their decision gracefully, thank them, and continue with their original purchase", "Act disappointed so they feel bad", "Ask why they don't want it"], correctIndex: 1, timeLimit: 25 },
];

const learners = [
  { id: "l1", name: "Sarah Chen", avatar: "SC", completedModules: 4, totalModules: 5, avgAccuracy: 88, avgResponseTime: 14.2, atRisk: false, lastActive: "2 hours ago" },
  { id: "l2", name: "Marcus Johnson", avatar: "MJ", completedModules: 2, totalModules: 5, avgAccuracy: 52, avgResponseTime: 28.1, atRisk: true, lastActive: "3 days ago" },
  { id: "l3", name: "Priya Patel", avatar: "PP", completedModules: 5, totalModules: 5, avgAccuracy: 95, avgResponseTime: 11.5, atRisk: false, lastActive: "1 hour ago" },
  { id: "l4", name: "James O'Brien", avatar: "JO", completedModules: 1, totalModules: 5, avgAccuracy: 40, avgResponseTime: 29.8, atRisk: true, lastActive: "5 days ago" },
  { id: "l5", name: "Aisha Rahman", avatar: "AR", completedModules: 3, totalModules: 5, avgAccuracy: 74, avgResponseTime: 18.3, atRisk: false, lastActive: "6 hours ago" },
  { id: "l6", name: "Tom Wilson", avatar: "TW", completedModules: 2, totalModules: 5, avgAccuracy: 48, avgResponseTime: 26.4, atRisk: true, lastActive: "4 days ago" },
  { id: "l7", name: "Elena Kowalski", avatar: "EK", completedModules: 4, totalModules: 5, avgAccuracy: 82, avgResponseTime: 15.7, atRisk: false, lastActive: "30 min ago" },
  { id: "l8", name: "David Kim", avatar: "DK", completedModules: 3, totalModules: 5, avgAccuracy: 68, avgResponseTime: 20.1, atRisk: false, lastActive: "1 day ago" },
];

const leaderboardData = [
  { id: "l3", name: "Priya Patel",     avatar: "PP", color: "flame",  completedModules: 5, avgAccuracy: 95, streak: 12, lastActive: "1 hour ago" },
  { id: "l1", name: "Sarah Chen",      avatar: "SC", color: "ocean",  completedModules: 4, avgAccuracy: 88, streak: 7,  lastActive: "2 hours ago" },
  { id: "l7", name: "Elena Kowalski",  avatar: "EK", color: "mystic", completedModules: 4, avgAccuracy: 82, streak: 5,  lastActive: "30 min ago" },
  { id: "l8", name: "David Kim",       avatar: "DK", color: "forest", completedModules: 3, avgAccuracy: 68, streak: 3,  lastActive: "1 day ago" },
  { id: "l5", name: "Aisha Rahman",    avatar: "AR", color: "flame",  completedModules: 3, avgAccuracy: 74, streak: 2,  lastActive: "6 hours ago" },
  { id: "l2", name: "Marcus Johnson",  avatar: "MJ", color: "ocean",  completedModules: 2, avgAccuracy: 52, streak: 1,  lastActive: "3 days ago" },
  { id: "l6", name: "Tom Wilson",      avatar: "TW", color: "mystic", completedModules: 2, avgAccuracy: 48, streak: 0,  lastActive: "4 days ago" },
  { id: "l4", name: "James O'Brien",   avatar: "JO", color: "forest", completedModules: 1, avgAccuracy: 40, streak: 0,  lastActive: "5 days ago" },
];

const moduleFriction = [
  { moduleId: "m4", moduleName: "Handling Difficult Customers", avgAccuracy: 54, avgTime: 26.3, attempts: 42, failRate: 46 },
  { moduleId: "m2", moduleName: "Store Policies & House Rules", avgAccuracy: 61, avgTime: 23.1, attempts: 38, failRate: 39 },
  { moduleId: "m5", moduleName: "Upselling & Cross-Selling with Care", avgAccuracy: 67, avgTime: 21.8, attempts: 35, failRate: 33 },
  { moduleId: "m3", moduleName: "Customer Service Essentials", avgAccuracy: 78, avgTime: 17.2, attempts: 40, failRate: 22 },
  { moduleId: "m1", moduleName: "Our Mission, Vision & Values", avgAccuracy: 82, avgTime: 15.4, attempts: 48, failRate: 18 },
];

// ── Color Palettes ───────────────────────────────────────────────────────────
const colorPalettes = {
  flame: { name: "Blitz", body: "#F97316", accent: "#EF4444", glow: "#FDE68A", bg: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(239,68,68,0.10))", eye: "#1C1917" },
  ocean: { name: "Aqua", body: "#3B82F6", accent: "#06B6D4", glow: "#BAE6FD", bg: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(6,182,212,0.10))", eye: "#0C1425" },
  forest: { name: "Sprout", body: "#22C55E", accent: "#10B981", glow: "#D9F99D", bg: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.10))", eye: "#0A1F0D" },
  mystic: { name: "Luna", body: "#A855F7", accent: "#EC4899", glow: "#F0ABFC", bg: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.10))", eye: "#1A0A2E" },
};

const stageInfo = [
  { label: "Spark", subtitle: "A tiny spark of knowledge!" },
  { label: "Ember", subtitle: "Starting to glow!" },
  { label: "Blaze", subtitle: "Growing stronger!" },
  { label: "Inferno", subtitle: "Power unleashed!" },
  { label: "Mythic", subtitle: "Legendary status!" },
];

const getMascotStage = (correct: number) => {
  if (correct >= 16) return 4;
  if (correct >= 10) return 3;
  if (correct >= 5) return 2;
  if (correct >= 2) return 1;
  return 0;
};

// ── Creature SVG ─────────────────────────────────────────────────────────────
// Replace your CreatureSVG component with this one
// The creature grows bigger with each stage but keeps the cute otter style

const CreatureSVG = ({ stage, palette }: { stage: number; palette: typeof colorPalettes.flame }) => {
  const { body, accent, glow, eye } = palette;
  const size = 90 + stage * 12;

  // Derived soft colors
  const belly = glow;
  const cheek = "#FF8AB5";
  const earInner = glow;

  return (
    <svg viewBox="0 0 120 160" width={size} height={size} style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}>

      {/* ── Stage 0: Tiny baby blob ── */}
      {stage === 0 && (
        <g>
          {/* body */}
           <polygon points="44,72 38,56 54,68" fill={body} />
          <polygon points="76,72 82,56 66,68" fill={body} />
          {/* belly */}
          <ellipse cx="60" cy="108" rx="22" ry="18" fill={belly} opacity="0.5" />
          {/* ears */}
          <polygon points="44,72 40,60 52,70" fill={earInner} opacity="0.5" />
          <polygon points="76,72 80,60 68,70" fill={earInner} opacity="0.5" />
          {/* eyes */}
          <ellipse cx="48" cy="90" rx="10" ry="11" fill="white" />
          <ellipse cx="72" cy="90" rx="10" ry="11" fill="white" />
          <ellipse cx="49" cy="92" rx="6.5" ry="7" fill={eye} />
          <ellipse cx="73" cy="92" rx="6.5" ry="7" fill={eye} />
          <circle cx="52" cy="89" r="2.8" fill="white" />
          <circle cx="76" cy="89" r="2.8" fill="white" />
          <circle cx="47" cy="95" r="1.2" fill="white" />
          <circle cx="71" cy="95" r="1.2" fill="white" />
          {/* cheeks */}
          <ellipse cx="36" cy="100" rx="8" ry="5" fill={cheek} opacity="0.4" />
          <ellipse cx="84" cy="100" rx="8" ry="5" fill={cheek} opacity="0.4" />
          {/* nose */}
          <ellipse cx="60" cy="100" rx="4" ry="3" fill={accent} />
          {/* mouth */}
          <path d="M54 107 Q60 114 66 107" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* tiny feet */}
          <ellipse cx="46" cy="128" rx="13" ry="7" fill={accent} />
          <ellipse cx="74" cy="128" rx="13" ry="7" fill={accent} />
        </g>
      )}

      {/* ── Stage 1: Baby with stubby arms ── */}
      {stage === 1 && (
        <g>
          {/* tail */}
          <path d="M92 112 Q112 98 108 80 Q105 88 100 85 Q104 98 94 108" fill={accent} />
          {/* body */}
         <polygon points="42,72 36,54 54,68" fill={body} />
        <polygon points="78,72 84,54 66,68" fill={body} />
          {/* belly */}
          <ellipse cx="60" cy="108" rx="25" ry="20" fill={belly} opacity="0.55" />
          {/* ears */}
         <polygon points="42,72 39,58 52,70" fill={earInner} opacity="0.5" />
         <polygon points="78,72 81,58 68,70" fill={earInner} opacity="0.5" />
          {/* stubby arms */}
          <ellipse cx="22" cy="104" rx="10" ry="8" fill={body} transform="rotate(25 22 104)" />
          <ellipse cx="98" cy="104" rx="10" ry="8" fill={body} transform="rotate(-25 98 104)" />
          {/* eyes */}
          <ellipse cx="46" cy="88" rx="11" ry="12" fill="white" />
          <ellipse cx="74" cy="88" rx="11" ry="12" fill="white" />
          <ellipse cx="47" cy="90" rx="7" ry="8" fill={eye} />
          <ellipse cx="75" cy="90" rx="7" ry="8" fill={eye} />
          <circle cx="51" cy="87" r="3" fill="white" />
          <circle cx="79" cy="87" r="3" fill="white" />
          <circle cx="45" cy="93" r="1.3" fill="white" />
          <circle cx="73" cy="93" r="1.3" fill="white" />
          {/* cheeks */}
          <ellipse cx="32" cy="98" rx="9" ry="5.5" fill={cheek} opacity="0.4" />
          <ellipse cx="88" cy="98" rx="9" ry="5.5" fill={cheek} opacity="0.4" />
          {/* nose */}
          <ellipse cx="60" cy="98" rx="4.5" ry="3.2" fill={accent} />
          {/* mouth - happy */}
          <path d="M53 106 Q60 115 67 106" stroke={accent} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {/* feet */}
          <ellipse cx="44" cy="130" rx="16" ry="8" fill={accent} />
          <ellipse cx="76" cy="130" rx="16" ry="8" fill={accent} />
        </g>
      )}

      {/* ── Stage 2: Chubby with longer arms ── */}
      {stage === 2 && (
        <g>
          {/* tail */}
          <path d="M96 110 Q118 94 114 72 Q110 82 104 78 Q108 94 98 106" fill={accent} />
          <circle cx="114" cy="70" r="5" fill={glow} opacity="0.7" />
          {/* body */}
          <ellipse cx="60" cy="94" rx="42" ry="40" fill={body} />
          {/* belly */}
          <ellipse cx="60" cy="108" rx="28" ry="23" fill={belly} opacity="0.55" />
          {/* ears - pointy cat-like */}
          <polygon points="26,58 18,36 40,52" fill={body} />
          <polygon points="94,58 102,36 80,52" fill={body} />
          <polygon points="26,58 22,42 38,54" fill={earInner} opacity="0.5" />
          <polygon points="94,58 98,42 82,54" fill={earInner} opacity="0.5" />
          {/* arms */}
          <ellipse cx="18" cy="102" rx="12" ry="9" fill={body} transform="rotate(20 18 102)" />
          <ellipse cx="102" cy="102" rx="12" ry="9" fill={body} transform="rotate(-20 102 102)" />
          {/* eyes - wide happy */}
          <ellipse cx="44" cy="86" rx="12" ry="13" fill="white" />
          <ellipse cx="76" cy="86" rx="12" ry="13" fill="white" />
          <ellipse cx="45" cy="88" rx="8" ry="9" fill={eye} />
          <ellipse cx="77" cy="88" rx="8" ry="9" fill={eye} />
          <circle cx="50" cy="84" r="3.5" fill="white" />
          <circle cx="82" cy="84" r="3.5" fill="white" />
          <circle cx="43" cy="92" r="1.5" fill="white" />
          <circle cx="75" cy="92" r="1.5" fill="white" />
          {/* cheeks */}
          <ellipse cx="29" cy="96" rx="10" ry="6" fill={cheek} opacity="0.42" />
          <ellipse cx="91" cy="96" rx="10" ry="6" fill={cheek} opacity="0.42" />
          {/* nose */}
          <ellipse cx="60" cy="97" rx="5" ry="3.5" fill={accent} />
          {/* big smile */}
          <path d="M51 106 Q60 118 69 106" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* feet */}
          <ellipse cx="42" cy="132" rx="18" ry="9" fill={accent} />
          <ellipse cx="78" cy="132" rx="18" ry="9" fill={accent} />
        </g>
      )}

      {/* ── Stage 3: Powerful with wings ── */}
      {stage === 3 && (
        <g>
          {/* wings */}
          <path d="M20 88 Q2 62 12 44 Q18 60 28 54 Q14 70 22 82" fill={accent} opacity="0.75" />
          <path d="M100 88 Q118 62 108 44 Q102 60 92 54 Q106 70 98 82" fill={accent} opacity="0.75" />
          {/* tail */}
          <path d="M96 112 Q120 94 116 70 Q112 82 106 78 Q110 94 100 108" fill={accent} />
          <circle cx="116" cy="68" r="6" fill={glow} opacity="0.8" />
          {/* body */}
          <ellipse cx="60" cy="94" rx="42" ry="40" fill={body} />
          <ellipse cx="60" cy="108" rx="28" ry="23" fill={belly} opacity="0.5" />
          {/* crown nubs */}
          <polygon points="44,52 38,32 52,48" fill={glow} />
          <polygon points="76,52 82,32 68,48" fill={glow} />
          {/* cat ears */}
          <polygon points="26,60 18,38 40,54" fill={body} />
          <polygon points="94,60 102,38 80,54" fill={body} />
          <polygon points="26,60 22,44 38,56" fill={earInner} opacity="0.5" />
          <polygon points="94,60 98,44 82,56" fill={earInner} opacity="0.5" />
          {/* arms */}
          <ellipse cx="16" cy="102" rx="13" ry="10" fill={body} transform="rotate(18 16 102)" />
          <ellipse cx="104" cy="102" rx="13" ry="10" fill={body} transform="rotate(-18 104 102)" />
          {/* eyes - sparkly */}
          <ellipse cx="43" cy="85" rx="13" ry="14" fill="white" />
          <ellipse cx="77" cy="85" rx="13" ry="14" fill="white" />
          <ellipse cx="44" cy="87" rx="9" ry="10" fill={eye} />
          <ellipse cx="78" cy="87" rx="9" ry="10" fill={eye} />
          <circle cx="50" cy="83" r="4" fill="white" />
          <circle cx="84" cy="83" r="4" fill="white" />
          <circle cx="42" cy="91" r="1.8" fill="white" />
          <circle cx="76" cy="91" r="1.8" fill="white" />
          {/* star sparkles in eyes */}
          <circle cx="47" cy="93" r="1.2" fill={glow} opacity="0.8" />
          <circle cx="81" cy="93" r="1.2" fill={glow} opacity="0.8" />
          {/* cheeks */}
          <ellipse cx="28" cy="96" rx="11" ry="6.5" fill={cheek} opacity="0.45" />
          <ellipse cx="92" cy="96" rx="11" ry="6.5" fill={cheek} opacity="0.45" />
          {/* nose */}
          <ellipse cx="60" cy="97" rx="5" ry="3.5" fill={accent} />
          {/* big happy smile */}
          <path d="M50 107 Q60 120 70 107" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* feet */}
          <ellipse cx="40" cy="132" rx="19" ry="9" fill={accent} />
          <ellipse cx="80" cy="132" rx="19" ry="9" fill={accent} />
        </g>
      )}

      {/* ── Stage 4: Mythic legendary ── */}
      {stage === 4 && (
        <g>
          {/* aura rings */}
          <ellipse cx="60" cy="94" rx="58" ry="56" fill={glow} opacity="0.07" />
          <ellipse cx="60" cy="94" rx="50" ry="48" fill={glow} opacity="0.06" />
          {/* big wings */}
          <path d="M16 84 Q-4 54 8 34 Q16 52 28 46 Q12 64 18 78" fill={accent} opacity="0.8" />
          <path d="M104 84 Q124 54 112 34 Q104 52 92 46 Q108 64 102 78" fill={accent} opacity="0.8" />
          {/* tail with glow tip */}
          <path d="M98 114 Q124 96 122 70 Q117 84 110 80 Q115 96 102 110" fill={accent} />
          <circle cx="122" cy="68" r="7" fill={glow} opacity="0.85" />
          <circle cx="122" cy="68" r="4" fill="white" opacity="0.5" />
          {/* body */}
          <ellipse cx="60" cy="93" rx="44" ry="42" fill={body} />
          <ellipse cx="60" cy="108" rx="30" ry="25" fill={belly} opacity="0.5" />
          {/* horn crown */}
          <polygon points="60,38 54,54 66,54" fill={glow} />
          <polygon points="44,48 36,28 52,44" fill={glow} opacity="0.85" />
          <polygon points="76,48 84,28 68,44" fill={glow} opacity="0.85" />
          {/* ears */}
          <polygon points="24,62 15,38 38,56" fill={body} />
          <polygon points="96,62 105,38 82,56" fill={body} />
          <polygon points="24,62 20,45 36,58" fill={earInner} opacity="0.5" />
          <polygon points="96,62 100,45 84,58" fill={earInner} opacity="0.5" />
          {/* arms */}
          <ellipse cx="14" cy="100" rx="14" ry="11" fill={body} transform="rotate(16 14 100)" />
          <ellipse cx="106" cy="100" rx="14" ry="11" fill={body} transform="rotate(-16 106 100)" />
          {/* mega eyes */}
          <ellipse cx="42" cy="84" rx="14" ry="15" fill="white" />
          <ellipse cx="78" cy="84" rx="14" ry="15" fill="white" />
          <ellipse cx="43" cy="86" rx="10" ry="11" fill={eye} />
          <ellipse cx="79" cy="86" rx="10" ry="11" fill={eye} />
          <circle cx="50" cy="82" r="4.5" fill="white" />
          <circle cx="86" cy="82" r="4.5" fill="white" />
          <circle cx="41" cy="91" r="2" fill="white" />
          <circle cx="77" cy="91" r="2" fill="white" />
          {/* glowing eye sparkles */}
          <circle cx="47" cy="93" r="1.5" fill={glow} opacity="0.9" />
          <circle cx="83" cy="93" r="1.5" fill={glow} opacity="0.9" />
          {/* cheeks with extra glow */}
          <ellipse cx="26" cy="95" rx="12" ry="7" fill={cheek} opacity="0.5" />
          <ellipse cx="94" cy="95" rx="12" ry="7" fill={cheek} opacity="0.5" />
          {/* nose */}
          <ellipse cx="60" cy="96" rx="5.5" ry="4" fill={accent} />
          {/* mega smile */}
          <path d="M49 108 Q60 124 71 108" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* feet */}
          <ellipse cx="38" cy="133" rx="21" ry="10" fill={accent} />
          <ellipse cx="82" cy="133" rx="21" ry="10" fill={accent} />
        </g>
      )}
    </svg>
  );
};

// ── Color Picker ─────────────────────────────────────────────────────────────
type ColorPickerProps = { onChoose: (color: string) => void };
const ColorPicker = ({ onChoose }: ColorPickerProps) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
    style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 32, maxWidth: 420, width: "100%" }}>
    <div style={{ textAlign: "center", marginBottom: 24 }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>🎮</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>Choose Your Companion!</h2>
      <p style={{ color: "var(--muted)", fontSize: 14 }}>Pick a color type for your learning buddy</p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {Object.entries(colorPalettes).map(([key, pal]) => (
        <motion.button key={key} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => onChoose(key)}
          style={{ background: pal.bg, border: "2px solid var(--border)", borderRadius: 12, padding: 16, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transition: "border-color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = pal.body}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
          <CreatureSVG stage={2} palette={pal} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{pal.name}</span>
        </motion.button>
      ))}
    </div>
  </motion.div>
);

// ── Learner Profile ───────────────────────────────────────────────────────────
type LearnerProfileProps = {
  correctAnswers: number;
  streak: number;
  totalAnswered: number;
  chosenColor: keyof typeof colorPalettes | null;
  onChooseColor: (color: string) => void;
};
const LearnerProfile = ({ correctAnswers, streak, totalAnswered, chosenColor, onChooseColor }: LearnerProfileProps) => {
  const [showPicker, setShowPicker] = useState(false);
  if (!chosenColor) return <div style={{ display: "flex", justifyContent: "center" }}><ColorPicker onChoose={onChooseColor} /></div>;

  const stage = getMascotStage(correctAnswers);
  const info = stageInfo[stage];
  const palette = colorPalettes[chosenColor as keyof typeof colorPalettes] || colorPalettes.flame;
  const nextThreshold = [2, 5, 10, 16, Infinity][stage];
  const prevThreshold = [0, 2, 5, 10, 16][stage];
  const progressToNext = stage < 4 ? ((correctAnswers - prevThreshold) / (nextThreshold - prevThreshold)) * 100 : 100;
  const nextStage = stage < 4 ? stageInfo[stage + 1] : null;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <AnimatePresence>
        {showPicker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowPicker(false)}
            style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div onClick={e => e.stopPropagation()}>
              <ColorPicker onChoose={(c: string) => { onChooseColor(c); setShowPicker(false); }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <motion.div key={`${chosenColor}-${stage}`} initial={{ scale: 0.5, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          style={{ position: "relative", flexShrink: 0, width: 112, height: 112, borderRadius: 16, background: palette.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
           <CreatureSVG stage={Math.max(stage, 2)} palette={palette} />
          </motion.div>
          {streak >= 3 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              style={{ position: "absolute", top: -8, right: -8, width: 28, height: 28, borderRadius: "50%", background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
              <span style={{ fontSize: 14 }}>🔥</span>
            </motion.div>
          )}
        </motion.div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h3 style={{ fontWeight: 700, fontSize: 18, color: "var(--fg)" }}>{info.label}</h3>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>Lv.{stage + 1}</span>
            <button onClick={() => setShowPicker(true)} style={{ marginLeft: "auto", padding: "6px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "var(--muted)" }}>
              <Icons.Palette />
            </button>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>{info.subtitle}</p>
          {stage < 4 && nextStage && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
                <span>Next: {nextStage.label}</span>
                <span>{correctAnswers}/{nextThreshold} correct</span>
              </div>
              <div style={{ height: 6, background: "var(--secondary)", borderRadius: 999, overflow: "hidden" }}>
                <motion.div style={{ height: "100%", borderRadius: 999, background: palette.body }}
                  initial={{ width: 0 }} animate={{ width: `${progressToNext}%` }} transition={{ duration: 0.6 }} />
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { icon: "⭐", val: correctAnswers, label: "correct", color: "var(--primary)" },
              { icon: "⚡", val: streak, label: "streak", color: streak >= 3 ? "#ef4444" : "var(--fg)" },
              ...(correctAnswers > 0 ? [{ icon: "🏆", val: `${totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0}%`, label: "accuracy", color: "#22c55e" }] : [])
            ].map(({ icon, val, label, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>{icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color }}>{val}</span>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {streak >= 3 && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
          style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)", display: "flex", alignItems: "center", gap: 8 }}>
            🔥 {streak >= 10 ? "LEGENDARY STREAK! You're on fire!" : streak >= 7 ? "Amazing streak! Keep it going!" : streak >= 5 ? "Hot streak! You're unstoppable!" : "Streak started! Don't break it!"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

// ── Comprehension Check ───────────────────────────────────────────────────────
type Question = {
  id: string;
  moduleId: string;
  scenario: string;
  question: string;
  options: string[];
  correctIndex: number;
  timeLimit: number;
};
type Result = { questionId: string; correct: boolean; timeTaken: number };
type ComprehensionCheckProps = {
  questions: Question[];
  onComplete: (results: Result[]) => void;
};
const ComprehensionCheck = ({ questions, onComplete }: ComprehensionCheckProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(questions[0]?.timeLimit ?? 30);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [results, setResults] = useState<Result[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (showResult || completed) return;
    if (timeLeft <= 0) { handleSubmit(-1); return; }
    const timer = setInterval(() => setTimeLeft((t: number) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showResult, completed]);

  const handleSubmit = useCallback((option: number) => {
    const timeTaken = (Date.now() - startTime) / 1000;
    const correct = option === currentQ.correctIndex;
    setSelectedOption(option);
    setShowResult(true);
    setResults(prev => [...prev, { questionId: currentQ.id, correct, timeTaken }]);
  }, [startTime, currentQ]);

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setCompleted(true);
      onComplete(results);
      return;
    }
    setCurrentIndex((i: number) => i + 1);
    setSelectedOption(null);
    setShowResult(false);
    setTimeLeft(questions[currentIndex + 1].timeLimit);
    setStartTime(Date.now());
  };

  if (completed) {
    const correctCount = results.filter((r: Result) => r.correct).length;
    const avgTime = results.reduce((a: number, r: Result) => a + r.timeTaken, 0) / results.length;
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "48px 0" }}>
        <div style={{ display: "inline-flex", width: 80, height: 80, borderRadius: "50%", background: "rgba(99,102,241,0.1)", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: 16 }}>⭐</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--fg)", marginBottom: 16 }}>Assessment Complete!</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 48, marginBottom: 16 }}>
          <div><p style={{ fontSize: 32, fontWeight: 700, color: "var(--primary)" }}>{correctCount}/{questions.length}</p><p style={{ fontSize: 13, color: "var(--muted)" }}>Correct</p></div>
          <div><p style={{ fontSize: 32, fontWeight: 700, color: "#f97316" }}>{avgTime.toFixed(1)}s</p><p style={{ fontSize: 13, color: "var(--muted)" }}>Avg. Time</p></div>
        </div>
        <p style={{ color: "var(--muted)", maxWidth: 400, margin: "0 auto", fontSize: 14 }}>
          {correctCount === questions.length ? "Perfect score! You've demonstrated excellent comprehension." :
           correctCount >= questions.length * 0.7 ? "Good job! Review the missed questions to strengthen your understanding." :
           "Consider reviewing the material and retaking the assessment."}
        </p>
      </motion.div>
    );
  }

  const timerPercent = (timeLeft / currentQ.timeLimit) * 100;
  const timerColor = timeLeft <= 5 ? "#ef4444" : timeLeft <= 10 ? "#f97316" : "var(--primary)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>Question {currentIndex + 1} of {questions.length}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: timeLeft <= 5 ? "#ef4444" : "var(--fg)" }}>{timeLeft}s</span>
        </div>
      </div>
      <div style={{ height: 6, background: "var(--secondary)", borderRadius: 999, overflow: "hidden" }}>
        <motion.div style={{ height: "100%", background: timerColor, borderRadius: 999 }} initial={{ width: "100%" }} animate={{ width: `${timerPercent}%` }} transition={{ duration: 0.5 }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={currentQ.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
          <div style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.1)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--primary)", marginBottom: 8 }}>Scenario</p>
            <p style={{ color: "var(--fg)", lineHeight: 1.6 }}>{currentQ.scenario}</p>
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: "var(--fg)", marginBottom: 16 }}>{currentQ.question}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {currentQ.options.map((opt: string, i: number) => {
              let bg = "var(--card)", border = "var(--border)", opacity = 1;
              if (showResult) {
                if (i === currentQ.correctIndex) { bg = "rgba(34,197,94,0.1)"; border = "#22c55e"; }
                else if (i === selectedOption) { bg = "rgba(239,68,68,0.1)"; border = "#ef4444"; }
                else { opacity = 0.5; }
              } else if (selectedOption === i) { bg = "rgba(99,102,241,0.1)"; border = "var(--primary)"; }
              return (
                <motion.button key={i} whileHover={!showResult ? { scale: 1.01 } : {}} whileTap={!showResult ? { scale: 0.99 } : {}}
                  onClick={() => !showResult && handleSubmit(i)}
                  disabled={showResult}
                  style={{ width: "100%", textAlign: "left", padding: "14px 16px", borderRadius: 12, border: `2px solid ${border}`, background: bg, cursor: showResult ? "default" : "pointer", display: "flex", alignItems: "center", gap: 12, opacity, transition: "all 0.15s" }}>
                  <span style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span style={{ color: "var(--fg)", flex: 1, fontSize: 14 }}>{opt}</span>
                  {showResult && i === currentQ.correctIndex && <span style={{ color: "#22c55e", fontSize: 18 }}>✓</span>}
                  {showResult && i === selectedOption && i !== currentQ.correctIndex && <span style={{ color: "#ef4444", fontSize: 18 }}>✗</span>}
                </motion.button>
              );
            })}
          </div>
          {showResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <button onClick={handleNext}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "var(--primary)", color: "white", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
                {currentIndex + 1 >= questions.length ? "See Results" : "Next Question"} →
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ── Domain badge colors ───────────────────────────────────────────────────────
const domainColor = { Culture: "#6366f1", Policies: "#f97316", Service: "#06b6d4", Adaptability: "#ef4444", Sales: "#22c55e" };

// ── Module Card ───────────────────────────────────────────────────────────────
type Module = typeof modules[number];
type ModuleCardProps = {
  module: Module;
  onStart: (mod: Module) => void;
  index: number;
};
const ModuleCard = ({ module, onStart, index }: ModuleCardProps) => {
  const isLocked = !module.completed && index > 0;
  const scoreColor = module.score !== null && module.score >= 80 ? "#22c55e" : module.score !== null && module.score >= 60 ? "#f97316" : "#ef4444";

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, cursor: isLocked ? "default" : "pointer", opacity: isLocked ? 0.6 : 1 }}
      onClick={() => !isLocked && !module.completed && onStart(module)}
      onMouseEnter={e => { if (!isLocked) e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: module.completed ? "rgba(34,197,94,0.1)" : "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {module.completed ? <span style={{ color: "#22c55e", fontSize: 20 }}>✓</span> : isLocked ? <span style={{ color: "var(--muted)" }}>🔒</span> : <span style={{ color: "var(--muted)", fontSize: 18 }}>📖</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: "var(--fg)" }}>{module.title}</span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: `${domainColor[module.domain as keyof typeof domainColor]}20`, color: domainColor[module.domain as keyof typeof domainColor] }}>{module.domain}</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6, lineHeight: 1.4 }}>{module.description}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>⏱ {module.duration}</span>
          {module.score !== null && <span style={{ fontSize: 12, fontWeight: 600, color: scoreColor }}>Score: {module.score}%</span>}
        </div>
      </div>
      <span style={{ color: "var(--muted)", fontSize: 18 }}>→</span>
    </motion.div>
  );
};

// ── Simple Bar Chart ──────────────────────────────────────────────────────────
type SimpleBarDatum = { label: string; value: number; suffix?: string };
type SimpleBarProps = {
  data: SimpleBarDatum[];
  color?: string | ((d: SimpleBarDatum) => string);
  maxVal?: number;
};
const SimpleBar = ({ data, color = "var(--primary)", maxVal }: SimpleBarProps) => {
  const max = maxVal || Math.max(...data.map((d: SimpleBarDatum) => d.value));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.map((d: SimpleBarDatum, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "var(--muted)", width: 160, flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.label}</span>
          <div style={{ flex: 1, height: 20, background: "var(--secondary)", borderRadius: 6, overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${(d.value / max) * 100}%` }} transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{ height: "100%", background: typeof color === "function" ? (color as (d: SimpleBarDatum) => string)(d) : color, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "white" }}>{d.value}{d.suffix || ""}</span>
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Learner View ──────────────────────────────────────────────────────────────

const LearnerView = () => {
  const [moduleList, setModuleList] = useState<Module[]>(modules);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [chosenColor, setChosenColor] = useState<keyof typeof colorPalettes | null>(null);

  const completedCount = moduleList.filter((m: Module) => m.completed).length;
  const progressPct = (completedCount / moduleList.length) * 100;

  const handleStart = (mod: Module) => {
    setActiveModule(mod);
  };

  const handleComplete = (results: Result[]) => {
    const correct = results.filter((r: Result) => r.correct).length;
    const pct = Math.round((correct / results.length) * 100);
    let newStreak = streak;
    results.forEach((r: Result) => { if (r.correct) newStreak++; else newStreak = 0; });
    setCorrectAnswers((c: number) => c + correct);
    setStreak(newStreak);
    setTotalAnswered((t: number) => t + results.length);
    if (activeModule) {
      setModuleList((prev: Module[]) => prev.map((m: Module) => m.id === activeModule.id ? { ...m, completed: true, score: pct } : m));
    }
    setActiveModule(null);
  };

  const moduleQuestions = activeModule ? comprehensionQuestions.filter((q: Question) => q.moduleId === activeModule.id) : [];

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 16px", display: "flex", flexDirection: "column", gap: 24 }}>
      {!chosenColor ? (
        <>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--fg)", marginBottom: 8 }}>My Learning Path</h1>
            <p style={{ color: "var(--muted)", fontSize: 16 }}>Complete modules and test your comprehension</p>
          </div>
          <LearnerProfile correctAnswers={correctAnswers} streak={streak} totalAnswered={totalAnswered} chosenColor={chosenColor} onChooseColor={(color: string) => setChosenColor(color as keyof typeof colorPalettes)} />
        </>
      ) : (
        <>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--fg)", marginBottom: 4 }}>My Learning Path</h1>
            <p style={{ color: "var(--muted)", fontSize: 16 }}>Complete modules and test your comprehension</p>
          </div>

          <LearnerProfile correctAnswers={correctAnswers} streak={streak} totalAnswered={totalAnswered} chosenColor={chosenColor} onChooseColor={(color: string) => setChosenColor(color as keyof typeof colorPalettes)} />

          {/* Overall Progress */}
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontWeight: 600, fontSize: 15, color: "var(--fg)" }}>Overall Progress</span>
              <span style={{ fontWeight: 700, fontSize: 15, color: "var(--primary)" }}>{completedCount}/{moduleList.length} modules</span>
            </div>
            <div style={{ height: 8, background: "var(--secondary)", borderRadius: 999, overflow: "hidden" }}>
              <motion.div style={{ height: "100%", background: "var(--primary)", borderRadius: 999 }}
                animate={{ width: `${progressPct}%` }} transition={{ duration: 0.6 }} />
            </div>
          </div>

          {/* Active quiz */}
          <AnimatePresence>
            {activeModule && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h2 style={{ fontWeight: 700, fontSize: 18, color: "var(--fg)" }}>{activeModule.title}</h2>
                  <button onClick={() => setActiveModule(null)} style={{ border: "none", background: "var(--secondary)", borderRadius: 8, padding: "4px 10px", cursor: "pointer", color: "var(--muted)", fontSize: 13 }}>✕ Cancel</button>
                </div>
                <ComprehensionCheck questions={moduleQuestions} onComplete={handleComplete} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Module list */}
          {!activeModule && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {moduleList.map((mod, i) => (
                <ModuleCard key={mod.id} module={mod} onStart={handleStart} index={i} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ── Instructor Dashboard ──────────────────────────────────────────────────────
const InstructorDashboard = () => {
  const atRisk = learners.filter(l => l.atRisk);
  const avgAccuracy = Math.round(learners.reduce((a, l) => a + l.avgAccuracy, 0) / learners.length);
  const avgTime = (learners.reduce((a, l) => a + l.avgResponseTime, 0) / learners.length).toFixed(1);
  // const totalCompleted = learners.reduce((a, l) => a + l.completedModules, 0); // unused

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px", display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--fg)", marginBottom: 4 }}>Instructor Dashboard</h1>
        <p style={{ color: "var(--muted)", fontSize: 15 }}>Monitor learner progress and identify areas needing attention</p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
        {[
          { label: "Learners", value: learners.length, icon: "👥", color: "var(--primary)" },
          { label: "Avg Accuracy", value: `${avgAccuracy}%`, icon: "🎯", color: "#22c55e" },
          { label: "Avg Response", value: `${avgTime}s`, icon: "⚡", color: "#f97316" },
          { label: "At Risk", value: atRisk.length, icon: "⚠️", color: "#ef4444" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Module Difficulty */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: "var(--fg)", marginBottom: 4 }}>Module Difficulty</h3>
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>Fail rate by module</p>
          <SimpleBar data={moduleFriction.map(m => ({ label: m.moduleName.split(" ").slice(0, 3).join(" "), value: m.failRate, suffix: "%" }))}
            color={d => d.value > 40 ? "#ef4444" : d.value > 30 ? "#f97316" : "#22c55e"} />
        </div>

        {/* Learner Accuracy */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: "var(--fg)", marginBottom: 4 }}>Learner Accuracy</h3>
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>Accuracy per learner</p>
          <SimpleBar data={learners.map(l => ({ label: l.name, value: l.avgAccuracy, suffix: "%" }))}
            color={d => d.value >= 80 ? "#22c55e" : d.value >= 60 ? "#f97316" : "#ef4444"} maxVal={100} />
        </div>
      </div>

      {/* At-Risk Learners */}
      {atRisk.length > 0 && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <h3 style={{ fontWeight: 700, fontSize: 15, color: "#ef4444" }}>At-Risk Learners</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {atRisk.map(l => (
              <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#ef4444", flexShrink: 0 }}>{l.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--fg)" }}>{l.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Last active: {l.lastActive}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#ef4444" }}>{l.avgAccuracy}%</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{l.completedModules}/{l.totalModules} modules</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Learners Table */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, color: "var(--fg)", marginBottom: 16 }}>All Learners</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "8px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)" }}>
            <span>Learner</span><span>Progress</span><span>Accuracy</span><span>Avg Time</span><span>Status</span>
          </div>
          {learners.map((l, i) => (
            <motion.div key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "12px 12px", borderRadius: 8, alignItems: "center" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--secondary)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: l.atRisk ? "rgba(239,68,68,0.15)" : "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: l.atRisk ? "#ef4444" : "var(--primary)" }}>{l.avatar}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)" }}>{l.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{l.lastActive}</div>
                </div>
              </div>
              <span style={{ fontSize: 13, color: "var(--fg)" }}>{l.completedModules}/{l.totalModules}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: l.avgAccuracy >= 80 ? "#22c55e" : l.avgAccuracy >= 60 ? "#f97316" : "#ef4444" }}>{l.avgAccuracy}%</span>
              <span style={{ fontSize: 13, color: "var(--fg)" }}>{l.avgResponseTime}s</span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: l.atRisk ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", color: l.atRisk ? "#ef4444" : "#22c55e", display: "inline-block" }}>
                {l.atRisk ? "At Risk" : "On Track"}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── App Shell ─────────────────────────────────────────────────────────────────

const rankMedal = (rank: number) => {
  if (rank === 1) return { emoji: "🥇", bg: "#FEF3C7", color: "#D97706" };
  if (rank === 2) return { emoji: "🥈", bg: "#F1F5F9", color: "#64748B" };
  if (rank === 3) return { emoji: "🥉", bg: "#FEF2F0", color: "#C2410C" };
  return { emoji: null, bg: "transparent", color: "var(--muted)" };
};

const Leaderboard = () => {
  const [sortBy, setSortBy] = useState("accuracy");

  const sorted = [...leaderboardData].sort((a, b) => {
    if (sortBy === "accuracy") return b.avgAccuracy - a.avgAccuracy;
    if (sortBy === "modules")  return b.completedModules - a.completedModules;
    if (sortBy === "streak")   return b.streak - a.streak;
    return 0;
  });

  const topThree = sorted.slice(0, 3);
  const rest     = sorted.slice(3);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 16px", display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--fg)", marginBottom: 4 }}>🏆 Leaderboard</h1>
        <p style={{ color: "var(--muted)", fontSize: 15 }}>See how everyone is progressing</p>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {[
          { key: "accuracy", label: "🎯 Accuracy" },
          { key: "modules",  label: "📚 Modules" },
          { key: "streak",   label: "🔥 Streak" },
        ].map(tab => (
          <button key={tab.key} onClick={() => setSortBy(tab.key)}
            style={{
              padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, transition: "all 0.15s",
              background: sortBy === tab.key ? "var(--primary)" : "var(--card)",
              color: sortBy === tab.key ? "white" : "var(--muted)",
              boxShadow: sortBy === tab.key ? "none" : "0 1px 4px rgba(0,0,0,0.08)",
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {topThree.map((learner, i) => {
          const rank  = i + 1;
          const medal = rankMedal(rank);
          const stage = getMascotStage(learner.completedModules * 4);
          const pal   = colorPalettes[learner.color as keyof typeof colorPalettes] || colorPalettes.flame;
          return (
            <motion.div key={learner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: rank === 1 ? -8 : 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: "var(--card)",
                border: `2px solid ${rank === 1 ? "#F59E0B" : rank === 2 ? "#94A3B8" : "#FB923C"}`,
                borderRadius: 16, padding: "20px 16px", textAlign: "center",
                boxShadow: rank === 1 ? "0 8px 24px rgba(245,158,11,0.15)" : "0 2px 8px rgba(0,0,0,0.06)",
              }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{medal.emoji}</div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8,
                background: pal.bg, borderRadius: 12, padding: "8px 0" }}>
                <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                  <CreatureSVG stage={stage} palette={pal} />
                </motion.div>
              </div>
              <p style={{ fontWeight: 700, fontSize: 14, color: "var(--fg)", marginBottom: 2 }}>{learner.name}</p>
              <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>{learner.lastActive}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "var(--muted)" }}>Accuracy</span>
                  <span style={{ fontWeight: 700, color: learner.avgAccuracy >= 80 ? "#22c55e" : "#f97316" }}>{learner.avgAccuracy}%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "var(--muted)" }}>Modules</span>
                  <span style={{ fontWeight: 700, color: "var(--fg)" }}>{learner.completedModules}/5</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "var(--muted)" }}>Streak</span>
                  <span style={{ fontWeight: 700, color: learner.streak >= 5 ? "#ef4444" : "var(--fg)" }}>
                    {learner.streak >= 1 ? "🔥 " : ""}{learner.streak}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rest.map((learner, i) => {
          const rank  = i + 4;
          const stage = 2;
          const pal   = colorPalettes[learner.color as keyof typeof colorPalettes] || colorPalettes.flame;
          return (
            <motion.div key={learner.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 14, padding: "14px 18px",
                display: "flex", alignItems: "center", gap: 14,
              }}>
              <div style={{ width: 28, textAlign: "center", fontWeight: 800, fontSize: 15, color: "var(--muted)", flexShrink: 0 }}>
                {rank}
              </div>
              <div style={{ background: pal.bg, borderRadius: 10, padding: "4px 6px", flexShrink: 0 }}>
                <CreatureSVG stage={stage} palette={pal} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: "var(--fg)" }}>{learner.name}</p>
                <p style={{ fontSize: 12, color: "var(--muted)" }}>{learner.lastActive}</p>
              </div>
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: learner.avgAccuracy >= 70 ? "#22c55e" : "#ef4444" }}>{learner.avgAccuracy}%</p>
                  <p style={{ fontSize: 11, color: "var(--muted)" }}>accuracy</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)" }}>{learner.completedModules}/5</p>
                  <p style={{ fontSize: 11, color: "var(--muted)" }}>modules</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: learner.streak >= 3 ? "#ef4444" : "var(--fg)" }}>
                    {learner.streak >= 1 ? "🔥" : "—"} {learner.streak}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--muted)" }}>streak</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState("learner");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--font-body)" }}>
      <style>{`
        :root {
          --primary: #6366f1;
          --primary-fg: #fff;
          --bg: #f8f8fc;
          --card: #ffffff;
          --border: #e8e8f0;
          --fg: #1a1a2e;
          --muted: #7c7c99;
          --secondary: #f0f0f8;
          --font-body: 'Segoe UI', system-ui, sans-serif;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; }
      `}</style>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 18, color: "var(--fg)" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 16 }}>🎓</div>
            Disco
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[
              { key: "learner", label: "Learner", icon: "📖" },
              { key: "leaderboard", label: "Leaderboard", icon: "🏆" },
              { key: "instructor", label: "Instructor", icon: "📊" },
            ].map(tab => (
              <button key={tab.key} onClick={() => setView(tab.key)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.15s",
                  background: view === tab.key ? "rgba(99,102,241,0.1)" : "transparent",
                  color: view === tab.key ? "var(--primary)" : "var(--muted)" }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
         {view === "learner" ? <LearnerView /> : view === "leaderboard" ? <Leaderboard /> : <InstructorDashboard />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}