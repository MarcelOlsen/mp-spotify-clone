'use client'

import { supabaseClient } from "@/libs/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from '@supabase/auth-ui-shared';

const Page = () => {
  return (
    <Auth supabaseClient={supabaseClient} appearance={{ theme: ThemeSupa }} />
  )
}

export default Page
