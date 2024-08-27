import type { z } from "zod";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AiTwotoneSave } from "react-icons/ai";
import { LuLoader2 } from "react-icons/lu";

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
import { patchEventRequestValidator } from "@giverve/validators";

import { api } from "~/utils/api";
import useGetEvent from "../hooks/use-get-event";

const formSchema = patchEventRequestValidator;

export default function EventSetupForm() {
  const router = useRouter();
  const utils = api.useUtils();
  const guildId = String(router.query.guildId);
  const eventId = String(router.query.eventId);

  const { data, isLoading } = useGetEvent();

  const { mutate, isPending } = api.dashboard.event.patch.useMutation({
    onSuccess: (data) => {
      utils.dashboard.event.getOne.setData(
        { eventId: data.eventId },
        {
          eventId: data.eventId,
          title: data.title,
          description: data.description,
        },
      );
      void router.push(`/dashboard/${guildId}/events/${eventId}/interactions`);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventId,
      title: data?.title ?? "",
      description: data?.description ?? "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <Form {...form}>
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
                  disabled={isLoading}
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
                <Textarea disabled={isLoading} {...field} />
              </FormControl>
              <FormDescription>
                This description will be displayed to your guild members.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {!isPending ? (
            <>
              <AiTwotoneSave className="mr-1.5 size-6" />
              Save
            </>
          ) : (
            <>
              <LuLoader2 className="mr-1.5 size-6 animate-spin" />
              Saving...
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
