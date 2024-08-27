import type { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import { LuArrowRight } from "react-icons/lu";

import { buttonVariants } from "@giverve/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@giverve/ui/form";
import { Input } from "@giverve/ui/input";
import { Textarea } from "@giverve/ui/textarea";
import { patchEventRequestValidator } from "@giverve/validators";

import { useFormFieldValidation } from "~/hooks/useform-field-validation";
import useFormRouteAbort from "~/hooks/useform-route-abort";
import useGetEvent from "../hooks/use-get-event";

const formSchema = patchEventRequestValidator;

export default function EventSetupForm() {
  const router = useRouter();
  const guildId = String(router.query.guildId);
  const eventId = String(router.query.eventId);

  const { data, isLoading } = useGetEvent();

  const eventSetup = JSON.parse(
    localStorage.getItem("eventSetup") ?? "{}",
  ) as EventSetup;

  // Determine if we should use eventSetup values
  const isEventSetupValid = eventSetup.eventId === eventId;

  // Determine default values for title and description
  const defaultTitle = isEventSetupValid
    ? (eventSetup.title ?? data?.title ?? "")
    : (data?.title ?? "");
  const defaultDescription = isEventSetupValid
    ? (eventSetup.description ?? data?.description ?? "")
    : (data?.description ?? "");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventId,
      title: defaultTitle,
      description: defaultDescription,
    },
  });

  useFormPersist("eventSetup", {
    watch: form.watch,
    setValue: form.setValue,
    storage: window.localStorage,
    validate: true,
  });

  useFormFieldValidation(form, "title");
  useFormFieldValidation(form, "description");
  useFormRouteAbort(form);

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
              <FormLabel>Event Description</FormLabel>
              <FormControl>
                <Textarea disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Link
          href={`/dashboard/${guildId}/events/${eventId}/interactions`}
          className={buttonVariants()}
        >
          Next
          <LuArrowRight className="ml-1.5 size-4 items-center" />
        </Link>
      </form>
    </Form>
  );
}

interface EventSetup {
  eventId?: string;
  title?: string;
  description?: string;
}
