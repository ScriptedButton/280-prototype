import {
    Card,
    Stack,
    Title,
    Text,
    Select,
    Button,
    TextInput,
    Paper,
    Box,
    Center,
    Overlay,
    Flex,
    SimpleGrid
} from "@mantine/core";
import type {LoaderFunction} from "@remix-run/node";
import {authenticator} from "~/services/auth.server";
import {Form, NavLink, Outlet, useLoaderData} from "@remix-run/react";
import {MdBallot} from "react-icons/md";

export const loader: LoaderFunction = async ({request, params}) => {
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
function VotingScreen(props: any) {
    return (
        <Box h={"100%"} w={"100%"} bg={"blue"} p={10}>
            <SimpleGrid cols={3}>
                <VotingScreenButton/>
            </SimpleGrid>
        </Box>
    )
}

function VotingScreenButton(props: any) {
    return (
        <Box w={60} h={60} bg={"white"} sx={{"&:hover": {backgroundColor: "gray"}}}>
            <NavLink to={"terminal"}>
                <MdBallot size={60} color={"black"}/>
            </NavLink>
            <Text align={"center"} color={"white"}>
                Vote
            </Text>
        </Box>
    )
}