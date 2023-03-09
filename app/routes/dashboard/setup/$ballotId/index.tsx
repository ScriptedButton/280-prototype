import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import { json, redirect} from "@remix-run/node";
import {PrismaClient} from '@prisma/client'
import {Form, useLoaderData} from "@remix-run/react";
import {
    Accordion,
    Badge,
    Button,
    Card,
    Group,
    Modal,
    MultiSelect,
    Stack,
    Textarea,
    TextInput
} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {deleteBallot, getBallot, getBallotIssues} from "~/services/db.server";

export const loader: LoaderFunction = async({params}) => {
    const prisma = new PrismaClient()


    const [ballot, issues] = await Promise.all([getBallot(params.ballotId as string), getBallotIssues(params.ballotId as string)]);


    return json({issues: issues, ballot: ballot});
}

function updateBallotName (ballotId: string, ballotName: string) {
    const prisma = new PrismaClient();

    return prisma.ballot.update({
        where: {
            id: ballotId
        },
        data: {
            name: ballotName
        }
    })
}


export const action: ActionFunction = async ({request, params}) => {
    const prisma = new PrismaClient();
    const formData = await request.formData();

    const ballotId = params.ballotId as string;
    const issueName = formData.get("issueName") as string;
    const issueDescription = formData.get("issueDescription") as string;
    const issueOptions = (formData.get("options") as string)?.split(",");

    switch(formData.get("action")) {
        case "update":
            const ballotName = formData.get("ballotName") as string;
            await updateBallotName(ballotId, ballotName);
            break;
        case "add":
            await prisma.issue.create({
                data: {
                    name: issueName,
                    description: issueDescription,
                    options: {
                        create: issueOptions.map((option: string) => {
                            return {
                                name: option,
                            }
                        })
                    },
                    ballotId: ballotId
                }
            });

            break;
        case "delete":
            await deleteBallot(params.ballotId as string);
            return redirect("/dashboard/setup");
    }


    return redirect(`/dashboard/setup/${ballotId}`);
}

export default function BallotIndex () {
    const issueData = useLoaderData();


    return (
        <Stack>
            <BallotSetup/>
            <Accordion bg={"dark"}>
                {issueData.issues.map((issue: any) => {
                    return (
                        <BallotSetupItem issue={issue} key={issue.id}/>
                    )
                })}
            </Accordion>
            <IssueModal/>
        </Stack>
    )
}

function BallotSetup() {
    const ballotData = useLoaderData();

    return (
        <Card bg={"dark"}>
            <Form method={"post"}>
                <Stack>
                    <TextInput name={"ballotName"} defaultValue={ballotData.ballot.name}/>
                    <Group grow>
                        <Button name={"action"} value={"update"} type={"submit"} variant={"filled"} color={"green"}>Update Ballot Name</Button>
                        <Button name={"action"} value={"delete"} type={"submit"} variant={"filled"} color={"red"}>Delete Ballot</Button>
                    </Group>
                </Stack>
            </Form>
        </Card>
    )
}

function IssueModal () {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Modal opened={opened} onClose={close} title="Add Issue">
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
                            <Button onClick={close} type={"submit"} name={"action"} value={"add"} variant={"filled"} color={"green"}>Add</Button>
                        </Group>
                    </Stack>
                </Form>
            </Modal>

            <Button onClick={open} color={"green"}>
                Add Issue
            </Button>
        </>
    )
}


function BallotSetupItem (props: any) {
    const options = props.issue.options.map((option: any) => {
        return {
            label: option.name,
            value: option.id
        }
    })


    return (
        <Accordion.Item value={props.issue.id}>
            <Accordion.Control>
                {props.issue.name}
            </Accordion.Control>
            <Accordion.Panel>
                <Form method={"post"} action={`${props.issue.id}`}>
                    <input type={"hidden"} name={"issueId"} value={props.issue.id}/>
                    <Stack>
                        <Badge>Title</Badge>
                        <Textarea name={"issueName"} defaultValue={props.issue.name}/>
                        <Badge>Description</Badge>
                        <Textarea name={"issueDescription"} defaultValue={props.issue.description}/>
                        <Badge>Options</Badge>
                        <MultiSelect name={"options"} data={options} placeholder={"Select options"} defaultValue={options.map(((option: { value: any; }) => option.value))} creatable={true} searchable={true}
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
            </Accordion.Panel>
        </Accordion.Item>
    )
}