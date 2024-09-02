import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@giverve/ui/table";

const emojis = [
  {
    id: "12321313131",
    icon: "INV001",
    name: "Accept",
    limit: 50,
  },
];

export function CreateEventInteractionsTable() {
  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Emojis</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Limit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {emojis.map((emoji) => (
          <TableRow className="bg-white" key={emoji.id}>
            <TableCell className="font-base">{emoji.icon}</TableCell>
            <TableCell>{emoji.name}</TableCell>
            <TableCell>{emoji.limit}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
