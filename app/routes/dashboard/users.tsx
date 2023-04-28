import {Badge, Button, Card, SimpleGrid, Stack, Title} from "@mantine/core";
import {ActionFunction, LoaderFunction} from "@remix-run/node";
import {authenticator} from "~/services/auth.server";
import {getVoters, removeAllVotes, removeUserVotes} from "~/services/db.server";
import {Form, useLoaderData} from "@remix-run/react";

const DEBUG_MODE = false;

export const action: ActionFunction = async({request, params}) => {
    const user: any = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    const formData = await request.formData();
    const action = formData.get("action");

    switch(action) {
        case "remove":
            const voterId = formData.get("voterId") as string;
            const remove =  await removeUserVotes(voterId);
            console.log(remove)
            break;
        case "removeAll":
            const removeAll = await removeAllVotes();
            console.log(removeAll)
            break;
    }

    return {
        status: 302,
        headers: {
            location: "/dashboard/voters"
        }
    }
}

export const loader: LoaderFunction = async ({request}) => {
    const user: any = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    const voters = await getVoters();

    console.log(voters)

    return voters;
}

export default function Users () {
    const loaderData = useLoaderData();
    return (
        <Form method={"post"}>
        <Stack style={{color: "white"}}>
            <Title style={{
                color: "white"
            }}>
                Voters
            </Title>
            <SimpleGrid cols={3}>
                {loaderData.map((voter: any) => {
                    return (

                        <Card key={voter.id}>
                            <Stack>
                                <Title order={3}>
                                    {voter.name}
                                </Title>
                                <Badge>
                                    {voter.votes.length > 0 ? "Voted" : "Not Voted"}
                                </Badge>
                                {DEBUG_MODE && <Button color={"red"} fullWidth type={"submit"} name={"action"} value={"remove"}>
                                    Remove Votes
                                </Button>}
                                <input type={"hidden"} name={"voterId"} value={voter.id}/>
                            </Stack>
                        </Card>
                    )
                })}
            </SimpleGrid>
            {DEBUG_MODE && <Button color={"red"} fullWidth type={"submit"} name={"action"} value={"removeAll"}>
                    Remove all Votes
                </Button> }
        </Stack>
        </Form>
    )
}