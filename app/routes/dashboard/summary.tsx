import {Badge, Button, Card, ScrollArea, Stack, Title} from "@mantine/core";
import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import {saveAs} from 'file-saver';
import {useActionData} from "@remix-run/react";
import {authenticator} from "~/services/auth.server";

export const action: ActionFunction = async ({request}) => {
    const user = await authenticator.isAuthenticated(request);

    const formData = await request.formData();
    const value = Object.fromEntries(formData.entries());

    const issues = Object.values(value);

    const chunkSize = 2; // specify the size of each chunk
    const chunks = []; // create an empty array to store the chunks

    for (let i = 0; i < issues.length; i += chunkSize) {
        var chunk = issues.slice(i, i + chunkSize); // get a slice of two elements from the original array
        chunks.push(chunk); // push the slice into the chunks array
    }


    console.log({chunks});

    // return a json array for each issue splitting it by issue[issueId]


    // return a json array of the form data splitting each issue into its own object
    return {
        json: chunks,
        user: user?.profile?.name
    }
}

export const loader: LoaderFunction = async ({request, params}) => {
    return "This route only accepts POST requests";
}

export default function VoteSummary() {
    const actionData = useActionData();
    return (
        <ScrollArea sx={{height: "100%"}}>
            <Stack style={{color: "white"}}>
                {actionData?.json ? <Title>Vote Summary for {actionData?.user}</Title> : <Title>Vote Summary</Title>}
                <Stack>
                    {actionData?.json?.map((issue: any) => {
                        return (
                            <Card>
                                <Title order={3}>
                                    {issue[0]}
                                </Title>
                                <Badge>
                                    {issue[1]}
                                </Badge>
                            </Card>
                        )
                    })
                    }
                </Stack>
                <Button color={"dark"} onClick={() => {
                    const votingReceipt = `
Voting Receipt for ${actionData?.user}
Time Received: ${new Date().toLocaleString()}
                
${actionData?.json.map((issue: any) => {
                        return (
                            `
Issue: ${issue[0]}
Vote: ${issue[1]}
`
                        )
                    }).join('')}
`
                    var file = new Blob([votingReceipt], {type: "text/plain;charset=utf-8"}); // create a file object with your JSON string
                    saveAs(file, `${actionData?.user}_VotingReceipt_${new Date().toLocaleTimeString()}.txt`); // save the file using FileSaver.js
                }}>
                    Generate Voting Receipt
                </Button>
            </Stack>
        </ScrollArea>
    )
}