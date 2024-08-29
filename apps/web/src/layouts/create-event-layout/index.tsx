import { EventEditSidebaMenu } from "./sidebar-menu";
import { EventEditTopbarMenu } from "./topbar-menu";

export function CreateEventLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <EventEditTopbarMenu />
      <div className="mt-6 flex gap-x-4">
        <EventEditSidebaMenu />
        {children}
      </div>
    </>
  );
}
