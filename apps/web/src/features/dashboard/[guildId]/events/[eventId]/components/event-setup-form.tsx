import type { z } from "zod";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AiTwotoneSave } from "react-icons/ai";
import { LuArrowRight, LuLoader2 } from "react-icons/lu";

import { Button } from "@giverve/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@giverve/ui/form";
import { Input } from "@giverve/ui/input";
import { Textarea } from "@giverve/ui/textarea";
import { updateEventRequestValidator } from "@giverve/validators";

import { trpc } from "~/utils/trpc";
import useGetEvent from "../hooks/use-get-event";

const formSchema = updateEventRequestValidator;

export default function EventSetupForm() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const guildId = String(router.query.guildId);
  const eventId = String(router.query.eventId);

  const { data, isLoading } = useGetEvent();

  const { mutate, isPending } = trpc.dashboard.event.patch.useMutation({
    onSuccess: (data) => {
      utils.dashboard.event.getOne.setData(
        { eventId: data.eventId },
        {
          eventId: data.eventId,
          title: data.title,
          description: data.description ?? "",
        },
      );
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventId: "",
      title: "",
      description: "",
    },
  });

  // Reset form values when data is loaded
  useEffect(() => {
    if (data) {
      form.reset({
        eventId: eventId,
        title: data.title,
        description: data.description ?? "",
      });
    }
  }, [data, eventId, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <Form {...form}>
      {!isLoading ? (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 font-bold"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g Valorant Stack 5 Tonite"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This title will be displayed to your guild members.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Description</FormLabel>
                <FormControl>
                  <Textarea disabled={isPending} {...field} />
                </FormControl>
                <FormDescription>
                  This description will be displayed to your guild members.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button type="submit" disabled={isPending}>
              {!isPending ? (
                <>
                  <AiTwotoneSave className="mr-1.5 size-6" />
                  Update
                </>
              ) : (
                <>
                  <LuLoader2 className="mr-1.5 size-6 animate-spin" />
                  Updating...
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/${guildId}/events/${eventId}/interactions`,
                )
              }
            >
              Skip
              <LuArrowRight className="ml-1.5 size-4" />
            </Button>
          </div>
        </form>
      ) : (
        <LuLoader2 className="m-auto size-12 min-h-80 animate-spin" />
      )}
    </Form>
  );
}
