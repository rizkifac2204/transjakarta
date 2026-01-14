import appConfig from "@/configs/appConfig";
import { formatedDate } from "@/utils/formatDate";

export function MessageWelcomeAdmin() {
  return `Halo Administrator ${appConfig.app.name}, Nomor Anda akan dikirim notifikasi jika terdapat Permohonan Informasi, Keberatan, Dan Permohoanan Penelitian Baru. Terimakasih sudah mendaftarkan Nomor Whatsapp pada Aplikasi.

Ini adalah pesan otomatis dari sistem.
Ketik OK dan balas jika anda menerima pesan ini.`;
}

export function EmailWelcomeAdmin() {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 14px;">
      <p>Halo Administrator <strong>${appConfig.app.name}</strong>,</p>
      <p>Email ini akan menerima pesan jika ada Permohonan Informasi, Keberatan, Dan Permohoanan Penelitian Baru.</p>
      <p>Terima kasih telah mendaftarkan Alamat email pada Aplikasi.</p>
    </div>
  `;
}

// ======= Permohonan dibgai menjadi 2, permohonan informasi dan penelitian dengan paramater isPenelitian //

export const MessagePerubahanStatus = (
  tiket,
  email,
  status,
  no_regis,
  response,
  isPenelitian
) => {
  return `Hallo.

Permohonan ${
    isPenelitian ? "Penelitian" : "Informasi"
  } yang anda ajukan kepada ${appConfig.app.name} dengan data :

Tiket : ${tiket}
Email : ${email}
    
Telah ditanggapi oleh Admin. Status aktif pada Permohonan ${
    isPenelitian ? "Penelitian" : "Informasi"
  } tersebut sekarang adalah :

${status}

No Registrasi : ${no_regis}
Pesan Admin   : ${response}

Atau anda dapat melihat detail permohonan ${
    isPenelitian ? "Penelitian" : "Informasi"
  } anda pada link berikut :
${process.env.NEXT_PUBLIC_HOST}/form/result?tiket=${tiket}&email=${email}

Ini adalah pesan otomatis dari sistem.
Ketik OK dan balas jika anda menerima pesan ini.

Terimakasih
${appConfig.app.description}
--${appConfig.app.name}`;
};

export const EmailPerubahanStatus = (
  tiket,
  email,
  status,
  no_regis,
  response,
  isPenelitian
) => {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 14px;">
      <p>Halo,</p>
      <p>Permohonan ${
        isPenelitian ? "Penelitian" : "Informasi"
      } yang Anda ajukan ke <strong>${
    appConfig.app.name
  }</strong> telah ditanggapi dengan rincian berikut:</p>
      <ul>
        <li><strong>Tiket:</strong> ${tiket}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Status:</strong> ${status}</li>
        <li><strong>No Registrasi:</strong> ${no_regis}</li>
        <li><strong>Pesan Admin:</strong> ${response}</li>
      </ul>
      <p>Anda dapat melihat detail permohonan melalui link berikut:</p>
      <p>
        <a href="${
          process.env.NEXT_PUBLIC_HOST
        }/form/result?tiket=${tiket}&email=${email}">
          Lihat Permohonan ${isPenelitian ? "Penelitian" : "Informasi"}
        </a>
      </p>
    </div>
  `;
};

export const MessagePermohonanBaruKepadaAdmin = (
  tiket,
  email,
  isPenelitian
) => {
  return `Permohonan Informasi Baru.

Hai Bapak/Ibu Admin ${
    appConfig.app.name
  }, Anda menerima 1 (Satu) Permintaan Permohonan ${
    isPenelitian ? "Penelitian" : "Informasi"
  } baru dari :

Email       : ${email}
Nomor Tiket : ${tiket}

Silakan Login Website ${appConfig.app.name} kemudian pilih Menu Permohonan ${
    isPenelitian ? "Penelitian" : "Informasi"
  } Untuk Melihat Rincian.

Ini adalah pesan otomatis dari sistem.
Ketik OK dan balas jika anda menerima pesan ini.`;
};

export const EmailPermohonanBaruKepadaAdmin = (tiket, email, isPenelitian) => {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 14px;">
      <p>Permohonan ${
        isPenelitian ? "Penelitian" : "Informasi"
      } Baru telah masuk ke sistem <strong>${appConfig.app.name}</strong>.</p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Nomor Tiket:</strong> ${tiket}</li>
      </ul>
      <p>Silakan login ke halaman admin untuk melihat dan menindaklanjuti Permohonan ${
        isPenelitian ? "Penelitian" : "Informasi"
      } tersebut.</p>
       <p>
        <a href="${process.env.NEXT_PUBLIC_HOST}/admin">
          Menuju Aplikasi
        </a>
      </p>
    </div>
  `;
};

export const MessagePermohonanBaruKepadaPemohon = (
  tiket,
  email,
  isPenelitian
) => {
  return `Salam.

Permohonan ${
    isPenelitian ? "Penelitian" : "Informasi"
  } Anda telah kami terima. Terima kasih telah menyampaikan permohonan ${
    isPenelitian ? "Penelitian" : "Informasi"
  } ke ${appConfig.app.name}.
Setelah diregistrasi, kami akan mengirimkan pemberitahuan tertulis dalam ${
    isPenelitian ? "waktu dekat" : "jangka waktu sesuai PERKI 1 2021"
  }.
Anda dapat melakukan pengecekan informasi yang anda lakukan dengan mengunjungi Website ${
    appConfig.app.name
  } dan mengisi form dengan data sebagai berikut :

Tiket : ${tiket}
Email : ${email}

Atau anda dapat melihat detail Permohonan ${
    isPenelitian ? "Penelitian" : "Informasi"
  } anda pada link berikut :
${process.env.NEXT_PUBLIC_HOST}/form/result?tiket=${tiket}&email=${email}

Ini adalah pesan otomatis dari sistem.
Ketik OK dan balas jika anda menerima pesan ini.`;
};

export const EmailPermohonanBaruKepadaPemohon = (
  tiket,
  email,
  isPenelitian
) => {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 14px;">
      <p>Salam,</p>
      <p>Permohonan ${
        isPenelitian ? "Penelitian" : "Informasi"
      } Anda telah kami terima. Terima kasih telah menyampaikan permohonan ${
    isPenelitian ? "Penelitian" : "Informasi"
  } ke <strong>${appConfig.app.name}</strong>.</p>
      <p>Setelah diregistrasi, kami akan mengirimkan pemberitahuan tertulis dalam ${
        isPenelitian ? "waktu dekat" : "jangka waktu sesuai PERKI 1 2021"
      }.</p>
      <p>Anda dapat mengecek status permohonan Anda melalui link berikut:</p>
      <p>
        <a href="${
          process.env.NEXT_PUBLIC_HOST
        }/form/result?tiket=${tiket}&email=${email}">
          Lihat Permohonan ${isPenelitian ? "Penelitian" : "Informasi"}
        </a>
      </p>
    </div>
  `;
};

export const MessageKeberatanKepadaAdmin = (email) => {
  return `Pengajuan Keberatan.

Hai Admin PPID, Ada Pengajuan Keberatan dari ${email}.
Silakan Buka Website ppid bawaslu dan Login Sebagai Dengan Data Yang Sudah Diberikan Untuk Melihat Rincian Pengajuan Keberatan.

Ini adalah pesan otomatis dari sistem.
Ketik OK dan balas jika anda menerima pesan ini.`;
};

export const EmailKeberatanKepadaAdmin = (email) => {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 14px;">
      <p>Halo Admin,</p>
      <p>Telah masuk pengajuan <strong>Keberatan Informasi</strong> dari:</p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
      </ul>
      <p>Silakan login ke dashboard admin PPID untuk melihat rincian pengajuan keberatan.</p>
    </div>
  `;
};

export const MessageKeberatanKepadaPemohon = (date) => {
  return `Salam.

Pengajuan Keberatan Anda telah kami terima.
Pengajuan Keberatan yang anda ajukan akan segera kami tindak lanjut.
${
  appConfig.app.name
} akan segera menghubungi melalui Nomor HP atau Email sesuai data Pengajuan pada ${formatedDate(
    date
  )}.

Ini adalah pesan otomatis dari sistem.
Ketik OK dan balas jika anda menerima pesan ini.`;
};

export const EmailKeberatanKepadaPemohon = (date) => {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 14px;">
      <p>Salam,</p>
      <p>Pengajuan Keberatan Anda telah kami terima dan akan segera ditindaklanjuti oleh tim <strong>${
        appConfig.app.name
      }</strong>.</p>
      <p>Kami akan menghubungi Anda melalui nomor HP atau email yang Anda lampirkan pada pengajuan pada tanggal <strong>${formatedDate(
        date
      )}</strong>.</p>
    </div>
  `;
};
