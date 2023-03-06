import {PrismaClient} from '@prisma/client'
import {json} from "@remix-run/node";

const prisma = new PrismaClient()

export async function updateBallot(ballotId: string, data: any) {
    return await prisma.ballot.update({
        where: {
            id: ballotId
        },
        data: data
    })
}

export async function addIssue(data: any) {
    const ballotData = await prisma.ballot.create({
        data: {
            name: data.name,
        }
    })
}

export async function setBallotStatus(ballotId: string, state: boolean) {
    const prisma = new PrismaClient()

    const ballotData = await prisma.ballot.update({
        where: {
            id: ballotId
        },
        data: {
            active: state
        }
    })

    console.log(ballotData)

    return ballotData;
}

export async function getBallots() {
    const prisma = new PrismaClient()

    const ballotData = await prisma.ballot.findMany()

    return ballotData;
}

export async function getBallot(ballotId: string) {
    const prisma = new PrismaClient()

    const ballotData = await prisma.ballot.findFirst(
        {
            where: {
                id: ballotId
            }
        }
    )

    return ballotData;
}

export async function getActiveBallot() {
    const prisma = new PrismaClient()

    return await prisma.ballot.findFirst(
        {
            where: {
                active: true
            }
        }
    );
}

export async function getBallotIssues(ballotId: string) {
    const prisma = new PrismaClient()

    const ballotData = await prisma.issue.findMany(
        {
            where: {
                Ballot: {
                    id: ballotId,
                    active: true
                },
            }
        }
    )

    return ballotData;
}

export async function addBallot(data: any) {
    const prisma = new PrismaClient()

    const ballotData = await prisma.ballot.create({
        data: {
            name: data.name,
        }
    })

    return ballotData;
}

export async function deleteBallot(ballotId: string) {
    const prisma = new PrismaClient()

    const ballotData = await prisma.ballot.delete({
        where: {
            id: ballotId
        }
    })

    return ballotData;
}

export async function getActiveBallotIssues() {
    const prisma = new PrismaClient()

    const ballotData = await prisma.issue.findMany(
        {
            where: {
                Ballot: {
                    active: true
                },
            }
        }
    )

    return ballotData;
}