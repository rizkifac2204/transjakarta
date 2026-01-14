import prisma from "./prisma";
import { getConditionByAuth } from "./condition";

// === GET ===

export async function getFilteredInfografisData(table, config, dateFilter) {
  const baseWhere = await getConditionByAuth();

  let extraWhere = {};
  extraWhere = dateFilter ? { tanggal: dateFilter } : {};
  if (table === "pemohon") {
    extraWhere = {};
  }

  const where = {
    ...baseWhere,
    ...extraWhere,
  };

  const result = {};

  for (const field of config.fields) {
    // Jika tipe chart 'number', ambil jumlah record saja
    if (field.chartType === "number") {
      const count = await prisma[table].count({ where });
      result[field.column] = count;
    } else {
      // Untuk chart selain 'number', lakukan groupBy berdasarkan kolom
      const group = await prisma[table].groupBy({
        by: [field.column],
        _count: { _all: true },
        where,
      });

      result[field.column] = group.map((item) => ({
        label: item[field.column] || "(null)",
        count: item._count._all,
      }));
    }
  }

  return result;
}
