import type {LoaderFunction, MetaFunction} from '@remix-run/node';
import {Form, Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData} from '@remix-run/react';
import {
    MantineProvider,
    createEmotionCache,
    Container,
    Stack,
    Paper,
    Text,
    Center,
    Group,
    Avatar,
    Menu, Button
} from '@mantine/core';
import { StylesPlaceholder } from '@mantine/remix';
import { theme } from './theme';
import {authenticator} from "~/services/auth.server";

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'ElectionTech Security Voting Terminal',
  viewport: 'width=device-width,initial-scale=1',
});

createEmotionCache({ key: 'mantine' });

export const loader: LoaderFunction = async ({request, params}) => {
    const user: any = await authenticator.isAuthenticated(request);

    return user;
}

export default function App() {
    const user = useLoaderData();

  return (
      <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
        <html lang="en">
        <head>
          <StylesPlaceholder />
          <Meta />
          <Links />
        </head>
        <body style={{height: "100vh"}}>
        <Stack h={"100vh"}>
            <Paper bg={"gray"} h={50}>
                <Group position={"right"} h={50} mr={20}>
                    <Menu>
                        <Menu.Target>
                            <Avatar component={Button}/>
                        </Menu.Target>
                        <Menu.Dropdown>
                                {user &&
                                    <Form action={"/logout"} method={"post"}>

                                    <Menu.Item component={Button} type={"submit"}>Logout</Menu.Item>
                                </Form> }
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Paper>
            <Outlet />
        </Stack>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        </body>
        </html>
      </MantineProvider>
  );
}