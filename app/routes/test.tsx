import { Stack } from "@mantine/core";
import {SmartCard} from "~/components";
import {LoaderFunction} from "@remix-run/node";
import {authenticator} from "~/services/auth.server";
import {useLoaderData} from "@remix-run/react";

export const loader: LoaderFunction = async({request, params}) => {
    const user = await authenticator.isAuthenticated(request);

    return user;
}

export default function Test () {
    const user = useLoaderData();

    return (
        <Stack align={"center"}>
            <SmartCard user={user}/>
        </Stack>
    )
}