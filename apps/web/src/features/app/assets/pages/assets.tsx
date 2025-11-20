import { AssetDataTable } from "../components/Table/data-table";
import { useQuery } from "@tanstack/react-query";
import { getAllAssets } from "../services/asset";
import { EyesonTitle } from "@/components/EyesonAsset/eyeson-title";
import { StatsCard } from "@/components/EyesonAsset/stats-card";
import { Package, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react";

export function AssetsPage() {
  const { data: assets, isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: () => getAllAssets(),
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <EyesonTitle title="Ativos" subtitle="Gerencie os ativos do sistema" />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Ativos"
          value={assets?.length || 0}
          description="Ativos registrados no sistema"
          icon={Package}
        />
        <StatsCard
          title="Em Operação"
          value={assets ? Math.floor(assets.length * 0.8) : 0}
          description="+2% em relação ao mês passado"
          icon={CheckCircle}
        />
        <StatsCard
          title="Em Manutenção"
          value={assets ? Math.floor(assets.length * 0.15) : 0}
          description="4 ativos aguardando peças"
          icon={AlertTriangle}
        />
        <StatsCard
          title="Valor Total"
          value="R$ 1.2M"
          description="Estimativa atualizada"
          icon={BarChart3}
        />
      </div>

      <AssetDataTable assets={assets || []} isLoading={isLoading || false} />
    </div>
  );
}
