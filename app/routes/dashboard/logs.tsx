import {Accordion, Stack, Textarea, Title} from "@mantine/core";
import {authenticator} from "~/services/auth.server";
import {LoaderFunction} from "@remix-run/node";
import {getLogData} from "~/services/db.server";
import {useLoaderData} from "@remix-run/react";

export const loader: LoaderFunction = async ({request}) => {
    const user: any = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    const logData = await getLogData();

    console.log(logData);

    return logData;
}

export default function Logs () {
    const loaderData = useLoaderData();

    return (
        <Stack style={{color: "white"}}>
            <Title order={4}>
                Logs
            </Title>
            <Textarea autosize readOnly>
                {JSON.stringify(loaderData, null, 2)}
            </Textarea>
        </Stack>
    )
}