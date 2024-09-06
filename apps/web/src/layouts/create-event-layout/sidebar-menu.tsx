import { AiTwotoneHighlight, AiTwotoneLike } from "react-icons/ai";

import { cn } from "@giverve/ui";
import { buttonVariants } from "@giverve/ui/button";

import { useMultiStepCreateEventFormStore } from "~/state/create-event-multiform-store";

export function EventEditSidebaMenu() {
  const currentStep = useMultiStepCreateEventFormStore(
    (state) => state.currentStep,
  );

  return (
    <aside className="-mt-1 hidden min-w-52 flex-col gap-y-2.5 lg:flex">
      <div
        className={cn(
          buttonVariants({
            variant: currentStep === 1 ? "noShadow" : "default",
          }),
          "pointer-events-none h-10 w-full select-none justify-start border text-lg font-bold",
          currentStep !== 1 ? "bg-white font-medium" : "",
        )}
      >
        <AiTwotoneHighlight className="mr-1.5 size-7" />
        Event Setup
      </div>

      <button
        className={cn(
          buttonVariants({
            variant: currentStep === 2 ? "noShadow" : "default",
          }),
          "pointer-events-none h-10 w-full select-none justify-start border text-lg font-bold",
          currentStep !== 2 ? "bg-white font-medium" : "",
        )}
      >
        <AiTwotoneLike className="mr-1.5 size-6" />
        Interactions
      </button>

      {/* <div
        className={cn(
          buttonVariants({
            variant: currentStep === 3 ? "noShadow" : "default",
          }),
          "pointer-events-none h-10 w-full select-none justify-start border text-lg font-bold",
          currentStep !== 3 ? "bg-white font-medium" : "",
        )}
      >
        <AiTwotoneStop className="mr-1.5 size-6" />
        Limits
      </div>

      <div
        className={cn(
          buttonVariants({
            variant: currentStep === 4 ? "noShadow" : "default",
          }),
          "pointer-events-none h-10 w-full select-none justify-start border text-lg font-bold",
          currentStep !== 4 ? "bg-white font-medium" : "",
        )}
      >
        <AiTwotoneBell className="mr-1.5 size-6" />
        Notifications
      </div> */}
    </aside>
  );
}
