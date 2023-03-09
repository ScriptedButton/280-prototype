import {Card, Stack, Title, Text, Group, Badge} from "@mantine/core";
import type {LoaderFunction} from "@remix-run/node";
import {authenticator} from "~/services/auth.server";
import {getActiveBallotIssues} from "~/services/db.server";
import {useLoaderData} from "@remix-run/react";

export const loader: LoaderFunction = async ({request}) => {
    const user: any = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    return {
        user,
        issues: await getActiveBallotIssues()
    }
}

export default function Results () {
    const loaderData = useLoaderData();

    return (
        <Stack align={"stretch"} style={{color: "white"}}>
            <Title align={"center"}>
                Results
            </Title>

            {loaderData.issues.map((issue: any) => {
                return (
                    <ResultCard key={issue.issueId} issue={issue}/>
                )
            })}
        </Stack>
    )
}

function ResultCard (props: any) {
    return (
        <Card bg={"dark"}>
            <Stack align={"stretch"}>
                <Text>
                    {props.issue.name}
                </Text>
                {props.issue.options.map((option: any) => {
                    return (
                        <Card key={option.id} color={"blue"}>
                            <Group position={"apart"}>
                                {option.name}
                                <Badge color={"blue"}>
                                    {option.votes.length}
                                </Badge>
                            </Group>
                        </Card>
                    )
                })}
            </Stack>
        </Card>
    )
}