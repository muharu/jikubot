import type { z } from "zod";
import { useParams } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@giverve/ui/select";
import { Textarea } from "@giverve/ui/textarea";
import { eventSetupRequestValidator } from "@giverve/validators";

import { useMultiStepCreateEventFormStore } from "~/state/create-event-multiform-store";
import { trpc } from "~/utils/trpc";

const formSchema = eventSetupRequestValidator;

export function CreateEventSetupForm() {
  const { guildId } = useParams<{ guildId: string }>();
  const { data: guilds } = trpc.dashboard.guilds.getChannels.useQuery({
    guildId,
  });

  const setupEventStep = useMultiStepCreateEventFormStore(
    (state) => state.formData.setupEventStep,
  );

  const updateFormData = useMultiStepCreateEventFormStore(
    (state) => state.updateFormData,
  );

  const nextStep = useMultiStepCreateEventFormStore((state) => state.nextStep);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channelId: "",
      title: setupEventStep.title,
      description: setupEventStep.description,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFormData({
      setupEventStep: {
        channelId: values.channelId,
        title: values.title,
        description: values.description,
      },
    });

    nextStep();
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
                <Input placeholder="e.g Valorant Stack 5 Tonite" {...field} />
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
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                This description will be displayed to your guild members.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="channelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Channel</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="max-w-md">
                    <SelectValue placeholder="Select channel to post event." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {guilds?.map((channel) => {
                    return (
                      <SelectItem key={channel.id} value={channel.id}>
                        {channel.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">
            Next
            <LuArrowRight className="ml-1.5 size-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
