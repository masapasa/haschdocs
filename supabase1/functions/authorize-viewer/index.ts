import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { errorHandler } from "../_shared/errorHandler.ts";
import { supabase, supabaseAdmin } from "../_shared/supabaseClient.ts";
import { Database } from "../../../types/supabase.types.ts";

type GetLinkProps = Database["public"]["Tables"]["tbl_links"]["Row"] &
  Database["public"]["Tables"]["tbl_documents"]["Row"] &
  Database["public"]["Tables"]["tbl_document_versions"]["Row"];

type AuthorizeViewerType = {
  view_token: string;
};

type AuthorizeViewerProps = {
  link_id_input: string;
  email_input?: string;
  password_input?: string;
  ip: string | undefined;
  geo: string | undefined;
  ua: {
    isBot: boolean;
    ua: string;
    browser: {
      name?: string;
      version?: string;
    };
    device: {
      model?: string;
      type?: string;
      vendor?: string;
    };
    engine: {
      name?: string;
      version?: string;
    };
    os: {
      name?: string;
      version?: string;
    };
    cpu: {
      architecture?: string;
    };
  };
};

/* --------------------------------- SUCCESS RETURN FUNCTION -------------------------------- */

function validateViewer(
  input_props: AuthorizeViewerProps,
  link_props: GetLinkProps
) {
  /* -------------------------- VALIDATION FUNCTIONS -------------------------- */

  // Validate if email is correct
  function validateEmail(email_input?: string) {
    if (!email_input) return false;

    const email_regex = new RegExp(
      /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
    );

    return email_regex.test(email_input);
  }

  // Validate if password matches
  function validatePassword(password_input?: string) {
    if (!password_input) return false;

    return password_input === link_props.link_password;
  }

  // Validate is part of restricted domains
  function validateDomain(email_input?: string, domains?: string) {
    const splitEmail = email_input?.toLowerCase().split("@") ?? [];

    if (!domains) return true;

    if (splitEmail.length < 2) return false;

    const domain = splitEmail[1];

    const domains_list = domains.toLowerCase().split(",");

    return domains_list.some((part) => {
      if (part.includes("@")) {
        return part === email_input;
      }
      return domain.includes(part);
    });
  }

  /* -------------------------- EXECUTION BODY -------------------------- */

  if (link_props.is_email_required && !validateEmail(input_props.email_input)) {
    return false;
  }

  if (
    link_props.is_password_required &&
    !validatePassword(input_props.password_input)
  ) {
    return false;
  }

  if (
    link_props.is_domain_restricted &&
    !validateDomain(
      input_props.email_input,
      link_props.restricted_domains ?? undefined
    )
  ) {
    return false;
  }

  return true;
}

/* -------------------------------------------------------------------------- */
/*                                MAIN FUNCTION                               */
/* -------------------------------------------------------------------------- */

serve(async (req) => {
  const input_props = await req.json();

  const {
    link_id_input,
    email_input,
    ip,
    geo,
    ua,
  } = input_props as AuthorizeViewerProps;

  const { data: link_props, error } = await supabase
    .rpc("get_link_props", { link_id_input })
    .returns<GetLinkProps[]>()
    .maybeSingle();

  if (error) {
    return errorHandler(error);
  }

  if (!link_props) {
    return errorHandler(Error("Invalid link"));
  }

  /* ------------------ INSERT VIEW LOG ----------------- */

  const { data: insert_view, error: insert_view_error } = await supabaseAdmin
    .from("tbl_views")
    .insert({
      link_id: link_id_input,
      viewer: email_input && email_input.length > 0 ? email_input : "Anonymous",
      ip: ip,
      geo: geo,
      ua: ua,
      is_authorized: false,
    })
    .select("view_id")
    .maybeSingle();

  if (insert_view_error || !insert_view || !insert_view.view_id) {
    return errorHandler(insert_view_error);
  }

  /* ------------------ CHECK IF DOCUMENT AND LINK ARE ACTIVE ----------------- */

  const { is_enabled, is_active } = link_props;

  if (!is_enabled || !is_active) {
    return errorHandler(Error("Invalid link"));
  }

  /* -------------------------- CHECK FOR EXPIRATION -------------------------- */

  const { is_expiration_enabled, expiration_date } = link_props;

  if (is_expiration_enabled && expiration_date) {
    const expiration_date_obj = new Date(expiration_date);

    if (new Date() > expiration_date_obj) {
      return errorHandler(Error("Link expired"));
    }
  }

  /* -------------------------- CHECK FOR AUTHORIZATION -------------------------- */

  const is_valid_viewer = validateViewer(input_props, link_props);

  if (!is_valid_viewer) {
    return errorHandler(Error("Unauthorized"));
  }

  console.log(input_props, insert_view);

  const { data: authorize_data, error: authorize_error } = await supabaseAdmin
    .rpc("authorize_viewer", {
      view_id_input: insert_view.view_id,
    })
    .returns<AuthorizeViewerType>();

  if (authorize_error || !authorize_data) {
    console.error(
      `Error in authorization RPC - ${JSON.stringify(authorize_error)}`
    );
    return errorHandler(error);
  }

  return new Response(JSON.stringify(authorize_data), {
    headers: { "Content-Type": "application/json" },
  });
});
