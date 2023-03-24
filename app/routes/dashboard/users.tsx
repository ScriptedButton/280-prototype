import {Badge, Card, SimpleGrid, Stack, Title} from "@mantine/core";
import {LoaderFunction} from "@remix-run/node";
import {authenticator} from "~/services/auth.server";
import {getVoters} from "~/services/db.server";
import {useLoaderData} from "@remix-run/react";

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
                            <Title order={3}>
                                {voter.name}
                            </Title>
                            <Badge>
                                {voter.votes.length > 0 ? "Voted" : "Not Voted"}
                            </Badge>
                        </Card>
                    )
                })}
            </SimpleGrid>
        </Stack>
    )
}