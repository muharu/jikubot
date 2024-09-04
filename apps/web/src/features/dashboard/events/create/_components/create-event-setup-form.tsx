import type { z } from "zod";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@giverve/ui/select";
import { Skeleton } from "@giverve/ui/skeleton";
import { Textarea } from "@giverve/ui/textarea";
import { eventSetupRequestValidator } from "@giverve/validators";

import { useMultiStepCreateEventFormStore } from "~/state/create-event-multiform-store";
import { trpc } from "~/utils/trpc";

const formSchema = eventSetupRequestValidator;

export function CreateEventSetupForm() {
  const { guildId } = useParams<{ guildId: string }>();
  const { data: guilds, isLoading: isGuildLoading } =
    trpc.dashboard.guilds.getChannels.useQuery({
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

  useEffect(() => {
    if (setupEventStep.channelId) {
      form.setValue("channelId", setupEventStep.channelId);
    }
  }, [form, setupEventStep.channelId]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 font-bold"
      >
        <div className="grid w-full gap-4 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g Daily Boss Raid" {...field} />
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
            name="channelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Channel</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  {!isGuildLoading ? (
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select channel to post event." />
                      </SelectTrigger>
                    </FormControl>
                  ) : (
                    <Skeleton className="flex h-10 w-full animate-pulse items-center bg-[#f0f0f0]">
                      <LuLoader2 className="ml-2.5 size-5 animate-spin" />
                    </Skeleton>
                  )}
                  <SelectContent className="bg-white">
                    {guilds?.map((channel) => (
                      <SelectItem key={channel.id} value={channel.id}>
                        # {channel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
