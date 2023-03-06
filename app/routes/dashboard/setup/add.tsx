import {Form} from "@remix-run/react";
import {Badge, Button, Group, MultiSelect, Stack, Textarea} from "@mantine/core";
import {ActionFunction, redirect} from "@remix-run/node";
import {addBallot} from "~/services/db.server";

export const action: ActionFunction = async ({request}) => {
    const formData = await request.formData();
    const ballotName = formData.get("ballotName");

    const ballot = await addBallot({
        name: ballotName
    });

    return redirect(`/dashboard/setup/${ballot.id}`);
}

export default function Add () {
    return (
        <BallotAdd/>
    )
}

export function BallotAdd () {
    return (
        <Form method={"post"}>
            <input type={"hidden"} name={"ballotId"} value={"1"}/>
            <Stack>
                <Badge>Title</Badge>
                <Textarea name={"ballotName"} defaultValue={"Ballot 1"}/>
                <Button type={"submit"} name={"type"} value={"add"} variant={"filled"} color={"green"}>Add</Button>
            </Stack>
        </Form>
    )
}

export function IssueAdd (props: any) {
    return (
        <Form method={"post"}>
            <input type={"hidden"} name={"issueId"}/>
            <Stack>
                <Badge>Title</Badge>
                <Textarea name={"issueName"}/>
                <Badge>Description</Badge>
                <Textarea name={"issueDescription"}/>
                <Badge>Options</Badge>
                <MultiSelect name={"options"} data={[]} placeholder={"Select options"} creatable={true} searchable={true}
                             getCreateLabel={(query) => `+ Create ${query}`}
                             onCreate={(query) => {
                                 return {value: query, label: query};
                             }}/>
                <Group grow>
                    <Button type={"submit"} name={"type"} value={"save"} variant={"filled"} color={"green"}>Save</Button>
                    <Button type={"submit"} name={"type"} value={"delete"} variant={"filled"} color={"red"}>Delete</Button>
                </Group>
            </Stack>
        </Form>
    )
}