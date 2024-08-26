import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LuLoader2 } from "react-icons/lu";
import { z } from "zod";

import { Button } from "@giverve/ui/button";
import { DialogClose, DialogFooter } from "@giverve/ui/dialog";
import { DrawerClose, DrawerFooter } from "@giverve/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@giverve/ui/form";
import { Input } from "@giverve/ui/input";
import { Textarea } from "@giverve/ui/textarea";

import { api } from "~/utils/api";

const formSchema = z.object({
  guildId: z.string(),
  title: z.string().min(3).max(50),
  description: z.string().max(150),
});

export default function CreateEventForm({
  type,
}: Readonly<{
  type: "dialog" | "drawer";
}>) {
  const router = useRouter();
  const guildId = String(router.query.guildId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guildId,
      title: "",
      description: "",
    },
  });

  const { mutate, isPending } = api.dashboard.event.create.useMutation({
    onSuccess: ({ eventId }) => {
      form.reset();
      void router.push(`/dashboard/${guildId}/events/${eventId}`);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 font-bold"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Event title"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Event description"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === "dialog" ? (
          <DialogFooter>
            <DialogClose>
              <Button
                type="button"
                variant="neutral"
                className="min-w-24"
                disabled={isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="min-w-24" disabled={isPending}>
              {!isPending ? (
                "Continue"
              ) : (
                <LuLoader2 className="size-5 animate-spin" />
              )}
            </Button>
          </DialogFooter>
        ) : (
          <DrawerFooter className="grid grid-cols-2">
            <DrawerClose asChild>
              <Button
                type="button"
                variant="neutral"
                className="min-w-24"
                disabled={isPending}
              >
                Cancel
              </Button>
            </DrawerClose>
            <Button type="submit" className="min-w-24" disabled={isPending}>
              {!isPending ? (
                "Continue"
              ) : (
                <LuLoader2 className="size-5 animate-spin" />
              )}
            </Button>
          </DrawerFooter>
        )}
      </form>
    </Form>
  );
}
