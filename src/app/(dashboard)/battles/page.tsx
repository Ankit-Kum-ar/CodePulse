"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { BattleSetup } from "@/components/battles/battle-setup";
import { BattleIntro } from "@/components/battles/battle-intro";
import { BattleRounds } from "@/components/battles/battle-rounds";
import { BattleReport } from "@/components/battles/battle-report";
import { BattleMatchmakingSkeleton } from "@/components/battles/battle-skeleton";
import { useCurrentUser } from "@/hooks/api/use-auth";

type BattlePhase = "SETUP" | "INTRO" | "ROUNDS" | "REPORT";

export default function BattlesPage() {
  const { data: currentUser } = useCurrentUser();
  const [phase, setPhase] = useState<BattlePhase>("SETUP");
  const [ghostBattleData, setGhostBattleData] = useState<{ p1: any, p2: any, battleType: string } | null>(null);
  const [setupUsernames, setSetupUsernames] = useState<{p1: string, p2: string, battleType: string} | null>(null);
  const [initialP1, setInitialP1] = useState("");
  const [initialP2, setInitialP2] = useState("");

  const [isIntroFinished, setIsIntroFinished] = useState(false);

  // Read URL query parameters (e.g. /battles?p2=<username>)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const p2 = params.get("p2") || params.get("opponent") || params.get("vs");
      const p1 = params.get("p1") || currentUser?.username || "code-with-abhi-i5";
      if (p2) {
        setInitialP2(p2);
      }
      if (p1) {
        setInitialP1(p1);
      }
    }
  }, [currentUser]);

  const startGhostBattle = async (p1: string, p2: string, battleType: string) => {
    setSetupUsernames({ p1, p2, battleType });
    setIsIntroFinished(false);
    setPhase("INTRO");
    
    try {
      const [res1, res2] = await Promise.all([
        fetch(`/api/github/developer?username=${p1}`),
        fetch(`/api/github/developer?username=${p2}`)
      ]);

      if (!res1.ok || !res2.ok) {
        throw new Error("Could not find one or both GitHub users.");
      }

      const data1 = await res1.json();
      const data2 = await res2.json();

      setGhostBattleData({ p1: data1, p2: data2, battleType });
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate battle.");
      setPhase("SETUP");
    }
  };

  const handleIntroComplete = () => {
    setIsIntroFinished(true);
  };

  // Transition to ROUNDS only when BOTH intro animation finished AND data loaded
  useEffect(() => {
    if (phase === "INTRO" && isIntroFinished && ghostBattleData) {
      setPhase("ROUNDS");
    }
  }, [phase, isIntroFinished, ghostBattleData]);

  return (
    <div className="w-full relative min-h-[calc(100vh-80px)]">
      <AnimatePresence mode="wait">
        
        {phase === "SETUP" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <BattleSetup
              onStart={startGhostBattle}
              initialPlayer1={initialP1}
              initialPlayer2={initialP2}
            />
          </motion.div>
        )}

        {phase === "INTRO" && setupUsernames && !isIntroFinished && (
          <BattleIntro 
            key="intro"
            p1Username={setupUsernames.p1}
            p2Username={setupUsernames.p2}
            onIntroComplete={handleIntroComplete}
          />
        )}

        {phase === "INTRO" && setupUsernames && isIntroFinished && !ghostBattleData && (
          <motion.div
            key="matchmaking-skeleton"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="pt-6"
          >
            <BattleMatchmakingSkeleton
              p1Username={setupUsernames.p1}
              p2Username={setupUsernames.p2}
              battleType={setupUsernames.battleType}
            />
          </motion.div>
        )}

        {phase === "ROUNDS" && ghostBattleData && (
          <motion.div
            key="rounds"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <BattleRounds 
              player1={ghostBattleData.p1} 
              player2={ghostBattleData.p2} 
              battleType={ghostBattleData.battleType}
              onComplete={() => setPhase("REPORT")} 
            />
          </motion.div>
        )}

        {phase === "REPORT" && ghostBattleData && (
          <motion.div
            key="report"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4"
          >
            <BattleReport 
              player1={ghostBattleData.p1}
              player2={ghostBattleData.p2}
              battleType={ghostBattleData.battleType}
              onRematch={() => {
                setGhostBattleData(null);
                setSetupUsernames(null);
                setPhase("SETUP");
              }}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

