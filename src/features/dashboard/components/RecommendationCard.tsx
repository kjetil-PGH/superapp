import { useNavigate } from "react-router-dom";
import type { Insight } from "@/types/domain";
import { formatNOK } from "@/lib/format";
import { MerchantLogo, MerchantLogoGroup } from "@/components/ui/MerchantLogo";

interface RecommendationCardProps {
  insight: Insight;
}

export function RecommendationCard({ insight }: RecommendationCardProps) {
  const navigate = useNavigate();

  const severityStyles = {
    critical: { cat: "text-accent", border: "border-accent/15" },
    warning: { cat: "text-warn", border: "border-warn/15" },
    info: { cat: "text-ink-3", border: "border-transparent" },
  };

  const s = severityStyles[insight.severity];

  const handleClick = () => {
    if (insight.relatedExpenseId) {
      navigate(`/recurring/${insight.relatedExpenseId}`);
    } else {
      navigate("/insights");
    }
  };

  return (
    <div
      className={`bg-surface rounded-[20px] shadow-sm shadow-black/[0.04] border ${s.border} overflow-hidden cursor-pointer active:scale-[0.99] transition-transform mb-2.5`}
      onClick={handleClick}
    >
      <div className="p-4 pb-3">
        <div className="flex items-center gap-2.5 mb-2">
          {insight.merchantNames && insight.merchantNames.length > 1 ? (
            <MerchantLogoGroup names={insight.merchantNames} size={28} />
          ) : (
            insight.merchantName && (
              <MerchantLogo name={insight.merchantName} size={28} />
            )
          )}
          <div
            className={`text-xs font-bold uppercase tracking-wider ${s.cat}`}
          >
            {insight.type === "price_increase"
              ? "Prisøkning"
              : insight.type === "saving_opportunity"
                ? "Sparemulighet"
                : insight.type === "unused_subscription"
                  ? "Mulig ubrukt"
                  : "Innsikt"}
          </div>
        </div>
        {insight.potentialMonthlySaving && (
          <div className="text-2xl font-extrabold text-ink tracking-tight leading-none mb-1">
            +{formatNOK(insight.potentialMonthlySaving)}
            <span className="text-base font-normal text-ink-3">/mnd</span>
          </div>
        )}
        <div className="text-sm text-ink-2 leading-relaxed mb-2">
          {insight.description}
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-surface-2/50">
        <span className="text-sm font-bold text-accent">Se detaljer →</span>
      </div>
    </div>
  );
}
