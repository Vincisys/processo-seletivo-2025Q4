import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AssetDataTable } from "../components/Table/data-table";
import { useQuery } from "@tanstack/react-query";
import { getAllAssets } from "../services/asset";
import { EyesonTitle } from "@/components/EyesonAsset/eyeson-title";

export function AssetsPage() {
  const { data: assets, isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: () => getAllAssets(),
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <EyesonTitle title="Ativos" subtitle="Gerencie os ativos do sistema" />
      <Card>
        <CardContent className="flex flex-row">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7486/7486747.png"
            width={150}
            height={150}
          />
          <div className="flex flex-col gap-2 px-4">
            <CardHeader className="text-2xl font-bold p-0">
              Titulo do Card
            </CardHeader>
            <span>
              Existe uma teoria que diz que, se um dia alguém descobrir
              exatamente para que serve o Universo e por que ele está aqui, ele
              desaparecerá instantaneamente.
            </span>
          </div>
        </CardContent>
      </Card>
      <AssetDataTable assets={assets} isLoading={isLoading || false} />
    </div>
  );
}
