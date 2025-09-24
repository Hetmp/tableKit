export function updateRowModel(
  data: any[],
  rowIndex: number,
  columnName: string,
  newValue: any
): any[] {
  if (!data[rowIndex]) return data;
  return data.map((row, idx) =>
    idx === rowIndex ? { ...row, [columnName]: newValue } : row
  );
}