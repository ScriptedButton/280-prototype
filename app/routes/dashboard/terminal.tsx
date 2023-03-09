import {Stack, Button, ScrollArea, Text} from "@mantine/core";
import {Form, useLoaderData} from "@remix-run/react";
import {IssueCard} from "~/components";
import {getActiveBallot, getActiveBallotIssues, hasVoted} from "~/services/db.server";
import type { LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {authenticator} from "~/services/auth.server";

export const loader: LoaderFunction = async ({request}) => {
    const user = await authenticator.isAuthenticated(request);

    const activeBallot = await getActiveBallot();

    const [ballotIssues, voted] = await Promise.all([
        getActiveBallotIssues(),
        hasVoted(user?.id as string, activeBallot?.id as string)
    ])



    return json({
        ballotIssues: ballotIssues,
        user: user,
        voted: voted
    })
}

export default function TerminalIndex () {
    const loaderData = useLoaderData();

    if (loaderData.voted && loaderData.ballotIssues.length > 0) {
        return (
            <Stack align={"center"} justify={"center"} style={{height: "100%"}}>
                <Text color={"white"}>You have already voted</Text>
            </Stack>
        )
    }

    else if (loaderData.ballotIssues.length == 0) {
        return (
            <Stack align={"center"} justify={"center"} style={{height: "100%"}}>
                <Text color={"white"}>No active ballot found</Text>
            </Stack>
        )
    }

    return (
            <ScrollArea style={{height: "100%"}}>
                <Form method={"post"} action={"../summary"}>
                    <Stack>
                        {loaderData.ballotIssues.map((issue: any) => {
                            return (
                                <IssueCard issue={issue} key={issue.id}/>
                            )
                        })}
                        <Button type={"submit"} variant={"filled"} fullWidth color={"dark"} pb={0}>
                            Submit
                        </Button>
                    </Stack>
                </Form>
            </ScrollArea>
    )
}