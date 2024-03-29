"use client";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Barbershop } from "@prisma/client";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BarbershopProps {
  barbershop: Barbershop;
}
const BarbershopItem = ({ barbershop }: BarbershopProps) => {
  const router = useRouter();
  const handleBookingClick = () => {
    router.push(`/barbershops/${barbershop.id}`);
  };

  return (
    <div>
      <Card className="min-w-full max-w-full rounded-2xl">
        <CardContent className="px-1 py-0 pt-1">
          <div className="relative h-[159px] w-full">
            <div className="absolute left-2 top-2 z-50">
              <Badge
                variant={"secondary"}
                className=" flex items-center gap-1 opacity-90"
              >
                <StarIcon className="fill-primary text-primary" size={12} />
                <span className="text-xs">5,0</span>
              </Badge>
            </div>
            <Image
              fill
              src={barbershop.imageUrl}
              alt={barbershop.name}
              style={{ objectFit: "cover" }}
              className="rounded-2xl"
            />
          </div>
          <div className="px-2 pb-3">
            <h2 className="mt-2 overflow-hidden text-ellipsis text-nowrap font-bold">
              {barbershop.name}
            </h2>
            <p className="overflow-hidden text-ellipsis text-nowrap text-sm text-gray-400">
              {barbershop.address}
            </p>
            <Button
              className="mt-3 w-full"
              variant="secondary"
              onClick={handleBookingClick}
            >
              Reservar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarbershopItem;
