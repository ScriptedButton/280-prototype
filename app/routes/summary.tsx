import {Card, Stack, Text } from "@mantine/core";
import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import {useActionData} from "@remix-run/react";
import {authenticator} from "~/services/auth.server";

export const action: ActionFunction = async ({ request }) => {
    const user = await authenticator.isAuthenticated(request);

    const formData = await request.formData();
    const value = Object.fromEntries(formData.entries());
    console.log({ value });

    // return a json array of the form data splitting each issue into its own object
    return {
        json: value,
        user: user?.username
    }
}

export const loader: LoaderFunction = async ({ request, params }) => {
    return "This route only accepts POST requests";
}

export default function VoteSummary () {
    const actionData = useActionData();
    return (
        <Stack p={10}>
            {actionData?.json ? <h1>Vote Summary for {actionData?.user}</h1>  : <h1>Vote Summary</h1>}
            <Card>
                <Stack>
                    {actionData && Object?.entries(actionData?.json)?.map(([key, value]) => {
                        return (
                            <div key={key}>
                                <Text>
                                    {value}
                                </Text>
                            </div>
                        )
                    })
                    }
                </Stack>
            </Card>
        </Stack>
    )
}