import {
    Stack,
    Box,
    Group
} from "@mantine/core";
import type {LoaderFunction} from "@remix-run/node";
import {authenticator} from "~/services/auth.server";
import {useLoaderData} from "@remix-run/react";
import {MdBallot, MdHistory, MdPerson, MdPoll, MdSettings} from "react-icons/md";
import {TerminalButton} from "~/components";

export const loader: LoaderFunction = async ({request}) => {
    const user: any = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    return user;
}

export default function Dashboard() {
    return (
        <Stack m={10} align={"center"}>
            <VotingScreen/>
        </Stack>
    );
}
function VotingScreen() {
    const user = useLoaderData();

    return (
        <Box h={"100%"} w={"100%"} bg={"blue"} p={10}>
                <Group spacing={50}>
                    <TerminalButton to={"terminal"} icon={MdBallot}/>
                    {user.roleId == "64057d7f4f179eb9ab55f27e" && (<>
                            <TerminalButton to={"setup"} icon={MdSettings} text={"Setup"}/>
                            <TerminalButton to={"results"} icon={MdPoll} text={"Results"}/>
                            <TerminalButton to={"logs"} icon={MdHistory} text={"Logs"}/>
                            <TerminalButton to={"users"} icon={MdPerson} text={"Users"}/>
                    </>
                    )}
                </Group>
        </Box>
    )
}