import type {ActionFunction} from "@remix-run/node";
import {redirect} from "@remix-run/node";
import {PrismaClient} from "@prisma/client";

async function addIssue(data: any) {
    const prisma = new PrismaClient()

    return await prisma.issue.create({
        data: {
            name: data.name,
            description: data.description,
            options: {
                create: data.options.map((option: string) => {
                    return {
                        name: option,
                    }
                })
            },
            ballotId: data.ballotId
        }
    });
}

async function updateIssue(data: any) {
    const prisma = new PrismaClient()

    return await prisma.issue.update({
        where: {
            id: data.id
        },
        data: {
            name: data.name,
            description: data.description,
            options: {
                create: data.options.map((option: string) => {
                    return {
                        name: option,
                    }
                })
            }
        }
    })
}

async function deleteIssue(data: any) {
    const prisma = new PrismaClient()

    return await prisma.issue.delete({
        where: {
            id: data.id
        }
    })
}

export const action: ActionFunction = async ({request, params}) => {
    const formData = await request.formData();

    const type = formData.get("type") as string;

    switch(type) {
        case "save":

            await updateIssue({
                id: formData.get("issueId") as string,
                name: formData.get("issueName") as string,
                description: formData.get("issueDescription") as string,
                options: (formData.get("options") as string)?.split(","),
                ballotId: params.ballotId
            })
            break;
        case "delete":
            await deleteIssue({
                id: formData.get("issueId") as string
            })
            break;
        case "add":
            await addIssue({
                name: formData.get("issueName") as string,
                description: formData.get("issueDescription") as string,
                ballotId: params.ballotId
            })
            break;
    }

    return redirect(`/dashboard/setup/${params.ballotId}`)
}