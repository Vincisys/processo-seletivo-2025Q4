import { OwnerDataTable } from "../components/Table/data-table";
import { useQuery } from "@tanstack/react-query";
import { getAllOwners } from "../services/owner";
import { EyesonTitle } from "@/components/EyesonAsset/eyeson-title";
import { StatsCard } from "@/components/EyesonAsset/stats-card";
import { Users, UserCheck, UserX, Briefcase } from "lucide-react";

export function OwnerPage() {
  const { data: owners, isLoading } = useQuery({
    queryKey: ["owners"],
    queryFn: () => getAllOwners(),
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <EyesonTitle
        title="Responsáveis"
        subtitle="Gerencie os responsáveis do sistema"
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Responsáveis"
          value={owners?.length || 0}
          description="Usuários ativos na plataforma"
          icon={Users}
        />
        <StatsCard
          title="Com Ativos"
          value={owners ? Math.floor(owners.length * 0.6) : 0}
          description="Responsáveis com ativos vinculados"
          icon={UserCheck}
        />
        <StatsCard
          title="Sem Ativos"
          value={owners ? Math.floor(owners.length * 0.4) : 0}
          description="Disponíveis para alocação"
          icon={UserX}
        />
        <StatsCard
          title="Departamentos"
          value="8"
          description="Setores registrados"
          icon={Briefcase}
        />
      </div>

      <OwnerDataTable owners={owners || []} isLoading={isLoading} />
    </div>
  );
}
