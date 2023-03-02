import {Stack, Card, Title, TextInput, Button, Group, Center, Text} from "@mantine/core"
import type {ActionArgs} from "@remix-run/node";
import {Form} from "@remix-run/react"
import {authenticator} from "~/services/auth.server";

export async function action({ request }: ActionArgs) {
    // we call the method with the name of the strategy we want to use and the
    // request object, optionally we pass an object with the URLs we want the user
    // to be redirected to after a success or a failure
    return await authenticator.authenticate("user-pass", request, {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
    });
};


export default function LoginIndex () {
    return (
        <Center style={{height: "100vh"}}>
            <Stack>
                <Card w={300}>
                    <Title align={"center"}>
                        Login
                    </Title>
                    <Form method={"post"}>
                        <Stack>
                            <TextInput name="username" label="Username" placeholder="Username" />
                            <TextInput name="password" label="Password" type={"password"} placeholder="Password" />
                            <Button type={"submit"}>Login</Button>
                        </Stack>
                    </Form>
                    <Text align={"center"} size={10} mt={20}>
                        ElectionTech Security
                    </Text>
                </Card>
            </Stack>
        </Center>
    )
}