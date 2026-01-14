import React from "react";
import { getSession } from "@/libs/auth-public";
import { redirect } from "next/navigation";
import FormSignIn from "./_FormSignIn";

async function SignInPage() {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <section
      style={{
        backgroundImage: `url('/front/auth-bg.png')`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#fff3ce",
        backgroundSize: "cover",
      }}
    >
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-xl-5 col-lg-7 col-md-9">
            <div className="authWrap">
              <div className="authbody d-black mb-4">
                <div className="card rounded-4 p-sm-5 p-4">
                  <div className="card-body p-0">
                    <FormSignIn />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignInPage;
