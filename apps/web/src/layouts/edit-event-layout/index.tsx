import EventEditSidebaMenu from "./sidebar-menu";

export default function EditEventLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mt-6 flex gap-x-4">
      <EventEditSidebaMenu />
      {children}
    </div>
  );
}
