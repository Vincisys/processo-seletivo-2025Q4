import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TriangleAlert } from "lucide-react";

export function AlertAssetCard() {
  return (
    <Card className="py-2! px-2!">
      <CardContent className="flex flex-row items-center px-2">
        <TriangleAlert className="h-8 w-8 text-yellow-500" />
        <div className="flex flex-col px-2 justify-start items-start">
          <CardHeader className="text-base font-bold p-0">Atenção</CardHeader>
          <span className="text-sm">
            Um ativo estará ligado ativamente a um responsável
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

