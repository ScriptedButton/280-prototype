import {
    Card,
    Stack,
    Title,
    Text,
    Select,
    Button,
    Paper,
    Box,
    Center,
    Flex,
    Group,
    ActionIcon, MediaQuery, ScrollArea, LoadingOverlay
} from "@mantine/core";
import type {LoaderFunction} from "@remix-run/node";
import {authenticator} from "~/services/auth.server";
import {Form, Link, NavLink, Outlet, useLoaderData, useTransition} from "@remix-run/react";
import {MdArrowLeft, MdBallot} from "react-icons/md";
import {useEffect, useState} from "react";

export const loader: LoaderFunction = async ({request, params}) => {
    const user: any = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    return user;
}

export default function Dashboard() {
    return (
        <Stack m={10} align={"center"}>
            <VotingMachine/>
        </Stack>
    );
}

function VotingTerminal () {
    const ballotData = require("~/ballotData.json");
    const loaderData = useLoaderData();
    const formData = new FormData();
    return (
        <Stack>
            <Card>
                <Title>
                    Voting Terminal
                </Title>
                <Text>
                    Hi {loaderData.name}! You are logged in!
                </Text>
            </Card>
            <Form method={"post"} action={"/summary"}>
                <Stack>
                    {ballotData.map((issue: any) => {

                        return (
                            <IssueCard key={issue.issueId} issue={issue}/>
                        )
                    })}
                    <Button type={"submit"}>
                        Submit
                    </Button>
                </Stack>
            </Form>
        </Stack>
    )
}

function IssueCard (props: any) {
    return (
        <Card>
            <Title>
                {props.issue.issueName}
            </Title>
            <Text>
                {props.issue.issueDescription}
            </Text>
            <input type={"hidden"} name={`issue[${props.issue.issueId}][name]`} value={props.issue.issueName}/>
            <input type={"hidden"} name={`issue[${props.issue.issueId}][description]`} value={props.issue.issueDescription}/>
            <Select data={props.issue.issueOptions} withinPortal={true} placeholder={"Select an option"} name={`issue[${props.issue.issueId}][selection]`}/>
        </Card>
    )
}

function VotingMachine(props: any) {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 1000);
        return function cleanup() {
            clearInterval(timer)
        }

    });

    return (
        <Center h={"100%"} mt={0}>
            <MediaQuery query={"(max-width: 1200px)"} styles={{width: "100vw", height: "100vh"}}>
                <Paper w={"50vw"} h={"78vh"} bg={"white"} p={10}>
                    <VotingScreen/>
                    <Group position={"apart"} pt={10}>
                        <ActionIcon mt={5}>
                            <NavLink to={"."}>
                                <MdArrowLeft size={50} color={"black"}/>
                            </NavLink>
                        </ActionIcon>
                        <Box component={Flex} bg={"black"} w={200} h={50} p={2}>
                            <Stack spacing={0}>
                                <Text color={"green"}>
                                    User: {useLoaderData().name}
                                </Text>
                                <Text color={"green"}>
                                    {date.toLocaleTimeString()}
                                </Text>
                            </Stack>
                        </Box>
                    </Group>
                </Paper>
            </MediaQuery>
        </Center>
    )
}

function VotingScreen(props: any) {
    const transition = useTransition();
    return (
        <>

            <Box h={"90%"} w={"100%"} bg={"blue"} p={10}>
                <ScrollArea style={{height: "100%"}}>
                    {transition.state === ("submitting" || "loading") && <LoadingOverlay visible={transition.state === ("submitting" || "loading")} overlayBlur={2}/>}
                    <Outlet/>
                </ScrollArea>
            </Box>
        </>
    )
}

function VotingScreenButton(props: any) {
    return (
        <Box w={50} h={50} bg={"white"}>
            <NavLink to={"terminal"} prefetch={"intent"}>
                <MdBallot size={50} color={"black"}/>
            </NavLink>
        </Box>
    )
}