"use client";

import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";

interface CreditDisplayProps {
  cost?: number;
  showBuyButton?: boolean;
}

export function CreditDisplay({ cost, showBuyButton = true }: CreditDisplayProps) {
  const [credits, setCredits] = useState<number>(0);

  useEffect(() => {
    // Fetch user credits from API
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const response = await fetch("/api/credits");
      const data = await response.json();
      setCredits(data.credits);
    } catch (error) {
      console.error("Failed to fetch credits:", error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2">
        <CreditCard className="w-4 h-4 text-purple-400" />
        <span className="text-white font-medium">{credits} Credits</span>
        {cost && (
          <span className="text-gray-400 text-sm">
            (Cost: {cost} credits)
          </span>
        )}
      </div>
      {showBuyButton && (
        <button
          onClick={() => window.location.href = "/credits"}
          className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-4 py-2 text-sm font-medium transition"
        >
          Buy Credits
        </button>
      )}
    </div>
  );
}
