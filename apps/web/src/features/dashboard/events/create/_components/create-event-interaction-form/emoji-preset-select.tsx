import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@giverve/ui/select";

export function EmojisPresetSelect() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a preset" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectGroup>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="yes-maybe-no">Yes Maybe No</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
