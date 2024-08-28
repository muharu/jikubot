import EventEditSidebaMenu from "./sidebar-menu";
import EventEditTopbarMenu from "./topbar-menu";

export default function EditEventLayout({
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
