"use client";

import { useAuthContext } from "@/providers/auth-provider";
import Link from "next/link";

const ImageBlock = ({ countUser }) => {
  const { user } = useAuthContext();

  return (
    <div
      className="bg-no-repeat bg-cover bg-center p-5 rounded-[6px] relative"
      style={{
        backgroundImage: `url(/assets/images/widget-bg.png)`,
      }}
    >
      <div>
        <div className="text-xl font-medium text-white mb-2">
          <span className="block">Hallo,</span>
          <span className="block">{user?.nama || "Pengguna"}</span>
        </div>
        <p className="text-sm text-white font-normal">
          Kamu diantara{" "}
          <Link href={"/admin/pengguna"}>{countUser} Pengguna</Link> Lainnya
        </p>
      </div>
    </div>
  );
};

export default ImageBlock;
