"use client";
import { Prisma } from "@prisma/client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Badge } from "@/app/_components/ui/badge";
import { Card, CardContent } from "@/app/_components/ui/card";
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import Image from "next/image";
import { Button } from "@/app/_components/ui/button";
import { cancelBooking } from "@/app/_actions/cancel-booking";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true;
      barbershop: true;
    };
  }>;
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const isBookingConfirmed = isFuture(booking.date);
  const handleCancelClick = async () => {
    setIsDeleteLoading(true);
    try {
      await cancelBooking(booking.id);
      toast.success("Reserva cancelada com sucesso!");
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="min-w-full">
          <CardContent className="flex px-0 py-0">
            <div className="flex flex-[3] flex-col gap-2 py-5 pl-5">
              <Badge
                variant={isBookingConfirmed ? "default" : "secondary"}
                className="w-fit"
              >
                {isBookingConfirmed ? "Confirmado" : "Finalizado"}
              </Badge>
              <h2 className="font-bold">{booking.service.name}</h2>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={booking.barbershop.imageUrl} />
                  <AvatarFallback>{booking.barbershop.name[0]}</AvatarFallback>
                </Avatar>
                <h3 className="text-sm">{booking.barbershop.name}</h3>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center border-l border-solid border-secondary">
              <p className="text-sm capitalize">
                {format(booking.date, "MMMM", { locale: ptBR })}
              </p>
              <p className="text-2xl">{format(booking.date, "dd")}</p>
              <p className="text-sm">{format(booking.date, "hh:mm")}</p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>

      <SheetContent className="px-0">
        <SheetHeader className="border-b border-solid border-secondary px-5 pb-6 text-left">
          <SheetTitle>Informações da Reserva</SheetTitle>
        </SheetHeader>
        <div className="px-5">
          <div className="relative mt-6 h-[180px] w-full">
            <Image
              src={"/barbershop-map.png"}
              alt={booking.barbershop.name}
              fill
            />

            <div className="absolute bottom-4 left-0 w-full px-5">
              <Card className="">
                <CardContent className="flex gap-2 p-3">
                  <Avatar>
                    <AvatarImage src={booking.barbershop.imageUrl} />
                  </Avatar>
                  <div>
                    <h2 className="font-bol">{booking.barbershop.name}</h2>
                    <h3 className="overflow-hidden text-ellipsis text-nowrap text-xs">
                      {booking.barbershop.address}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Badge
            variant={isBookingConfirmed ? "default" : "secondary"}
            className="my-3 w-fit"
          >
            {isBookingConfirmed ? "Confirmado" : "Finalizado"}
          </Badge>

          <div className="border-t border-solid border-secondary px-5 py-6">
            <Card>
              <CardContent className="flex flex-col gap-3 p-3">
                <div className="flex justify-between">
                  <h2 className="font-bold">{booking.service.name}</h2>
                  <h3 className="text-sm font-bold">
                    {Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(booking.service.price))}
                  </h3>
                </div>

                <div className="flex justify-between">
                  <h3 className="text-sm text-gray-400">Data</h3>
                  <h4 className="text-sm">
                    {format(booking.date, "dd 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </h4>
                </div>

                <div className="flex justify-between">
                  <h3 className="text-sm text-gray-400">Horário</h3>
                  <h4 className="text-sm">{format(booking.date, "hh:mm")}</h4>
                </div>

                <div className="flex justify-between">
                  <h3 className="text-sm text-gray-400">Barbearia</h3>
                  <h4 className="text-sm">{booking.barbershop.name}</h4>
                </div>
              </CardContent>
            </Card>

            <SheetFooter className="mt-6 flex-row gap-3">
              <SheetClose asChild>
                <Button variant={"secondary"} className="w-full">
                  Voltar
                </Button>
              </SheetClose>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={!isBookingConfirmed || isDeleteLoading}
                    variant={"destructive"}
                    className="w-full"
                  >
                    Cancelar Reserva
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[90%]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Deseja mesmo cancelar esta reserva?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Uma vez cancelada, não será possível reverter esta ação.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-row gap-3">
                    <AlertDialogCancel className="mt-0 w-full">
                      Voltar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancelClick}
                      className="w-full"
                      disabled={isDeleteLoading}
                    >
                      {isDeleteLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </SheetFooter>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookingItem;
