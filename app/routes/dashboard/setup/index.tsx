import {
    Accordion,
    ActionIcon,
    Badge,
    Button,
    Card,
    Checkbox,
    Group, Loader,
    MultiSelect,
    ScrollArea,
    Stack,
    Textarea,
    Title
} from "@mantine/core";
import type {ActionFunction, LoaderFunction} from "@remix-run/node"
import ballotData from "~/ballotData.json"
import {Form, NavLink, useActionData, useLoaderData, useNavigation, useSubmit, useTransition} from "@remix-run/react";
import fs from "fs";
import {MdSettings} from "react-icons/md";
import {json, redirect} from "@remix-run/node";
import {getBallots, setBallotStatus, addIssue} from "~/services/db.server";
import {useState} from "react";

async function deleteIssue (issueId: string) {
    const filePath = fs.realpathSync("app/ballotData.json");
    const filteredData = ballotData.filter((issue: any) => issue.issueId !== issueId);


    // take a backup of the file including the timestamp
    fs.writeFileSync(`app/backups/ballotData-${Date.now()}.json`, JSON.stringify(ballotData, null, 4), { flag: 'w' });

    fs.writeFileSync(filePath, JSON.stringify(filteredData, null, 4));
}

async function saveIssue (issueId: string, jsonData: any) {
    // update issueName, issueDescription, and issueOptions
    ballotData.forEach((issue: any) => {
        if (issue.issueId === issueId) {
            issue.issueName = jsonData.issueName;
            issue.issueDescription = jsonData.issueDescription;
            issue.issueOptions = jsonData.issueOptions;
        }
    });

    const filePath = fs.realpathSync("app/ballotData.json");
    const backupPath = fs.realpathSync(`app/backups/ballotData-${Date.now()}.json`)

    // take a backup of the file including the timestamp
    fs.writeFileSync(`app/backups/ballotData-${Date.now()}.json`, JSON.stringify(ballotData, null, 4), { flag: 'w' });

    // write the new data to the file
    fs.writeFileSync(filePath, JSON.stringify(ballotData, null, 4));
}


export const loader: LoaderFunction = async({request, params}) => {
    return await getBallots();
}

export const action: ActionFunction = async ({request, params}) => {
    const formData = await request.formData();
    const actionType = formData.get("type");

    switch(actionType) {
        case "save":
            await saveIssue(formData.get("issueId") as string, {
                issueName: formData.get("issueName") as string,
                issueDescription: formData.get("issueDescription") as string,
                issueOptions: (formData.get("options") as string).split(",")
            });
            break;
        case "delete":
            await deleteIssue(formData.get("issueId") as string);
            break;
        case "add":
            await addIssue({
                name: formData.get("ballotName") as string,
            });

            break;
        case "activate":
            const isActive = !!formData.get("isActive");
            return await setBallotStatus(formData.get("ballotId") as string, isActive);
    }

    return "";
}

export default function Setup () {
    const ballotDataJson = useLoaderData();

    return (
        <Stack align={"stretch"}>
            <Title color={"white"} align={"center"}>
                Ballot Configuration
            </Title>

            <ScrollArea.Autosize maxHeight={"60vh"} style={{height: "100%"}}>
                <Accordion bg={"dark"} variant={"contained"}>
                        {ballotDataJson.map((ballot: any) => {
                            return (
                                <BallotCard key={ballot.id} data={ballot}/>
                            )
                        })}
                </Accordion>
            </ScrollArea.Autosize>


            <Button component={NavLink} to={"add"} fullWidth color={"green"}>
                Add Ballot
            </Button>
        </Stack>
    )
}

function BallotCard (props: any) {
    const submit = useSubmit();
    const transition = useTransition();
    const actionData = useActionData();

    function handleChange(event: any) {
        submit(event.currentTarget, { replace: true });
    }

    return (
        <Card>
            <Group>
                <Group>
                    <Form method={"post"} onChange={handleChange}>
                        {transition.state === "submitting" ? <Loader size={"sm"}/> : <Checkbox name={"isActive"} defaultChecked={(actionData?.active && actionData.id == props.data.id) || (actionData?.id != props.data.id && props.data.active)}/>}
                        <input type={"hidden"} name={"type"} value={"activate"}/>
                        <input type={"hidden"} name={"ballotId"} value={props.data.id}/>
                    </Form>
                    <ActionIcon component={NavLink} to={props.data.id}>
                        <MdSettings/>
                    </ActionIcon>
                </Group>
                <Title>
                    {props.data.name}
                </Title>
            </Group>
        </Card>
    )
}