import type { z } from "zod";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LuArrowRight } from "react-icons/lu";

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
import { addEventSetupRequestValidator } from "@giverve/validators";

import useGetEvent from "../hooks/use-get-event";

const formSchema = addEventSetupRequestValidator;

export default function EventSetupForm() {
  const router = useRouter();
  const guildId = String(router.query.guildId);
  const eventId = String(router.query.eventId);

  const { data, isLoading } = useGetEvent();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guildId,
      title: data?.title ?? "",
      description: data?.description ?? "",
    },
  });

  function onSubmit(_: z.infer<typeof formSchema>) {
    void router.push(`/dashboard/${guildId}/events/${eventId}/interactions`);
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

        <Button>
          Next
          <LuArrowRight className="ml-2 size-4" />
        </Button>
      </form>
    </Form>
  );
}
