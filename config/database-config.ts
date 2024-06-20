// database.config.ts
import Dexie from "dexie";

const database = new Dexie("alpha-seeker-database");
database.version(1).stores({
  volumeTable: 'saved_datetime_ms, uticker, uticker_last_price, data_details',
});

export const volumeTable = database.table('volumeTable');

// Function to clear all entries in volumeTable
export async function truncateVolumeTable() {
  try {
    await volumeTable.clear();
    console.log("volumeTable has been truncated successfully.");
  } catch (error) {
    console.error("Failed to truncate volumeTable:", error);
  }
}

export default database;