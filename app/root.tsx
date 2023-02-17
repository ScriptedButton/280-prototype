import type {LoaderFunction, MetaFunction} from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { MantineProvider, createEmotionCache } from '@mantine/core';
import { StylesPlaceholder } from '@mantine/remix';
import { theme } from './theme';
import {authenticator} from "~/services/auth.server";
import {redirect} from "@remix-run/node";

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
});

createEmotionCache({ key: 'mantine' });

export const loader: LoaderFunction = async ({request, params}) => {
    const user: any = await authenticator.isAuthenticated(request);

    return user;
}

export default function App() {
  return (
      <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
        <html lang="en">
        <head>
          <StylesPlaceholder />
          <Meta />
          <Links />
        </head>
        <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        </body>
        </html>
      </MantineProvider>
  );
}