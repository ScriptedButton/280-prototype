import {Card, Text, Image, Stack, Title, Group, Select, Box} from "@mantine/core";
import {NavLink} from "@remix-run/react";
import {MdBallot} from "react-icons/md";

export function SmartCard (props: any) {
    return (
        <Card bg={"white"} w={200} h={300}>
            <Stack align={"center"} justify={"center"}>
                <Image bg="cyan" src={"bob_picture.png"} height={150} width={100}/>
                <Title color={"black"}>
                    {props.user.profile.name}
                </Title>
                 <Image height={30} width={30} src={props.user.profile.affiliation == "REP" ? "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Republicanlogo.svg/1179px-Republicanlogo.svg.png" : "https://newsforkids.net/wp-content/uploads/2018/02/1050px-DemocraticLogo.svg_-500x488.png"}/>
            </Stack>
        </Card>
    )
}

export function IssueCard (props: any) {
    return (
        <Card bg={"dark"}>
            <Stack>
                <Text>
                    {props.issue.name}
                </Text>
                <input type={"hidden"} name={`issue[${props.issue.id}][name]`} value={props.issue.name}/>
                <Select withinPortal={true} data={props.issue.options} placeholder={"Select an option"} name={`issue[${props.issue.id}][selection]`}
                        onChange={(value) => console.log(value)}/>
            </Stack>
        </Card>
    )
}

export function TerminalButton (props: any) {
    return (
        <Box w={60} h={60} bg={props.bgColor || "white"} sx={{"&:hover": {backgroundColor: props.bgHoverColor || "gray"}}}>
            <NavLink to={props.to} prefetch={"intent"}>
                <props.icon size={60} color={props.iconColor || "black"}/>
            </NavLink>
            <Text align={"center"} color={props.textColor || "white"}>
                {props.text || "Vote"}
            </Text>
        </Box>
    )
}