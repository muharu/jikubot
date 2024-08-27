import type { UseFormReturn } from "react-hook-form";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { useToast } from "./use-toast";

export default function useFormRouteAbort<T extends Record<string, string>>(
  form: UseFormReturn<T>,
) {
  const router = useRouter();
  const currentEventId = String(router.query.eventId);
  const { toast } = useToast();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const urlObj = new URL(url, window.location.origin);
      const targetEventId = urlObj.pathname
        .split("/")
        .find((segment) => segment === currentEventId);

      if (targetEventId && !form.formState.isValid) {
        void form.trigger();
        router.events.emit("routeChangeError");
        toast({
          variant: "destructive",
          title: "Form is invalid",
          description: "Please fill out the form correctly.",
        });
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw "Failed to validate form.";
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [form, form.formState.isValid, router, toast, currentEventId]);
}
