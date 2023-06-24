import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase.types";
import { DocumentType } from "@/types/documents.types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DocumentHeader from "@/app/(application)/documents/[document_id]/(controls)/_components/documentHeader";

/*=========================================== COMPONENT ===========================================*/

export default async function DocumentIdLayout({
  children,
  params: { document_id }, // will be a page or nested layout
}: {
  children: React.ReactNode;
  params: { document_id: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: document, error } = await supabase
    .rpc("get_documents", { document_id_input: document_id })
    .returns<DocumentType[]>();

  if (error || !document || !document[0]) {
    redirect("/documents");
  }

  return <DocumentHeader props={document[0]}>{children}</DocumentHeader>;
}
