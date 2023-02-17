import { Stack } from "@mantine/core";
import type {ActionFunction, LoaderFunction} from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const issueName = formData.get("issueName");
    const issueDescription = formData.get("issueDescription");
    console.log(issueName, issueDescription)

}

export const loader: LoaderFunction = async ({ request, params }) => {
    return {
        props: {}
    }
}

export default function VoteSummary () {
    return (
        <Stack>

        </Stack>
    )
}