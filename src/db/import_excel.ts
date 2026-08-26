import * as xlsx from "xlsx";
import { hash } from "bcryptjs";
import {
  db,
  instansis,
  dosens,
  users,
  mahasiswas,
  kkl_klps,
  kkl_agts,
  laporans,
} from "./index";

async function main() {
  console.log("Reading Excel file...");
  const workbook = xlsx.readFile(
    "C:\\Skripsi\\Judul\\Judul 2\\APPS\\DATA_20LOGBOOK_FIXED.xlsx"
  );
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

  let currentInstansi = "";
  let currentNim = "";
  let currentNama = "";

  // Caches to prevent duplicate inserts and queries
  const instansiCache: Record<string, number> = {};
  const dosenCache: Record<string, number> = {};
  const kklKlpCache: Record<string, number> = {};
  const kklAgtCache: Record<string, number> = {};

  let instansiCounter = 1;

  for (let i = 2; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    // Check if it's a new master row or continuing row
    const instansiCol = row[1];
    const nimCol = row[2];
    const namaCol = row[3];
    
    // In excel some rows have empty data to merge with the above
    if (instansiCol && String(instansiCol).trim() !== "") {
      currentInstansi = String(instansiCol).trim();
    }
    if (nimCol && String(nimCol).trim() !== "") {
      currentNim = String(nimCol).trim();
    }
    if (namaCol && String(namaCol).trim() !== "") {
      currentNama = String(namaCol).trim();
    }

    const tanggal = row[row.length - 4];
    const jam = row[row.length - 3];
    const kegiatan = row[row.length - 2];
    const jarakRaw = row[row.length - 1];

    if (!tanggal || !kegiatan) continue;

    // 1. Process Instansi
    if (!instansiCache[currentInstansi]) {
      const kodeInstansi = `INST-${String(instansiCounter).padStart(3, "0")}`;
      const [insertedInstansi] = await db.insert(instansis).values({
        kode: kodeInstansi,
        nama: currentInstansi,
        alamat: "Alamat Belum Diatur",
      });
      instansiCache[currentInstansi] = insertedInstansi.insertId;
      instansiCounter++;
      
      // 2. Process Dosen (1 Dosen per Instansi/Kelompok)
      const dosenNidn = `DSN-${String(instansiCounter).padStart(3, "0")}`;
      const dosenPassword = await hash(dosenNidn, 10);
      
      const [insertedDosenUser] = await db.insert(users).values({
        username: dosenNidn,
        password: dosenPassword,
        role_id: 2, // Assuming role 2 is for non-mahasiswa like Dosen (if exist, or any dummy role)
        is_active: true,
      });

      const [insertedDosen] = await db.insert(dosens).values({
        nidn: dosenNidn,
        password: dosenPassword,
        nama: `Dosen Pembimbing ${currentInstansi.substring(0, 20)}`,
        email: `${dosenNidn}@dosen.undipa.ac.id`,
        user_id: insertedDosenUser.insertId,
      });
      dosenCache[currentInstansi] = insertedDosen.insertId;

      // 3. Process Kelompok KKL
      const [insertedKlp] = await db.insert(kkl_klps).values({
        nama: `KLP - ${currentInstansi.substring(0, 30)}`,
        kkl_periode_id: 1,
        instansi_id: insertedInstansi.insertId,
        dosen_id: insertedDosen.insertId,
      });
      kklKlpCache[currentInstansi] = insertedKlp.insertId;
      console.log(`Created Instansi & Kelompok: ${currentInstansi}`);
    }

    const currentInstansiId = instansiCache[currentInstansi];
    const currentKlpId = kklKlpCache[currentInstansi];

    // 4. Process Mahasiswa & KKL Agt
    if (!kklAgtCache[currentNim]) {
      const mhsPassword = await hash(currentNim, 10);
      
      const [insertedUser] = await db.insert(users).values({
        username: currentNim,
        password: mhsPassword,
        role_id: 3, // 3 = role Mahasiswa
        is_active: true,
      });

      const [insertedMhs] = await db.insert(mahasiswas).values({
        nim: currentNim,
        password: mhsPassword,
        nama: currentNama,
        email: `${currentNim}@mhs.undipa.ac.id`,
        jurusan_id: 2,
        user_id: insertedUser.insertId,
      });

      const [insertedAgt] = await db.insert(kkl_agts).values({
        kkl_klp_id: currentKlpId,
        mahasiswa_id: insertedMhs.insertId,
      });
      
      kklAgtCache[currentNim] = insertedAgt.insertId;
      console.log(`Registered Mahasiswa: ${currentNim} - ${currentNama}`);
    }

    const currentAgtId = kklAgtCache[currentNim];

    // 5. Process Laporan
    // Convert Tanggal from DD/MM/YYYY to YYYY-MM-DD
    let formattedDate = "";
    if (typeof tanggal === "string" && tanggal.includes("/")) {
      const parts = tanggal.split("/");
      if (parts.length === 3) {
        formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    } else {
       // fallback if it's already a date or something else
       formattedDate = "2025-01-01";
    }

    // Convert Jarak from "6 M" to number
    let jarakNum = 0;
    if (jarakRaw) {
      const extracted = String(jarakRaw).replace(/[^\d.]/g, '');
      if (extracted) {
        jarakNum = parseFloat(extracted);
      }
    }

    await db.insert(laporans).values({
      kkl_agt_id: currentAgtId,
      tanggal: new Date(formattedDate),
      jam: String(jam || "00:00-00:00"),
      aktifitas: String(kegiatan),
      jarak: jarakNum.toString(),
      status: "valid",
    });
  }

  console.log("Import data selesai!");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
