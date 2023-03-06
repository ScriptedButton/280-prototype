import {Stack, Button, ScrollArea} from "@mantine/core";
import {Form, useLoaderData} from "@remix-run/react";
import {IssueCard} from "~/components";
import { getActiveBallotIssues} from "~/services/db.server";
import type { LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";

export const loader: LoaderFunction = async () => {
    const ballotIssues = await getActiveBallotIssues()

    console.log(ballotIssues)

    return json({
        ballotIssues: ballotIssues
    })
}

export default function TerminalIndex () {
    const loaderData = useLoaderData();

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