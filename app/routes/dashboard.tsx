import {Card, Stack, Title, Text, Select, Button, TextInput} from "@mantine/core";
import type {LoaderFunction} from "@remix-run/node";
import {authenticator} from "~/services/auth.server";
import {Form, useLoaderData} from "@remix-run/react";
import is from "@sindresorhus/is";

export const loader: LoaderFunction = async ({request, params}) => {
    const user: any = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    return user;
}

export default function Dashboard() {
    return (
        <Stack m={10}>
            <Text size="xl" weight={500}>
                ElectionTech Security
            </Text>
            <VotingTerminal/>
        </Stack>
);
}

function VotingTerminal () {
    const ballotData = require("~/ballotData.json");
    const loaderData = useLoaderData();
    const formData = new FormData();
    return (
            <Stack>
                <Card>
                    <Title>
                        Voting Terminal
                    </Title>
                    <Text>
                        Hi {loaderData.username}! You are logged in!
                    </Text>
                </Card>
                <Form method={"post"} action={"/summary"}>
                <Stack>
                    {ballotData.map((issue: any) => {
                        console.log(issue)
                        return (
                            <IssueCard key={issue.issueId} issue={issue}/>
                        )
                    })}
                    <Button type={"submit"}>
                        Submit
                    </Button>
                </Stack>
                </Form>
            </Stack>
    )
}

function IssueCard (props: any) {
    return (
        <Card>
            <Title>
                {props.issue.issueName}
            </Title>
            <Text>
                {props.issue.issueDescription}
            </Text>
            <input type={"hidden"} name={`issue[${props.issue.issueId}][name]`} value={props.issue.issueName}/>
            <input type={"hidden"} name={`issue[${props.issue.issueId}][description]`} value={props.issue.issueDescription}/>
            <Select data={props.issue.issueOptions} withinPortal={true} placeholder={"Select an option"} name={`issue[${props.issue.issueId}][selection]`}
                    onChange={(value) => console.log(value)}/>

        </Card>
    )
}