import {Stack, Title, Text, Card, Button, Select, ScrollArea} from "@mantine/core";
import ballotData from "~/ballotData.json";
import {Form} from "@remix-run/react";

export default function TerminalIndex () {
    return (
            <ScrollArea style={{height: "100%"}}>
                <Form method={"post"} action={"../summary"}>
                    <Stack>
                        {ballotData.map((issue: any) => {
                            return (
                                <IssueCard key={issue.issueId} issue={issue}/>
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

function IssueCard (props: any) {
    return (
        <Card>
            <Stack>
                <Text>
                    {props.issue.issueName}
                </Text>
                <input type={"hidden"} name={`issue[${props.issue.issueId}][name]`} value={props.issue.issueName}/>
                <Select withinPortal={true} data={props.issue.issueOptions} placeholder={"Select an option"} name={`issue[${props.issue.issueId}][selection]`}
                        onChange={(value) => console.log(value)}/>
            </Stack>
        </Card>
    )
}