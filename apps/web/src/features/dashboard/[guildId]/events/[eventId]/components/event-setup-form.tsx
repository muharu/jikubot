import type { z } from "zod";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

import { useAutoSave } from "~/context/autosave-context";
import { api } from "~/utils/api";
import useGetEvent from "../hooks/use-get-event";

const formSchema = patchEventRequestValidator;

export default function EventSetupForm() {
  const router = useRouter();
  const utils = api.useUtils();
  const eventId = String(router.query.eventId);
  const { setAutoSaving } = useAutoSave();

  const { data, isLoading } = useGetEvent();

  const { mutate } = api.dashboard.event.patch.useMutation({
    onSuccess: (data) => {
      utils.dashboard.event.getOne.setData(
        { eventId: data.eventId },
        {
          eventId: data.eventId,
          title: data.title,
          description: data.description,
        },
      );
      setAutoSaving(false);
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

  async function handleBlur(field: keyof z.infer<typeof formSchema>) {
    const isValid = await form.trigger(field);

    if (isValid) {
      const currentValue = form.getValues()[field];
      const originalValue = data?.[field];

      if (currentValue !== originalValue) {
        setAutoSaving(true);
        const values = form.getValues();
        mutate({
          ...values,
          [field]: currentValue,
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4 font-bold">
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
                  onBlur={() => handleBlur("title")}
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
                <Textarea
                  disabled={isLoading}
                  {...field}
                  onBlur={() => handleBlur("description")}
                />
              </FormControl>
              <FormDescription>
                This description will be displayed to your guild members.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
